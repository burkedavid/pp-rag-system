const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL);

async function initializeAdminTables() {
  console.log('🔧 Initializing admin dashboard tables...');
  
  try {
    // Create question_logs table
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
    
    // Create indexes for better performance
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

    // Full-text search index on queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_question_logs_query_search 
      ON question_logs USING gin(to_tsvector('english', query));
    `;
    
    console.log('✅ Created indexes for question_logs table');
    
    // Check if we have existing data
    const [existingCount] = await sql`SELECT COUNT(*) as count FROM question_logs`;
    console.log(`📊 Current question_logs records: ${existingCount.count}`);
    
    // If we have no data, create some sample data for testing
    if (existingCount.count === 0) {
      console.log('🔧 Creating sample data for testing...');
      
      const sampleQuestions = [
        {
          query: "How do I create a food poisoning investigation?",
          confidence: "high",
          similarity_score: 0.92,
          sources_count: 5,
          source_quality_score: "Comprehensive verified procedure",
          response_time_ms: 2340,
          model_used: "anthropic.claude-sonnet-4-20250514-v1:0",
          search_results_count: 8,
          how_to_guide_count: 3,
          verified_content_count: 2,
          faq_content_count: 1,
          module_doc_count: 2,
          answer_length: 1250
        },
        {
          query: "Where is the licensing module located?",
          confidence: "medium",
          similarity_score: 0.65,
          sources_count: 3,
          source_quality_score: "Navigation guidance available",
          response_time_ms: 1850,
          model_used: "anthropic.claude-sonnet-4-20250514-v1:0",
          search_results_count: 5,
          how_to_guide_count: 1,
          verified_content_count: 1,
          faq_content_count: 0,
          module_doc_count: 3,
          answer_length: 780
        },
        {
          query: "How do I configure advanced system settings?",
          confidence: "low",
          similarity_score: 0.35,
          sources_count: 2,
          source_quality_score: "Limited documentation available",
          response_time_ms: 3200,
          model_used: "anthropic.claude-sonnet-4-20250514-v1:0",
          search_results_count: 3,
          how_to_guide_count: 0,
          verified_content_count: 0,
          faq_content_count: 1,
          module_doc_count: 2,
          answer_length: 420
        }
      ];
      
      for (const sample of sampleQuestions) {
        await sql`
          INSERT INTO question_logs (
            query, confidence, similarity_score, sources_count, 
            source_quality_score, response_time_ms, model_used,
            search_results_count, how_to_guide_count, verified_content_count, 
            faq_content_count, module_doc_count, answer_length,
            timestamp
          ) VALUES (
            ${sample.query}, ${sample.confidence}, ${sample.similarity_score}, 
            ${sample.sources_count}, ${sample.source_quality_score}, 
            ${sample.response_time_ms}, ${sample.model_used},
            ${sample.search_results_count}, ${sample.how_to_guide_count}, 
            ${sample.verified_content_count}, ${sample.faq_content_count}, 
            ${sample.module_doc_count}, ${sample.answer_length},
            NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days'
          );
        `;
      }
      
      console.log(`✅ Created ${sampleQuestions.length} sample records`);
    }
    
    // Test the analytics function
    console.log('\n🧪 Testing analytics queries...');
    
    const [basicStats] = await sql`
      SELECT 
        COUNT(*) as total_questions,
        AVG(similarity_score) as avg_similarity,
        AVG(response_time_ms) as avg_response_time,
        COUNT(CASE WHEN confidence = 'high' THEN 1 END) as high_confidence,
        COUNT(CASE WHEN confidence = 'medium' THEN 1 END) as medium_confidence,
        COUNT(CASE WHEN confidence = 'low' THEN 1 END) as low_confidence
      FROM question_logs
      WHERE timestamp >= NOW() - INTERVAL '30 days';
    `;
    
    console.log('📊 Current Analytics:');
    console.log(`   Total Questions: ${basicStats.total_questions}`);
    console.log(`   Average Similarity: ${(basicStats.avg_similarity * 100).toFixed(1)}%`);
    console.log(`   Average Response Time: ${Math.round(basicStats.avg_response_time)}ms`);
    console.log(`   High Confidence: ${basicStats.high_confidence}`);
    console.log(`   Medium Confidence: ${basicStats.medium_confidence}`);
    console.log(`   Low Confidence: ${basicStats.low_confidence}`);
    
    console.log('\n🎉 Admin dashboard tables initialized successfully!');
    console.log('\n📍 Next Steps:');
    console.log('   1. Replace /api/ask route with enhanced version');
    console.log('   2. Access admin dashboard at: http://localhost:3000/admin');
    console.log('   3. Start monitoring question quality and confidence levels');
    
  } catch (error) {
    console.error('❌ Error initializing admin tables:', error);
    throw error;
  }
}

// Run the initialization
initializeAdminTables().catch(console.error);