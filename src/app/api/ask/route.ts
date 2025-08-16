import { NextRequest, NextResponse } from 'next/server';
import { sql, hybridSearch } from '@/lib/database';
import { generateRAGResponse } from '@/lib/claude';
import { logAIUsage } from '@/lib/ai-audit';
import { generateEmbedding } from '@/lib/embeddings';

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
      confidence: 'low' as const
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

  return {
    answer,
    sources,
    confidence: confidence as 'high' | 'medium' | 'low'
  };
}

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { query, limit = 5 } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Use hybrid search combining semantic and keyword search
    const queryEmbedding = await generateEmbedding(query);
    const searchResults = await hybridSearch(queryEmbedding, query, limit);
    
    try {
      // Try to use Claude 4.0 for enhanced response generation
      const claudeResponse = await generateRAGResponse(query, searchResults);
      
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
          duration: performance.now() - startTime
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
          duration: performance.now() - startTime
        },
        success: false,
        errorMessage: claudeError instanceof Error ? claudeError.message : 'Unknown error'
      });
      
      // Fallback to mock response
      const response = generateMockResponse(query, searchResults);
      return NextResponse.json({
        ...response,
        query,
        searchResultCount: searchResults.length,
        note: 'Fallback mode: Claude 4.0 unavailable, using semantic search'
      });
    }

  } catch (error) {
    console.error('RAG query error:', error);
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

  try {
    // Use hybrid search combining semantic and keyword search
    const queryEmbedding = await generateEmbedding(query);
    const searchResults = await hybridSearch(queryEmbedding, query, limit);
    
    try {
      // Try to use Claude 4.0 for enhanced response generation
      const claudeResponse = await generateRAGResponse(query, searchResults);
      
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
          duration: performance.now() - startTime
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
      
      // Fallback to mock response
      const response = generateMockResponse(query, searchResults);
      return NextResponse.json({
        ...response,
        query,
        searchResultCount: searchResults.length,
        note: 'Fallback mode: Claude 4.0 unavailable, using semantic search'
      });
    }

  } catch (error) {
    console.error('RAG query error:', error);
    return NextResponse.json(
      { error: 'Internal server error during query processing' },
      { status: 500 }
    );
  }
}