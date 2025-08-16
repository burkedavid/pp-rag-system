#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database vector dimensions...');
    
    // Drop the existing table to avoid dimension conflicts
    await sql`DROP TABLE IF EXISTS document_chunks CASCADE;`;
    console.log('✅ Dropped existing table');
    
    // Recreate with correct dimensions
    await sql`
      CREATE TABLE document_chunks (
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
    console.log('✅ Created table with 1024-dimension vectors');
    
    // Create indexes
    await sql`
      CREATE INDEX idx_document_chunks_source_file 
      ON document_chunks(source_file);
    `;
    
    await sql`
      CREATE INDEX idx_document_chunks_embedding 
      ON document_chunks USING ivfflat (embedding vector_cosine_ops) 
      WITH (lists = 100);
    `;
    
    await sql`
      CREATE INDEX idx_document_chunks_text_search 
      ON document_chunks USING gin(to_tsvector('english', chunk_text));
    `;
    
    console.log('✅ Created indexes');
    console.log('🎉 Database fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  fixDatabase();
}

module.exports = { fixDatabase };