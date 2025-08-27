const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkDatabaseContent() {
  console.log('🔍 Checking RAG database content...\n');
  
  // Check total document chunks
  const totalChunks = await sql`
    SELECT 
      metadata->>'document_type' as doc_type,
      COUNT(*) as count
    FROM document_chunks 
    GROUP BY metadata->>'document_type'
    ORDER BY count DESC
  `;
  
  console.log('📊 Document chunks by type:');
  totalChunks.forEach(row => {
    console.log(`   ${row.doc_type || 'unknown'}: ${row.count} chunks`);
  });
  
  console.log('\n🔍 Verified navigation chunks:');
  const navChunks = await sql`
    SELECT source_file, section_title, LEFT(chunk_text, 100) as preview
    FROM document_chunks 
    WHERE metadata->>'document_type' = 'verified_navigation'
    ORDER BY chunk_index
    LIMIT 10
  `;
  
  navChunks.forEach((chunk, i) => {
    console.log(`\n   ${i + 1}. ${chunk.source_file}`);
    console.log(`      Section: ${chunk.section_title}`);
    console.log(`      Preview: ${chunk.preview}...`);
  });
  
  if (navChunks.length === 0) {
    console.log('   ❌ No verified navigation chunks found!');
    
    console.log('\n🔍 Checking what files are available:');
    const allFiles = await sql`
      SELECT DISTINCT source_file, COUNT(*) as chunks
      FROM document_chunks 
      GROUP BY source_file
      ORDER BY chunks DESC
      LIMIT 20
    `;
    
    allFiles.forEach(file => {
      console.log(`   ${file.source_file}: ${file.chunks} chunks`);
    });
  }
}

checkDatabaseContent().catch(console.error);