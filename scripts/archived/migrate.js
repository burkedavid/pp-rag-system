#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');

    // Create pgvector extension
    console.log('📦 Creating pgvector extension...');
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
    console.log('✅ pgvector extension created');

    // Create document_chunks table
    console.log('📋 Creating document_chunks table...');
    await sql`
      CREATE TABLE IF NOT EXISTS document_chunks (
        id SERIAL PRIMARY KEY,
        source_file VARCHAR(255) NOT NULL,
        section_title TEXT,
        chunk_text TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        token_count INTEGER NOT NULL,
        embedding VECTOR(1536),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ document_chunks table created');

    // Create indexes
    console.log('🔍 Creating indexes...');
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_document_chunks_source_file 
      ON document_chunks(source_file);
    `;
    console.log('✅ Source file index created');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
      ON document_chunks USING ivfflat (embedding vector_cosine_ops) 
      WITH (lists = 100);
    `;
    console.log('✅ Vector similarity index created');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_document_chunks_text_search 
      ON document_chunks USING gin(to_tsvector('english', chunk_text));
    `;
    console.log('✅ Text search index created');

    // Create metadata indexes for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_document_chunks_metadata_topic 
      ON document_chunks USING gin((metadata->>'topic_area'));
    `;
    console.log('✅ Metadata topic index created');

    // Verify the setup
    const tableInfo = await sql`
      SELECT 
        COUNT(*) as total_chunks,
        COUNT(DISTINCT source_file) as total_files,
        MIN(created_at) as first_chunk,
        MAX(created_at) as last_chunk
      FROM document_chunks;
    `;

    console.log('\n📊 Database Status:');
    console.log(`   Total chunks: ${tableInfo[0].total_chunks}`);
    console.log(`   Total files: ${tableInfo[0].total_files}`);
    console.log(`   First chunk: ${tableInfo[0].first_chunk || 'None'}`);
    console.log(`   Last chunk: ${tableInfo[0].last_chunk || 'None'}`);

    console.log('\n🎉 Database migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

module.exports = { migrate };