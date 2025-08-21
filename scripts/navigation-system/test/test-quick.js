const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function generateEmbedding(text) {
  const command = new InvokeModelCommand({
    modelId: 'amazon.titan-embed-text-v2:0',
    body: JSON.stringify({
      inputText: text,
      dimensions: 1024,
      normalize: true
    }),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.embedding;
}

async function testNavigationQuestion(query) {
  console.log(`\n🔍 Testing: "${query}"`);
  
  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query);
  
  // Search for similar chunks
  const results = await sql`
    SELECT 
      source_file,
      section_title,
      chunk_text,
      metadata,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
    FROM document_chunks
    WHERE 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > 0.7
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT 3
  `;
  
  if (results.length === 0) {
    console.log('❌ No relevant chunks found (similarity < 0.7)');
    return;
  }
  
  console.log(`✅ Found ${results.length} relevant chunks:`);
  
  results.forEach((result, i) => {
    console.log(`\n📄 Result ${i + 1} (similarity: ${result.similarity.toFixed(3)}):`);
    console.log(`📁 Source: ${result.source_file}`);
    console.log(`📋 Section: ${result.section_title}`);
    console.log(`📝 Content: ${result.chunk_text.substring(0, 200)}...`);
    
    if (result.metadata?.document_type) {
      console.log(`🏷️  Type: ${result.metadata.document_type}`);
    }
  });
}

async function main() {
  console.log('🧪 Testing RAG Navigation System\n');
  
  const testQueries = [
    "How do I create a new premises record?",
    "Where do I go to search for existing inspections?", 
    "How do I add a new contact to the system?",
    "What steps are needed to create a food poisoning investigation?",
    "How do I generate a notice for enforcement?",
    "Where can I find the licensing application forms?",
    "How do I access the dog registration module?"
  ];
  
  for (const query of testQueries) {
    await testNavigationQuestion(query);
    console.log('\n' + '='.repeat(80));
  }
}

main().catch(console.error);