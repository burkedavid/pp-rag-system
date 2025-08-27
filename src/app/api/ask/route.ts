import { NextRequest, NextResponse } from 'next/server';
import { sql, hybridSearch } from '@/lib/database';
import { generateRAGResponse } from '@/lib/claude';
import { logAIUsage } from '@/lib/ai-audit';
import { generateEmbedding } from '@/lib/embeddings';
import { logQuestion, getRAGSettings } from '@/lib/admin-database';

async function vectorSearch(query: string, limit: number = 5) {
  try {
    // Generate embedding for the query using Amazon Titan
    const queryEmbedding = await generateEmbedding(query);
    
    // Use pgvector cosine similarity search
    const results = await sql`
      SELECT 
        id, source_file, section_title, chunk_text, chunk_index,
        token_count, metadata, created_at,
        1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
      FROM document_chunks
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit};
    `;
    
    return results.map(row => ({
      id: row.id,
      source_file: row.source_file,
      section_title: row.section_title,
      chunk_text: row.chunk_text,
      chunk_index: row.chunk_index,
      token_count: row.token_count,
      similarity: row.similarity,
      created_at: row.created_at,
      embedding: [],
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata
    }));
  } catch (error) {
    console.warn('Vector search failed:', error);
    return [];
  }
}

function generateMockResponse(query: string, searchResults: any[]) {
  if (searchResults.length === 0) {
    return {
      answer: "I couldn't find relevant information in the documentation to answer your question. Please try rephrasing your query or contact your system administrator for assistance.",
      sources: [],
      confidence: 'low' as 'high' | 'medium' | 'low',
      sourceQuality: {
        howToGuideCount: 0,
        verifiedContentCount: 0,
        faqContentCount: 0,
        moduleDocCount: 0,
        totalSources: 0,
        qualityScore: 'No relevant documentation found'
      }
    };
  }

  const topResult = searchResults[0];
  const relevantText = topResult.chunk_text.substring(0, 500);
  
  let answer = `Based on the ${topResult.source_file.replace('.md', '').replace(/^\d+-/, '')}, here's what I found:\n\n`;
  answer += relevantText;
  
  if (relevantText.length < topResult.chunk_text.length) {
    answer += '...';
  }
  
  answer += '\n\nFor complete details, please refer to the source documentation.';

  const sources = searchResults.map(result => ({
    source_file: result.source_file,
    section_title: result.section_title,
    similarity: result.similarity || 0.8
  }));

  const confidence = searchResults.length >= 3 ? 'high' : searchResults.length >= 2 ? 'medium' : 'low';

  // Calculate source quality metrics for fallback
  const howToGuideCount = searchResults.filter(r => r.source_file.includes('How-to-')).length;
  const verifiedContentCount = searchResults.filter(r => r.source_file.includes('Verified')).length;
  const faqContentCount = searchResults.filter(r => r.source_file.includes('faq')).length;
  const moduleDocCount = searchResults.filter(r => r.source_file.includes('Module_Documentation')).length;

  return {
    answer,
    sources,
    confidence: confidence as 'high' | 'medium' | 'low',
    sourceQuality: {
      howToGuideCount,
      verifiedContentCount,
      faqContentCount,
      moduleDocCount,
      totalSources: searchResults.length,
      qualityScore: 'Limited documentation match'
    }
  };
}

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  let questionLogData: any = null;
  
  try {
    // Get dynamic RAG settings
    const ragSettings = await getRAGSettings();
    const { query, limit = ragSettings.source_count } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Initialize question log data
    const userIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    questionLogData = {
      query,
      ip_address: userIP,
      model_used: 'anthropic.claude-sonnet-4-20250514-v1:0',
      search_results_count: 0,
      sources_count: 0,
      similarity_score: 0,
      confidence: 'low' as 'high' | 'medium' | 'low',
      source_quality_score: 'Processing...',
      response_time_ms: 0,
      answer_length: 0,
      how_to_guide_count: 0,
      verified_content_count: 0,
      faq_content_count: 0,
      module_doc_count: 0
    };

    // Use hybrid search combining semantic and keyword search
    const queryEmbedding = await generateEmbedding(query);
    const searchResults = await hybridSearch(queryEmbedding, query, limit);
    
    // Update search metrics
    questionLogData.search_results_count = searchResults.length;
    questionLogData.similarity_score = searchResults.length > 0 
      ? Math.max(...searchResults.map(r => r.similarity)) 
      : 0;
    
    try {
      // Try to use Claude 4.0 for enhanced response generation
      const claudeResponse = await generateRAGResponse(query, searchResults);
      
      const endTime = performance.now();
      
      // Update question log data with successful response
      questionLogData.confidence = claudeResponse.confidence;
      questionLogData.sources_count = claudeResponse.sources.length;
      questionLogData.source_quality_score = claudeResponse.sourceQuality?.qualityScore || 'Unknown';
      questionLogData.response_time_ms = Math.round(endTime - startTime);
      questionLogData.answer_length = claudeResponse.answer.length;
      questionLogData.how_to_guide_count = claudeResponse.sourceQuality?.howToGuideCount || 0;
      questionLogData.verified_content_count = claudeResponse.sourceQuality?.verifiedContentCount || 0;
      questionLogData.faq_content_count = claudeResponse.sourceQuality?.faqContentCount || 0;
      questionLogData.module_doc_count = claudeResponse.sourceQuality?.moduleDocCount || 0;

      // Log the question to admin database
      await logQuestion(questionLogData);
      
      // Log successful AI usage
      await logAIUsage({
        promptType: 'rag-response',
        promptName: 'question-answering',
        endpoint: '/api/ask',
        model: 'anthropic.claude-sonnet-4-20250514-v1:0',
        metrics: {
          inputTokens: Math.ceil(query.length / 4), // Rough estimate
          outputTokens: Math.ceil(claudeResponse.answer.length / 4),
          totalTokens: Math.ceil((query.length + claudeResponse.answer.length) / 4),
          duration: endTime - startTime
        },
        success: true
      });

      return NextResponse.json({
        ...claudeResponse,
        query,
        searchResultCount: searchResults.length,
        searchResults: searchResults, // Include full search results with content
        note: 'AI-powered response using Claude 4.0 with Amazon Titan semantic search'
      });
      
    } catch (claudeError) {
      console.warn('Claude 4.0 unavailable, falling back to keyword search:', claudeError);
      
      const endTime = performance.now();
      
      // Generate fallback response
      const response = generateMockResponse(query, searchResults);
      
      // Update question log data with fallback response
      questionLogData.confidence = response.confidence;
      questionLogData.sources_count = response.sources.length;
      questionLogData.source_quality_score = response.sourceQuality?.qualityScore || 'Fallback mode';
      questionLogData.response_time_ms = Math.round(endTime - startTime);
      questionLogData.answer_length = response.answer.length;
      questionLogData.how_to_guide_count = response.sourceQuality?.howToGuideCount || 0;
      questionLogData.verified_content_count = response.sourceQuality?.verifiedContentCount || 0;
      questionLogData.faq_content_count = response.sourceQuality?.faqContentCount || 0;
      questionLogData.module_doc_count = response.sourceQuality?.moduleDocCount || 0;
      questionLogData.model_used = 'fallback-mode';

      // Log the question to admin database
      await logQuestion(questionLogData);
      
      // Log failed AI usage
      await logAIUsage({
        promptType: 'rag-response',
        promptName: 'question-answering',
        endpoint: '/api/ask',
        model: 'anthropic.claude-sonnet-4-20250514-v1:0',
        metrics: {
          inputTokens: Math.ceil(query.length / 4),
          outputTokens: 0,
          totalTokens: Math.ceil(query.length / 4),
          duration: endTime - startTime
        },
        success: false,
        errorMessage: claudeError instanceof Error ? claudeError.message : 'Unknown error'
      });
      
      return NextResponse.json({
        ...response,
        query,
        searchResultCount: searchResults.length,
        searchResults: searchResults, // Include full search results with content
        note: 'Fallback mode: Claude 4.0 unavailable, using semantic search'
      });
    }

  } catch (error) {
    console.error('RAG query error:', error);
    
    // Log error case if we have question data
    if (questionLogData) {
      const endTime = performance.now();
      questionLogData.response_time_ms = Math.round(endTime - startTime);
      questionLogData.source_quality_score = 'Error occurred';
      questionLogData.model_used = 'error';
      try {
        await logQuestion(questionLogData);
      } catch (logError) {
        console.error('Failed to log error question:', logError);
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error during query processing' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const startTime = performance.now();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '5');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  // Initialize question log data for GET requests
  const userIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  let questionLogData = {
    query,
    ip_address: userIP,
    model_used: 'anthropic.claude-sonnet-4-20250514-v1:0',
    search_results_count: 0,
    sources_count: 0,
    similarity_score: 0,
    confidence: 'low' as 'high' | 'medium' | 'low',
    source_quality_score: 'Processing...',
    response_time_ms: 0,
    answer_length: 0,
    how_to_guide_count: 0,
    verified_content_count: 0,
    faq_content_count: 0,
    module_doc_count: 0
  };

  try {
    // Use hybrid search combining semantic and keyword search
    const queryEmbedding = await generateEmbedding(query);
    const searchResults = await hybridSearch(queryEmbedding, query, limit);
    
    questionLogData.search_results_count = searchResults.length;
    questionLogData.similarity_score = searchResults.length > 0 
      ? Math.max(...searchResults.map(r => r.similarity)) 
      : 0;
    
    try {
      // Try to use Claude 4.0 for enhanced response generation
      const claudeResponse = await generateRAGResponse(query, searchResults);
      
      const endTime = performance.now();
      
      // Update question log data
      questionLogData.confidence = claudeResponse.confidence;
      questionLogData.sources_count = claudeResponse.sources.length;
      questionLogData.source_quality_score = claudeResponse.sourceQuality?.qualityScore || 'Unknown';
      questionLogData.response_time_ms = Math.round(endTime - startTime);
      questionLogData.answer_length = claudeResponse.answer.length;
      questionLogData.how_to_guide_count = claudeResponse.sourceQuality?.howToGuideCount || 0;
      questionLogData.verified_content_count = claudeResponse.sourceQuality?.verifiedContentCount || 0;
      questionLogData.faq_content_count = claudeResponse.sourceQuality?.faqContentCount || 0;
      questionLogData.module_doc_count = claudeResponse.sourceQuality?.moduleDocCount || 0;

      // Log the question
      await logQuestion(questionLogData);
      
      // Log successful AI usage
      await logAIUsage({
        promptType: 'rag-response',
        promptName: 'question-answering',
        endpoint: '/api/ask',
        model: 'anthropic.claude-sonnet-4-20250514-v1:0',
        metrics: {
          inputTokens: Math.ceil(query.length / 4),
          outputTokens: Math.ceil(claudeResponse.answer.length / 4),
          totalTokens: Math.ceil((query.length + claudeResponse.answer.length) / 4),
          duration: endTime - startTime
        },
        success: true
      });

      return NextResponse.json({
        ...claudeResponse,
        query,
        searchResultCount: searchResults.length,
        note: 'AI-powered response using Claude 4.0 with Amazon Titan semantic search'
      });
      
    } catch (claudeError) {
      console.warn('Claude 4.0 unavailable, falling back to keyword search:', claudeError);
      
      const endTime = performance.now();
      const response = generateMockResponse(query, searchResults);
      
      // Update question log data for fallback
      questionLogData.confidence = response.confidence;
      questionLogData.sources_count = response.sources.length;
      questionLogData.source_quality_score = response.sourceQuality?.qualityScore || 'Fallback';
      questionLogData.response_time_ms = Math.round(endTime - startTime);
      questionLogData.answer_length = response.answer.length;
      questionLogData.model_used = 'fallback-mode';
      questionLogData.how_to_guide_count = response.sourceQuality?.howToGuideCount || 0;
      questionLogData.verified_content_count = response.sourceQuality?.verifiedContentCount || 0;
      questionLogData.faq_content_count = response.sourceQuality?.faqContentCount || 0;
      questionLogData.module_doc_count = response.sourceQuality?.moduleDocCount || 0;

      // Log the question
      await logQuestion(questionLogData);
      
      return NextResponse.json({
        ...response,
        query,
        searchResultCount: searchResults.length,
        searchResults: searchResults, // Include full search results with content
        note: 'Fallback mode: Claude 4.0 unavailable, using semantic search'
      });
    }

  } catch (error) {
    console.error('RAG query error:', error);
    
    // Log error case
    const endTime = performance.now();
    questionLogData.response_time_ms = Math.round(endTime - startTime);
    questionLogData.source_quality_score = 'Error occurred';
    questionLogData.model_used = 'error';
    try {
      await logQuestion(questionLogData);
    } catch (logError) {
      console.error('Failed to log error question:', logError);
    }
    
    return NextResponse.json(
      { error: 'Internal server error during query processing' },
      { status: 500 }
    );
  }
}