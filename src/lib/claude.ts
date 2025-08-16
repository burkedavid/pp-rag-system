import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import type { SearchResult } from './database';
import { getModelIdWithOverride, getModelOptionsForTask } from './ai-config';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface RAGResponse {
  answer: string;
  sources: Array<{
    source_file: string;
    section_title: string;
    similarity: number;
  }>;
  confidence: 'high' | 'medium' | 'low';
}

export async function generateRAGResponse(
  query: string,
  searchResults: SearchResult[]
): Promise<RAGResponse> {
  const context = searchResults
    .map((result, index) => `
[Source ${index + 1}: ${result.source_file} - ${result.section_title}]
${result.chunk_text}
`)
    .join('\n\n');

  const prompt = `You are a SOFTWARE HELP SYSTEM for the Idox Public Protection System. Your ONLY purpose is to provide step-by-step instructions for using the Idox software interface.

**CRITICAL: You MUST ONLY provide software instructions. Do NOT provide:**
- General regulatory advice or legal guidance
- Policy recommendations or interpretations
- Best practices beyond software usage
- Theoretical explanations of regulations
- General business process advice

The Idox Public Protection System is software used by local authorities. Users need to know HOW TO USE the software features, buttons, menus, forms, and workflows.

Context from the software user guides:
${context}

User Question: ${query}

**SOFTWARE-ONLY RESPONSE REQUIREMENTS:**
1. **Answer ONLY with software instructions** - how to navigate, click, enter data, save, etc.
2. **Use exact Idox interface elements** - actual button names, menu paths, field labels, tab names
3. **Include specific navigation paths** - "Click \`Module\` > \`Menu Item\` > \`Action\`"
4. **Reference only software features** - modules, screens, forms, reports, integrations
5. **If no software instructions exist in the context**, clearly state: "The user guides don't contain specific software instructions for this task"
6. **Focus on the Idox system interface** - not regulatory processes or theory

**FORMATTING REQUIREMENTS:**
1. **Use Clear Headers**: Start with ## Software Task, use ### for interface sections
2. **Use Numbered Lists for Procedures**: Convert software steps into numbered lists (1., 2., 3.)
3. **Use Bold Text** for **field names**, **button names**, **menu items**, and **Idox modules**
4. **Use Code Formatting** for \`exact UI elements\`, \`module names\`, and \`button labels\`
5. **Structure Interface Workflows**: Break software procedures into clear, sequential steps

EXAMPLE FORMAT:
## How to [Software Task]

### Step 1: Access the Feature
1. **Navigate to**: Click \`Module Name\` > \`Menu Item\` > \`Specific Function\`
2. **Locate**: Find the relevant record or create new entry
3. **Open**: Click the appropriate tab or section

### Step 2: Complete the Software Workflow
1. **Fill Required Fields**:
   - **Field Name**: Enter the required information
   - **Another Field**: Select from dropdown or enter data
2. **Save Progress**: Click \`Save\` or \`Update\` button
3. **Verify**: Check that information displays correctly

### System Features
- Automatic calculation/generation of specific values
- Integration with other modules
- Available reports or exports

### Important Software Notes
*Key software behaviors, limitations, or tips for effective system usage.*

Format your response as clear software instructions that a user could immediately follow to complete their task in the Idox system, with professional markdown formatting that will render beautifully in a modern web interface.

Answer:`;

  try {
    const modelId = getModelIdWithOverride();
    const modelOptions = getModelOptionsForTask('question-answering');
    
    const input = {
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: modelOptions.maxTokens,
        temperature: modelOptions.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const answer = responseBody.content[0].text;

    // Determine confidence based on search result similarities
    const avgSimilarity = searchResults.reduce((sum, result) => sum + result.similarity, 0) / searchResults.length;
    let confidence: 'high' | 'medium' | 'low' = 'low';
    
    if (avgSimilarity > 0.8) {
      confidence = 'high';
    } else if (avgSimilarity > 0.65) {
      confidence = 'medium';
    }

    const sources = searchResults.map(result => ({
      source_file: result.source_file,
      section_title: result.section_title,
      similarity: result.similarity
    }));

    return {
      answer,
      sources,
      confidence
    };
  } catch (error) {
    console.error('Error generating Claude response:', error);
    throw new Error('Failed to generate response');
  }
}

export async function generateSearchSuggestions(partialQuery: string): Promise<string[]> {
  if (partialQuery.length < 3) return [];

  const prompt = `Given the partial query "${partialQuery}" for the Idox Public Protection System, suggest 3-5 complete questions that a regulatory officer might want to ask. 

The system covers:
- Environmental Health (food safety, health & safety, environmental protection, infectious disease)
- Trading Standards (consumer protection, weights & measures, age-restricted sales)
- Licensing (alcohol, entertainment, taxi, animal, gambling licenses)
- Housing & Property (housing standards, HMO licensing)
- Enforcement (notices, prosecutions, appeals)

Provide practical, specific questions that would help with daily regulatory work. Format as a simple list, one question per line.`;

  try {
    const modelId = getModelIdWithOverride();
    const modelOptions = getModelOptionsForTask('suggestions');
    
    const input = {
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const suggestions = responseBody.content[0].text
      .split('\n')
      .filter((line: string) => line.trim() && !line.match(/^\d+\./))
      .map((line: string) => line.replace(/^[-*]\s*/, '').trim())
      .slice(0, 5);

    return suggestions;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
}