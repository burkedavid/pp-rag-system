const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL);

async function addSampleData() {
  console.log('🔧 Adding sample data for testing...');
  
  const sampleQuestions = [
    {
      query: 'How do I create a food poisoning investigation?',
      confidence: 'high',
      similarity_score: 0.92,
      sources_count: 5,
      source_quality_score: 'Comprehensive verified procedure',
      response_time_ms: 2340,
      model_used: 'anthropic.claude-sonnet-4-20250514-v1:0',
      search_results_count: 8,
      how_to_guide_count: 3,
      verified_content_count: 2,
      faq_content_count: 1,
      module_doc_count: 2,
      answer_length: 1250
    },
    {
      query: 'Where is the licensing module located?',
      confidence: 'medium',
      similarity_score: 0.65,
      sources_count: 3,
      source_quality_score: 'Navigation guidance available',
      response_time_ms: 1850,
      model_used: 'anthropic.claude-sonnet-4-20250514-v1:0',
      search_results_count: 5,
      how_to_guide_count: 1,
      verified_content_count: 1,
      faq_content_count: 0,
      module_doc_count: 3,
      answer_length: 780
    },
    {
      query: 'How do I configure advanced system settings?',
      confidence: 'low',
      similarity_score: 0.35,
      sources_count: 2,
      source_quality_score: 'Limited documentation available',
      response_time_ms: 3200,
      model_used: 'anthropic.claude-sonnet-4-20250514-v1:0',
      search_results_count: 3,
      how_to_guide_count: 0,
      verified_content_count: 0,
      faq_content_count: 1,
      module_doc_count: 2,
      answer_length: 420
    },
    {
      query: 'How do I search for existing inspections?',
      confidence: 'high',
      similarity_score: 0.88,
      sources_count: 4,
      source_quality_score: 'Step-by-step procedural guidance',
      response_time_ms: 1950,
      model_used: 'anthropic.claude-sonnet-4-20250514-v1:0',
      search_results_count: 6,
      how_to_guide_count: 2,
      verified_content_count: 1,
      faq_content_count: 1,
      module_doc_count: 2,
      answer_length: 980
    },
    {
      query: 'Where do I find the dog registration forms?',
      confidence: 'low',
      similarity_score: 0.42,
      sources_count: 1,
      source_quality_score: 'General system guidance',
      response_time_ms: 2800,
      model_used: 'anthropic.claude-sonnet-4-20250514-v1:0',
      search_results_count: 2,
      how_to_guide_count: 0,
      verified_content_count: 0,
      faq_content_count: 0,
      module_doc_count: 2,
      answer_length: 350
    }
  ];
  
  for (let i = 0; i < sampleQuestions.length; i++) {
    const sample = sampleQuestions[i];
    const randomDays = Math.floor(Math.random() * 30);
    
    await sql`
      INSERT INTO question_logs (
        query, confidence, similarity_score, sources_count, 
        source_quality_score, response_time_ms, model_used,
        search_results_count, how_to_guide_count, verified_content_count, 
        faq_content_count, module_doc_count, answer_length
      ) VALUES (
        ${sample.query}, ${sample.confidence}, ${sample.similarity_score}, 
        ${sample.sources_count}, ${sample.source_quality_score}, 
        ${sample.response_time_ms}, ${sample.model_used},
        ${sample.search_results_count}, ${sample.how_to_guide_count}, 
        ${sample.verified_content_count}, ${sample.faq_content_count}, 
        ${sample.module_doc_count}, ${sample.answer_length}
      );
    `;
  }
  
  console.log(`✅ Created ${sampleQuestions.length} sample records`);
  
  // Test analytics
  const [stats] = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN confidence = 'high' THEN 1 END) as high,
      COUNT(CASE WHEN confidence = 'medium' THEN 1 END) as medium,
      COUNT(CASE WHEN confidence = 'low' THEN 1 END) as low
    FROM question_logs;
  `;
  
  console.log(`📊 Sample Data: ${stats.total} total, ${stats.high} high, ${stats.medium} medium, ${stats.low} low confidence`);
}

addSampleData().catch(console.error);