const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL);

async function runMigrations() {
  try {
    console.log('🚀 Running database migrations...');
    
    // Create pgvector extension
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
    console.log('✅ Created pgvector extension');
    
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
    console.log('✅ Created document_chunks table');
    
    // Create indexes for document_chunks
    await sql`
      CREATE INDEX IF NOT EXISTS idx_document_chunks_source_file 
      ON document_chunks(source_file);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
      ON document_chunks USING ivfflat (embedding vector_cosine_ops) 
      WITH (lists = 100);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_document_chunks_text_search 
      ON document_chunks USING gin(to_tsvector('english', chunk_text));
    `;
    console.log('✅ Created document_chunks indexes');
    
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
    console.log('✅ Created question_logs table');
    
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

    await sql`
      CREATE INDEX IF NOT EXISTS idx_question_logs_query_search 
      ON question_logs USING gin(to_tsvector('english', query));
    `;
    console.log('✅ Created question_logs indexes');
    
    console.log('🎉 All migrations completed successfully!');
    console.log('   - pgvector extension installed');
    console.log('   - document_chunks table with indexes');
    console.log('   - question_logs table with indexes (admin dashboard)');
    console.log('   - System ready for RAG operations and admin monitoring');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations().catch((error) => {
    console.error('Fatal migration error:', error);
    process.exit(1);
  });
}

module.exports = { runMigrations };