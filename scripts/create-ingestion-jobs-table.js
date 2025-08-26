#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function createIngestionJobsTable() {
  try {
    console.log('🔨 Creating ingestion_jobs table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS ingestion_jobs (
        id VARCHAR(255) PRIMARY KEY,
        document_type VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
        progress INTEGER DEFAULT 0,
        total_files INTEGER DEFAULT 0,
        processed_files INTEGER DEFAULT 0,
        current_file TEXT,
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE,
        error TEXT,
        logs JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    console.log('✅ Successfully created ingestion_jobs table');
    
    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status 
      ON ingestion_jobs(status, start_time);
    `;
    
    console.log('✅ Created performance index');
    
    console.log('🎉 Database migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  createIngestionJobsTable();
}

module.exports = { createIngestionJobsTable };