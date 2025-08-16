const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_9eAE2FgWZURn@ep-falling-rice-abu5bomh-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function checkSystemStatus() {
  try {
    console.log('🔍 Checking system status...\n');

    // Check database connection and content
    const dbStats = await sql`
      SELECT 
        COUNT(*) as total_chunks,
        COUNT(DISTINCT source_file) as total_files,
        MIN(created_at) as first_chunk,
        MAX(created_at) as last_chunk
      FROM document_chunks;
    `;

    console.log('📊 Database Status:');
    console.log(`   ✅ Connected to PostgreSQL`);
    console.log(`   📄 Documents: ${dbStats[0].total_files}`);
    console.log(`   📋 Chunks: ${dbStats[0].total_chunks}`);
    console.log(`   📅 Last updated: ${dbStats[0].last_chunk}`);

    // Check available documents
    const docs = await sql`
      SELECT source_file, COUNT(*) as chunk_count
      FROM document_chunks
      GROUP BY source_file
      ORDER BY source_file
      LIMIT 5;
    `;

    console.log('\n📚 Available Documents (sample):');
    docs.forEach(doc => {
      console.log(`   📖 ${doc.source_file}: ${doc.chunk_count} chunks`);
    });

    // Test a simple search
    const testQuery = 'food safety inspection';
    const searchResults = await sql`
      SELECT 
        source_file, section_title, 
        substring(chunk_text, 1, 100) as preview,
        ts_rank(to_tsvector('english', chunk_text), plainto_tsquery('english', ${testQuery})) as rank
      FROM document_chunks
      WHERE to_tsvector('english', chunk_text) @@ plainto_tsquery('english', ${testQuery})
      ORDER BY ts_rank(to_tsvector('english', chunk_text), plainto_tsquery('english', ${testQuery})) DESC
      LIMIT 3;
    `;

    console.log(`\n🔍 Test Search: "${testQuery}"`);
    if (searchResults.length > 0) {
      console.log('   ✅ Search working! Sample results:');
      searchResults.forEach((result, i) => {
        console.log(`   ${i + 1}. ${result.source_file} - ${result.section_title}`);
        console.log(`      "${result.preview}..."`);
      });
    } else {
      console.log('   ⚠️  No results found for test search');
    }

    console.log('\n🎉 System Status: READY');
    console.log('\n🚀 Next Steps:');
    console.log('   1. Wait for development server to start (npm run dev)');
    console.log('   2. Open http://localhost:3000 in your browser');
    console.log('   3. Try searching for: "food safety", "inspections", "licensing"');
    console.log('\n💡 Note: Currently using keyword search (demo mode)');
    console.log('   For full semantic search, configure AWS Bedrock access');

  } catch (error) {
    console.error('❌ System check failed:', error);
  }
}

checkSystemStatus();