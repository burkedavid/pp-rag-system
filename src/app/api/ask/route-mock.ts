import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

function generateMockEmbedding(text: string): number[] {
  // Create a deterministic but varied embedding based on text content
  const hash = simpleHash(text);
  const embedding = [];
  
  for (let i = 0; i < 1536; i++) {
    const value = (Math.sin(hash * (i + 1)) + Math.cos(hash * (i + 2))) / 2;
    embedding.push(value);
  }
  
  return embedding;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
}

async function keywordSearch(query: string, limit: number = 5) {
  const results = await sql`
    SELECT 
      id, source_file, section_title, chunk_text, chunk_index,
      token_count, metadata, created_at,
      ts_rank(to_tsvector('english', chunk_text), plainto_tsquery('english', ${query})) as similarity
    FROM document_chunks
    WHERE to_tsvector('english', chunk_text) @@ plainto_tsquery('english', ${query})
    ORDER BY ts_rank(to_tsvector('english', chunk_text), plainto_tsquery('english', ${query})) DESC
    LIMIT ${limit};
  `;
  
  return results.map(row => ({
    ...row,
    embedding: [],
    metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata
  }));
}

function generateMockResponse(query: string, searchResults: any[]) {
  if (searchResults.length === 0) {
    return {
      answer: "I couldn't find relevant information in the documentation to answer your question. Please try rephrasing your query or contact your system administrator for assistance.",
      sources: [],
      confidence: 'low' as const
    };
  }

  // Create a simple response based on the search results
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
  try {
    const { query, limit = 5 } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Use keyword search instead of vector search for demo
    const searchResults = await keywordSearch(query, limit);

    const response = generateMockResponse(query, searchResults);

    return NextResponse.json({
      ...response,
      query,
      searchResultCount: searchResults.length,
      note: 'Demo mode: Using keyword search instead of semantic search'
    });

  } catch (error) {
    console.error('RAG query error:', error);
    return NextResponse.json(
      { error: 'Internal server error during query processing' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
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
    const searchResults = await keywordSearch(query, limit);
    const response = generateMockResponse(query, searchResults);

    return NextResponse.json({
      ...response,
      query,
      searchResultCount: searchResults.length,
      note: 'Demo mode: Using keyword search instead of semantic search'
    });

  } catch (error) {
    console.error('RAG query error:', error);
    return NextResponse.json(
      { error: 'Internal server error during query processing' },
      { status: 500 }
    );
  }
}