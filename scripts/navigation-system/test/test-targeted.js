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

async function testSpecificNavigation(query) {
  console.log(`\n🔍 Testing: "${query}"`);
  
  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query);
  
  // Search specifically for navigation chunks
  const navResults = await sql`
    SELECT 
      source_file,
      section_title,
      chunk_text,
      metadata,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
    FROM document_chunks
    WHERE metadata->>'document_type' = 'verified_navigation'
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT 3
  `;
  
  console.log(`📊 Navigation chunks (top 3 by similarity):`);
  navResults.forEach((result, i) => {
    console.log(`   ${i + 1}. ${result.section_title} (${result.similarity.toFixed(3)})`);
    console.log(`      ${result.chunk_text.substring(0, 150)}...`);
  });
  
  // Search all chunks for comparison
  const allResults = await sql`
    SELECT 
      source_file,
      section_title,
      chunk_text,
      metadata,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
    FROM document_chunks
    WHERE 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > 0.7
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT 5
  `;
  
  console.log(`\n✅ All high-similarity chunks (>0.7):`);
  if (allResults.length === 0) {
    console.log('   ❌ No chunks found with >0.7 similarity');
  } else {
    allResults.forEach((result, i) => {
      const docType = result.metadata?.document_type || 'unknown';
      console.log(`   ${i + 1}. [${docType}] ${result.section_title} (${result.similarity.toFixed(3)})`);
    });
  }
}

async function main() {
  console.log('🧪 Testing Navigation Data Integration\n');
  
  const testQueries = [
    "How do I search for inspections?",
    "Where is the create inspection button?", 
    "How to access dog module?",
    "Navigate to licensing applications"
  ];
  
  for (const query of testQueries) {
    await testSpecificNavigation(query);
    console.log('\n' + '='.repeat(80));
  }
}

main().catch(console.error);