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

  const prompt = `You are an expert assistant for the Idox Public Protection System software, helping users understand how to use this regulatory management software system.

The Idox Public Protection System is a comprehensive software platform used by local authorities to manage Environmental Health, Trading Standards, Licensing, Housing, and other regulatory functions. Users are asking questions about how to use the software features, navigate the system, complete workflows, and perform specific tasks within the application.

Context from the software user guides:
${context}

User Question: ${query}

CRITICAL FORMATTING REQUIREMENTS:
Your response MUST be professionally formatted using proper markdown structure:

1. **Use Clear Headers**: Start with ## Main Topic, use ### for subtopics
2. **Organize into Logical Sections**: Group related information under appropriate headings
3. **Use Numbered Lists for Procedures**: Convert step-by-step processes into numbered lists (1., 2., 3.)
4. **Use Bullet Points for Features/Options**: Use - for lists of items, requirements, or options
5. **Use Bold Text** for **important terms**, **field names**, **button names**, and **key concepts**
6. **Use Code Formatting** for \`system fields\`, \`module names\`, and \`specific UI elements\`
7. **Add Proper Spacing**: Use blank lines between sections for readability
8. **Structure Process Flows**: Break complex procedures into clear, sequential steps
9. **Use Emphasis**: Use *italics* for notes, tips, or additional context

CONTENT REQUIREMENTS:
1. Provide clear, step-by-step instructions for using the Idox software based solely on the provided user guide context
2. Focus on software functionality, navigation, and workflows - not general regulatory advice
3. If the user guides don't contain the specific software instructions, clearly state this
4. Use exact UI element names, button labels, menu paths, and field names from the software
5. Include specific navigation paths (e.g., "Click Module → Menu Item → Action")
6. Reference specific software modules, tabs, and features when helpful
7. Explain software workflows and processes, not regulatory theory
8. When multiple software approaches exist, present them as clear alternatives

EXAMPLE FORMAT:
## How to [Software Task]

### Step 1: Access the Feature
1. **Navigate to**: Click \`Module Name\` → \`Menu Item\` → \`Specific Function\`
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