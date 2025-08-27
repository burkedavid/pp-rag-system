const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: path.join(__dirname, '../../../.env.local') });

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

async function testNavigationQuery(query) {
  console.log(`\n🔍 Testing: "${query}"`);
  
  try {
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
      WHERE 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > 0.4
      ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT 5
    `;
    
    if (results.length === 0) {
      console.log('❌ No relevant chunks found');
      return false;
    }
    
    console.log(`✅ Found ${results.length} relevant chunks:`);
    
    results.forEach((result, i) => {
      const docType = result.metadata?.document_type || 'unknown';
      const similarity = (result.similarity * 100).toFixed(1);
      console.log(`   ${i + 1}. [${docType}] ${result.section_title} (${similarity}%)`);
    });

    // Check if we have navigation-specific results
    const navResults = results.filter(r => 
      r.metadata?.document_type === 'verified_navigation' || 
      r.metadata?.document_type === 'visual_interface_guide'
    );
    
    if (navResults.length > 0) {
      console.log(`🎯 Navigation-specific results: ${navResults.length}/${results.length}`);
      return true;
    } else {
      console.log('⚠️ No navigation-specific results found');
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error testing query: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🧪 Testing Navigation System (Read-Only)\n');
  
  const testQueries = [
    "How do I search for existing inspections?",
    "Where do I go to create a new premises record?", 
    "How do I access the dog registration module?",
    "Where can I find the licensing applications?",
    "How do I generate a notice for enforcement?"
  ];
  
  let successful = 0;
  let withNavigation = 0;
  
  for (const query of testQueries) {
    const result = await testNavigationQuery(query);
    if (result) withNavigation++;
    successful++;
    console.log('\n' + '-'.repeat(80));
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Queries with results: ${successful}/${testQueries.length}`);
  console.log(`   🎯 Navigation-specific results: ${withNavigation}/${testQueries.length}`);
  console.log(`   📈 Navigation coverage: ${((withNavigation/testQueries.length)*100).toFixed(1)}%`);
  
  // Check database stats
  console.log(`\n📊 Database Content:`);
  const stats = await sql`
    SELECT 
      metadata->>'document_type' as doc_type,
      COUNT(*) as count
    FROM document_chunks 
    WHERE metadata->>'document_type' IN ('verified_navigation', 'visual_interface_guide')
    GROUP BY metadata->>'document_type'
    ORDER BY count DESC
  `;
  
  stats.forEach(stat => {
    console.log(`   ${stat.doc_type}: ${stat.count} chunks`);
  });
}

main().catch(console.error);