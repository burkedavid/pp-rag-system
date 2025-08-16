import { NextRequest, NextResponse } from 'next/server';
import { sql, hybridSearch } from '@/lib/database';
import { generateEmbedding } from '@/lib/embeddings';

async function vectorSearch(query: string, limit: number = 10) {
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


export async function POST(req: NextRequest) {
  try {
    const { query, searchType = 'hybrid', limit = 10 } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Use hybrid search combining semantic and keyword search
    const queryEmbedding = await generateEmbedding(query);
    const results = await hybridSearch(queryEmbedding, query, limit);
    const searchMode = 'hybrid';

    return NextResponse.json({
      results,
      query,
      count: results.length,
      note: searchMode === 'hybrid' ? 'Hybrid search using Amazon Titan embeddings + keyword matching' : 'Semantic search using Amazon Titan embeddings'
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error during search' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const searchType = searchParams.get('type') || 'hybrid';
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    const results = await vectorSearch(query, limit);

    return NextResponse.json({
      results,
      query,
      count: results.length,
      note: 'Semantic search using Amazon Titan embeddings'
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error during search' },
      { status: 500 }
    );
  }
}