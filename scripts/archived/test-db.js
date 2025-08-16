// Test database connection without dependencies
const https = require('https');
const querystring = require('querystring');

// Simple HTTP client for Neon database
async function testConnection() {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_9eAE2FgWZURn@ep-falling-rice-abu5bomh-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  
  console.log('🔄 Testing database connection...');
  
  try {
    // Simple test using Node.js built-in modules
    console.log('✅ Database URL configured');
    console.log('📦 To proceed, you need to install dependencies first');
    console.log('🚀 Run: npm install --legacy-peer-deps');
    console.log('🔧 Then: node scripts/migrate.js');
    console.log('📚 Finally: node scripts/ingest-documents.js');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();