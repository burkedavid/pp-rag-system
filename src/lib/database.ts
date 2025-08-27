import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export const sql = neon(process.env.DATABASE_URL);

export interface DocumentChunk {
  id: number;
  source_file: string;
  section_title: string;
  chunk_text: string;
  chunk_index: number;
  token_count: number;
  embedding: number[];
  metadata: Record<string, any>;
  created_at: Date;
}

export interface SearchResult extends DocumentChunk {
  similarity: number;
}

export async function initializeDatabase() {
  // Create pgvector extension
  await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
  
  // Create document_chunks table
  await sql`
    CREATE TABLE IF NOT EXISTS document_chunks (
      id SERIAL PRIMARY KEY,
      source_file VARCHAR(255) NOT NULL,
      section_title TEXT,
      chunk_text TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      token_count INTEGER NOT NULL,
      embedding VECTOR(1024),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  
  // Create indexes for better performance
  await sql`
    CREATE INDEX IF NOT EXISTS idx_document_chunks_source_file 
    ON document_chunks(source_file);
  `;
  
  await sql`
    CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
    ON document_chunks USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100);
  `;
  
  // Create text search index
  await sql`
    CREATE INDEX IF NOT EXISTS idx_document_chunks_text_search 
    ON document_chunks USING gin(to_tsvector('english', chunk_text));
  `;
  
  // Create question_logs table for admin dashboard
  await sql`
    CREATE TABLE IF NOT EXISTS question_logs (
      id SERIAL PRIMARY KEY,
      query TEXT NOT NULL,
      confidence VARCHAR(10) NOT NULL,
      similarity_score DECIMAL(4,3) NOT NULL,
      sources_count INTEGER NOT NULL,
      source_quality_score TEXT NOT NULL,
      response_time_ms INTEGER NOT NULL,
      model_used VARCHAR(100) NOT NULL,
      timestamp TIMESTAMP DEFAULT NOW(),
      user_feedback VARCHAR(20),
      ip_address INET,
      search_results_count INTEGER DEFAULT 0,
      how_to_guide_count INTEGER DEFAULT 0,
      verified_content_count INTEGER DEFAULT 0,
      faq_content_count INTEGER DEFAULT 0,
      module_doc_count INTEGER DEFAULT 0,
      answer_length INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  
  // Create indexes for question_logs table
  await sql`
    CREATE INDEX IF NOT EXISTS idx_question_logs_confidence 
    ON question_logs(confidence);
  `;
  
  await sql`
    CREATE INDEX IF NOT EXISTS idx_question_logs_timestamp 
    ON question_logs(timestamp);
  `;
  
  await sql`
    CREATE INDEX IF NOT EXISTS idx_question_logs_similarity 
    ON question_logs(similarity_score);
  `;

  // Full-text search index on queries
  await sql`
    CREATE INDEX IF NOT EXISTS idx_question_logs_query_search 
    ON question_logs USING gin(to_tsvector('english', query));
  `;
  
  console.log('Database initialized successfully (including admin tables)');
}

export async function insertDocumentChunk(chunk: Omit<DocumentChunk, 'id' | 'created_at'>) {
  const result = await sql`
    INSERT INTO document_chunks (
      source_file, section_title, chunk_text, chunk_index, 
      token_count, embedding, metadata
    ) VALUES (
      ${chunk.source_file}, ${chunk.section_title}, ${chunk.chunk_text}, 
      ${chunk.chunk_index}, ${chunk.token_count}, ${JSON.stringify(chunk.embedding)}, 
      ${JSON.stringify(chunk.metadata)}
    ) RETURNING id;
  `;
  return result[0].id;
}

export async function searchSimilarChunks(
  queryEmbedding: number[], 
  limit: number = 10,
  threshold: number = 0.3
): Promise<SearchResult[]> {
  const results = await sql`
    SELECT 
      id, source_file, section_title, chunk_text, chunk_index,
      token_count, metadata, created_at,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
    FROM document_chunks
    WHERE 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${limit};
  `;
  
  return results.map((row: any) => ({
    ...row,
    embedding: [], // Don't return large embedding vectors in search results
    metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata
  })) as SearchResult[];
}

export async function hybridSearch(
  queryEmbedding: number[],
  keywords: string,
  limit: number = 10
): Promise<SearchResult[]> {
  const results = await sql`
    WITH semantic_search AS (
      SELECT 
        id, source_file, section_title, chunk_text, chunk_index,
        token_count, metadata, created_at,
        1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity,
        0.7 as weight
      FROM document_chunks
      WHERE 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > 0.1
      ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit}
    ),
    keyword_search AS (
      SELECT 
        id, source_file, section_title, chunk_text, chunk_index,
        token_count, metadata, created_at,
        ts_rank(to_tsvector('english', chunk_text), plainto_tsquery('english', ${keywords})) as similarity,
        0.3 as weight
      FROM document_chunks
      WHERE to_tsvector('english', chunk_text) @@ plainto_tsquery('english', ${keywords})
      ORDER BY ts_rank(to_tsvector('english', chunk_text), plainto_tsquery('english', ${keywords})) DESC
      LIMIT ${limit}
    ),
    combined AS (
      SELECT *, similarity * weight as weighted_score FROM semantic_search
      UNION ALL
      SELECT *, similarity * weight as weighted_score FROM keyword_search
    )
    SELECT 
      id, source_file, section_title, chunk_text, chunk_index,
      token_count, metadata, created_at,
      MAX(similarity) as similarity
    FROM combined
    GROUP BY id, source_file, section_title, chunk_text, chunk_index, token_count, metadata, created_at
    ORDER BY MAX(weighted_score) DESC
    LIMIT ${limit};
  `;
  
  return results.map((row: any) => ({
    ...row,
    embedding: [],
    metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata
  })) as SearchResult[];
}

export async function clearDocumentChunks() {
  await sql`DELETE FROM document_chunks;`;
  console.log('All document chunks cleared');
}