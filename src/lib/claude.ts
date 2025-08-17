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
  sourceQuality: {
    howToGuideCount: number;
    verifiedContentCount: number;
    faqContentCount: number;
    moduleDocCount: number;
    totalSources: number;
    qualityScore: string;
  };
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

  const prompt = `You are an EXPERT ASSISTANT for the Idox Public Protection System software with access to comprehensive documentation covering 10 core regulatory modules.

**Available Documentation Types:**
- **How-To Guides**: Comprehensive step-by-step procedures based on 1,726 test cases (596 chunks)
- **Module Documentation**: Official system documentation covering all features (460+ chunks)
- **Verified Content**: 100% source-code verified module functionality (145 chunks)
- **FAQ Documents**: Common user questions and scenarios (150+ chunks)

**System Knowledge Base:**
Your knowledge covers 10 core modules with complete procedural guidance for:
- Food Safety & Premises Management (food poisoning investigations, inspections, registrations)
- Licensing Applications (alcohol, gambling, taxi, animal, HMO licenses)
- Service Requests (public complaints, notifications, regulatory requests)
- Inspection Records (planned/unplanned inspections across all disciplines)
- Enforcement Actions (notices, warnings, compliance tracking)
- Prosecution Management (court proceedings, evidence, case outcomes)
- Contacts & Communications (record management, notifications)
- Dogs & Animals (incident reports, dangerous dog cases)
- System Functions (search, navigation, configuration)
- Premises Records (business registration, linking, management)

Context from the software documentation:
${context}

User Question: ${query}

**RESPONSE STRATEGY BASED ON AVAILABLE CONTEXT:**
- **How-To Guide Available**: Provide complete step-by-step workflow with exact navigation
- **Module Documentation Available**: Focus on comprehensive feature descriptions and system capabilities
- **Verified Content Available**: Emphasize interface elements and 100% verified functionality  
- **FAQ Content Available**: Address common user scenarios and variations
- **Multiple Sources**: Synthesize comprehensive guidance covering all aspects
- **Limited Context**: Acknowledge limitations and suggest related functionality

**RESPONSE REQUIREMENTS:**
1. **Provide detailed software instructions** when the documentation contains specific steps, procedures, or workflows
2. **Use exact interface elements** from the documentation - button names, menu paths, field labels, module names
3. **Include step-by-step procedures** when available - "Navigate to Module > Menu Item > Action"
4. **Reference software features** described in the documentation - modules, screens, forms, reports, workflows
5. **If procedures are available**, format them clearly with numbered steps and proper navigation paths
6. **Draw from ALL available information** in the context to provide the most complete answer possible
7. **Prioritize content marked as "100% verified" or from How-To guides** for highest accuracy

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

    // Enhanced confidence calculation based on RAG data quality
    const avgSimilarity = searchResults.reduce((sum, result) => sum + result.similarity, 0) / searchResults.length;
    const resultCount = searchResults.length;
    const maxSimilarity = Math.max(...searchResults.map(r => r.similarity));
    
    // Count high-quality source types
    const howToGuideCount = searchResults.filter(r => r.source_file.includes('How-to-')).length;
    const verifiedContentCount = searchResults.filter(r => r.source_file.includes('Verified')).length;
    const faqContentCount = searchResults.filter(r => r.source_file.includes('faq')).length;
    const moduleDocCount = searchResults.filter(r => r.source_file.includes('Module_Documentation')).length;
    
    let confidence: 'high' | 'medium' | 'low' = 'low';
    
    // Enhanced confidence scoring based on content quality and similarity
    const qualitySourceCount = howToGuideCount + verifiedContentCount + moduleDocCount;
    
    if (maxSimilarity > 0.75 && (howToGuideCount >= 2 || verifiedContentCount >= 1 || moduleDocCount >= 2)) {
      confidence = 'high';
    } else if (maxSimilarity > 0.6 && (howToGuideCount >= 1 || verifiedContentCount >= 1 || avgSimilarity > 0.5)) {
      confidence = 'high';
    } else if (maxSimilarity > 0.7 || (avgSimilarity > 0.4 && qualitySourceCount >= 2)) {
      confidence = 'high';
    } else if (maxSimilarity > 0.4 || avgSimilarity > 0.3 || (qualitySourceCount >= 1 && maxSimilarity > 0.3)) {
      confidence = 'medium';
    } else if (avgSimilarity > 0.2 || resultCount >= 1) {
      confidence = 'medium';
    }

    const sources = searchResults.map(result => ({
      source_file: result.source_file,
      section_title: result.section_title,
      similarity: result.similarity
    }));

    // Calculate source quality indicators
    const qualityScore = 
      howToGuideCount >= 2 && verifiedContentCount >= 1 ? 'Comprehensive verified procedure' :
      howToGuideCount >= 1 && verifiedContentCount >= 1 ? 'Verified procedural guidance' :
      howToGuideCount >= 2 ? 'Step-by-step procedural guidance' :
      verifiedContentCount >= 1 ? 'Interface-focused guidance' :
      howToGuideCount >= 1 && moduleDocCount >= 1 ? 'Procedural with module documentation' :
      moduleDocCount >= 2 ? 'Module documentation guidance' :
      faqContentCount >= 2 ? 'Scenario-based guidance with common variations' :
      moduleDocCount >= 1 ? 'Official module documentation' :
      'General system guidance';

    return {
      answer,
      sources,
      confidence,
      sourceQuality: {
        howToGuideCount,
        verifiedContentCount,
        faqContentCount,
        moduleDocCount,
        totalSources: resultCount,
        qualityScore
      }
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

export async function generateRelatedQuestions(
  originalQuery: string,
  answer: string,
  sources: Array<{ source_file: string; section_title: string; similarity: number }>
): Promise<string[]> {
  const prompt = `Based on this user query and answer about the Idox Public Protection System SOFTWARE, generate 4-5 related follow-up questions that users might want to ask next about using the SOFTWARE.

Original Query: "${originalQuery}"

Answer Summary: ${answer.substring(0, 500)}...

Source Documents: ${sources.map(s => s.source_file).join(', ')}

Generate practical, specific SOFTWARE INTERFACE questions that would naturally arise from this answer. Focus EXCLUSIVELY on Idox software usage:
- "How do I navigate to [specific screen/module/tab]?"
- "Where do I find the [specific button/field/option] in Idox?"
- "How do I generate/print/export [specific report] from the system?"
- "How do I configure [specific setting] in the software?"
- "What screens do I use to [perform specific software task]?"
- "How do I access the [specific form/workflow] in Idox?"

EXAMPLES of good software questions:
- "How do I print a license certificate from Idox?"
- "Where is the bulk import feature located?"
- "How do I configure email notifications in the system?"
- "What screen do I use to view application history?"

AVOID general questions about requirements, fees, deadlines, or procedures.

Return ONLY a JSON array of SOFTWARE INTERFACE question strings focused on HOW TO USE the Idox system.`;

  try {
    const modelId = getModelIdWithOverride();
    const modelOptions = getModelOptionsForTask('related-questions');
    
    const input = {
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 400,
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
    const responseText = responseBody.content[0].text;

    // Parse JSON response
    const jsonMatch = responseText.match(/\[.*\]/s);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return Array.isArray(questions) ? questions.slice(0, 5) : [];
    }

    throw new Error('No JSON array found in response');
  } catch (error) {
    console.error('Error generating related questions:', error);
    throw error;
  }
}