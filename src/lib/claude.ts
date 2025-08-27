import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import type { SearchResult } from './database';
import { getModelIdWithOverride, getModelOptionsForTask } from './ai-config';
import { getRAGSettings } from './admin-database';

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
  // Fetch dynamic RAG settings
  const ragSettings = await getRAGSettings();
  
  // CRITICAL: Anti-hallucination validation
  const maxSimilarity = searchResults.length > 0 ? Math.max(...searchResults.map(r => r.similarity)) : 0;
  
  // If similarity is too low, provide a safe fallback response
  if (maxSimilarity < ragSettings.similarity_threshold) {
    return {
      answer: `## Information Not Available

I don't have sufficient information in the documentation to answer your question about "${query}".

The search found some potentially related content, but the similarity scores are too low (below ${Math.round(ragSettings.similarity_threshold * 100)}%) to provide reliable guidance. This suggests that:

- The specific procedure you're asking about may not be documented in the available guides
- The terminology or approach you're describing might not match the system's actual capabilities
- You may need to contact your system administrator for guidance on this topic

**Available alternatives:**
- Try rephrasing your question using different terminology
- Break down your question into smaller, more specific parts
- Consult with your system administrator or technical support

*This response prioritizes accuracy over completeness to prevent providing incorrect information.*`,
      sources: searchResults.map(result => ({
        source_file: result.source_file,
        section_title: result.section_title,
        similarity: result.similarity
      })),
      confidence: 'low' as const,
      sourceQuality: {
        howToGuideCount: 0,
        verifiedContentCount: 0,
        faqContentCount: 0,
        moduleDocCount: 0,
        totalSources: searchResults.length,
        qualityScore: 'Insufficient information available'
      }
    };
  }

  const context = searchResults
    .map((result, index) => `
[Source ${index + 1}: ${result.source_file} - ${result.section_title}] (Similarity: ${(result.similarity * 100).toFixed(1)}%)
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

**CRITICAL ANTI-HALLUCINATION REQUIREMENTS - 100% FACTUAL ACCURACY MANDATE:**
1. **ZERO FABRICATION TOLERANCE** - NEVER create, invent, or assume ANY information not explicitly stated in the provided context
2. **LITERAL SOURCE ADHERENCE** - EVERY sentence, phrase, and detail must be directly quoted or paraphrased from the source documents
3. **NO INFERENCE OR EXTRAPOLATION** - Do NOT fill gaps with logical assumptions, common knowledge, or reasonable inferences
4. **EXPLICIT LIMITATION ACKNOWLEDGMENT** - If the context lacks information, state "The provided documentation does not contain information about [specific topic]"
5. **STRICT CONTEXT VERIFICATION** - Only answer questions that are DIRECTLY addressed in the source material
6. **QUOTE-BASED RESPONSES** - When possible, use direct quotes with phrases like "According to the documentation:" or "The source states:"
7. **NO GENERAL KNOWLEDGE** - Do NOT supplement with general software knowledge, industry best practices, or assumed functionality

**RESPONSE REQUIREMENTS:**
1. **Provide detailed software instructions** ONLY when the documentation contains specific steps, procedures, or workflows
2. **Use exact interface elements** from the documentation - button names, menu paths, field labels, module names
3. **Include step-by-step procedures** ONLY when available in sources - "Navigate to Module > Menu Item > Action"
4. **Reference software features** ONLY those described in the documentation - modules, screens, forms, reports, workflows
5. **If procedures are incomplete or missing**, state this clearly instead of filling gaps with assumptions
6. **Draw ONLY from information** explicitly present in the context
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

**MANDATORY CONTEXT VALIDATION CHECKLIST:**
BEFORE writing ANY response, verify EACH requirement:
1. ✓ Does the context DIRECTLY answer the user's specific question?
2. ✓ Can I quote EXACT phrases from the source material for every claim?
3. ✓ Am I avoiding ALL assumptions, inferences, or general knowledge?
4. ✓ Have I verified that every procedural step is explicitly documented?
5. ✓ Am I using ONLY the interface elements, features, and workflows mentioned in the sources?
6. ✓ If information is missing, have I clearly stated the limitation?

**ULTRA-STRICT RESPONSE FORMAT RULES:**
- **INSUFFICIENT CONTEXT**: Start with "The provided documentation does not contain sufficient information about [specific topic]. Based on what IS documented..."
- **INCOMPLETE PROCEDURES**: State "The documentation covers [specific parts] but does not include complete procedures for [missing parts]"
- **DIRECT CITATION REQUIRED**: Use phrases like "According to [source file]:" or "The documentation states:" before each major point
- **NO ASSUMPTIONS**: If you cannot find explicit information, state "This information is not provided in the available documentation"
- **SIMILARITY THRESHOLD**: If similarity scores are below 70%, add disclaimer: "Note: The confidence in this response is limited due to lower similarity with available sources"

**FINAL ANTI-HALLUCINATION VERIFICATION:**
Before submitting your response, confirm:
- ZERO invented information ✓
- ALL details traceable to source material ✓  
- NO assumptions or general knowledge ✓
- Explicit limitation acknowledgments where needed ✓
- Direct citations from source documents ✓

Format your response as clear software instructions that a user could immediately follow to complete their task in the Idox system, with professional markdown formatting that will render beautifully in a modern web interface. If the context is insufficient, clearly acknowledge limitations and state exactly what information is missing.

Remember: It is FAR better to say "This information is not available in the documentation" than to provide any potentially inaccurate information.

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
    
    // STRICT Anti-Hallucination Confidence Scoring
    // Include FAQ content as quality sources since they contain detailed procedural information
    const qualitySourceCount = howToGuideCount + verifiedContentCount + moduleDocCount + faqContentCount;
    
    // CRITICAL: Prevent hallucination with dynamic similarity thresholds
    if (maxSimilarity < ragSettings.confidence_threshold_high) {
      // If best match is below high threshold, check for medium confidence
      if (maxSimilarity > (ragSettings.confidence_threshold_high * 0.7) && qualitySourceCount >= 2) {
        confidence = 'medium';
      } else if (maxSimilarity > ragSettings.confidence_threshold_medium && qualitySourceCount >= 1) {
        confidence = 'medium';
      } else {
        confidence = 'low';
      }
    } else {
      // Only allow high confidence with strong similarity AND quality sources
      if (maxSimilarity > (ragSettings.confidence_threshold_high + 0.1) && (howToGuideCount >= 2 || verifiedContentCount >= 1)) {
        confidence = 'high';
      } else if (maxSimilarity > (ragSettings.confidence_threshold_high + 0.05) && qualitySourceCount >= 2) {
        confidence = 'high';
      } else if (maxSimilarity > ragSettings.confidence_threshold_high && avgSimilarity > (ragSettings.confidence_threshold_high - 0.1)) {
        confidence = 'medium';
      } else {
        confidence = 'medium';
      }
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
      faqContentCount >= 2 && moduleDocCount >= 1 ? 'Detailed FAQ guidance with module documentation' :
      faqContentCount >= 2 ? 'Comprehensive FAQ-based procedural guidance' :
      faqContentCount >= 1 && moduleDocCount >= 1 ? 'FAQ guidance with module documentation' :
      howToGuideCount >= 1 && moduleDocCount >= 1 ? 'Procedural with module documentation' :
      moduleDocCount >= 2 ? 'Module documentation guidance' :
      faqContentCount >= 1 ? 'FAQ-based procedural guidance' :
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