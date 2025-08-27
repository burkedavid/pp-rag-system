// Admin Dashboard Database Schema and Operations
import { sql } from '@/lib/database';

export interface QuestionLog {
  id: number;
  query: string;
  confidence: 'high' | 'medium' | 'low';
  similarity_score: number;
  sources_count: number;
  source_quality_score: string;
  response_time_ms: number;
  model_used: string;
  timestamp: Date;
  user_feedback?: 'helpful' | 'not_helpful' | 'partially_helpful';
  ip_address?: string;
  search_results_count: number;
  how_to_guide_count: number;
  verified_content_count: number;
  faq_content_count: number;
  module_doc_count: number;
  answer_length: number;
}

export interface AnalyticsMetrics {
  total_questions: number;
  avg_confidence: number;
  confidence_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  avg_response_time: number;
  top_failing_categories: Array<{
    category: string;
    low_confidence_count: number;
    avg_similarity: number;
  }>;
  improvement_opportunities: Array<{
    query_pattern: string;
    frequency: number;
    avg_confidence: number;
    suggested_action: string;
  }>;
}

export interface RAGSettings {
  id: number;
  similarity_threshold: number;
  source_count: number;
  confidence_threshold_medium: number;
  confidence_threshold_high: number;
  updated_at: Date;
}

export async function initializeAdminTables() {
  console.log('⚠️  DEPRECATED: Admin tables are now created automatically via initializeDatabase()');
  console.log('   Use the main database initialization instead of this function.');
  
  // For backward compatibility, just log this information
  console.log('✅ Admin tables are included in main database initialization');
}

export async function logQuestion(questionData: Omit<QuestionLog, 'id' | 'timestamp' | 'created_at'>) {
  const result = await sql`
    INSERT INTO question_logs (
      query, confidence, similarity_score, sources_count, 
      source_quality_score, response_time_ms, model_used,
      user_feedback, ip_address, search_results_count,
      how_to_guide_count, verified_content_count, 
      faq_content_count, module_doc_count, answer_length
    ) VALUES (
      ${questionData.query}, ${questionData.confidence}, 
      ${questionData.similarity_score}, ${questionData.sources_count},
      ${questionData.source_quality_score}, ${questionData.response_time_ms}, 
      ${questionData.model_used}, ${questionData.user_feedback}, 
      ${questionData.ip_address}, ${questionData.search_results_count},
      ${questionData.how_to_guide_count}, ${questionData.verified_content_count},
      ${questionData.faq_content_count}, ${questionData.module_doc_count},
      ${questionData.answer_length}
    ) RETURNING id;
  `;
  return result[0].id;
}

export async function getAnalyticsMetrics(
  startDate?: Date, 
  endDate?: Date
): Promise<AnalyticsMetrics> {
  // Basic metrics - simplified without dynamic WHERE clause
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

  // Top failing query patterns (using similarity as proxy for "failing")
  const failingPatterns = await sql`
    SELECT 
      CASE 
        WHEN query ILIKE '%food poisoning%' THEN 'Food Poisoning'
        WHEN query ILIKE '%licens%' THEN 'Licensing'
        WHEN query ILIKE '%inspect%' THEN 'Inspections'
        WHEN query ILIKE '%premises%' THEN 'Premises'
        WHEN query ILIKE '%contact%' THEN 'Contacts'
        WHEN query ILIKE '%dog%' THEN 'Dogs & Animals'
        WHEN query ILIKE '%service request%' THEN 'Service Requests'
        WHEN query ILIKE '%prosecution%' THEN 'Prosecutions'
        WHEN query ILIKE '%enforcement%' THEN 'Enforcement'
        ELSE 'Other'
      END as category,
      COUNT(*) as total_count,
      COUNT(CASE WHEN confidence = 'low' THEN 1 END) as low_confidence_count,
      AVG(similarity_score) as avg_similarity
    FROM question_logs
    WHERE timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY category
    HAVING COUNT(CASE WHEN confidence = 'low' THEN 1 END) > 0
    ORDER BY low_confidence_count DESC, avg_similarity ASC
    LIMIT 10;
  `;

  // Improvement opportunities - frequently asked low-confidence queries
  const improvements = await sql`
    WITH similar_queries AS (
      SELECT 
        query,
        confidence,
        similarity_score,
        COUNT(*) OVER (PARTITION BY 
          regexp_replace(lower(query), '[^a-z ]', '', 'g')
        ) as pattern_frequency
      FROM question_logs
      WHERE timestamp >= NOW() - INTERVAL '30 days'
    )
    SELECT 
      query as query_pattern,
      pattern_frequency as frequency,
      AVG(similarity_score) as avg_confidence,
      CASE 
        WHEN AVG(similarity_score) < 0.4 THEN 'Critical: Add specific documentation'
        WHEN AVG(similarity_score) < 0.6 THEN 'High: Enhance existing content'  
        WHEN AVG(similarity_score) < 0.75 THEN 'Medium: Improve content clarity'
        ELSE 'Low: Minor content optimization'
      END as suggested_action
    FROM similar_queries
    WHERE pattern_frequency >= 2 AND confidence IN ('low', 'medium')
    GROUP BY query_pattern, pattern_frequency
    ORDER BY frequency DESC, avg_confidence ASC
    LIMIT 15;
  `;

  const total = Number(basicStats.total_questions);
  
  return {
    total_questions: total,
    avg_confidence: Number(basicStats.avg_similarity),
    confidence_distribution: {
      high: Number(basicStats.high_confidence),
      medium: Number(basicStats.medium_confidence),
      low: Number(basicStats.low_confidence)
    },
    avg_response_time: Number(basicStats.avg_response_time),
    top_failing_categories: failingPatterns.map(row => ({
      category: row.category,
      low_confidence_count: Number(row.low_confidence_count),
      avg_similarity: Number(row.avg_similarity)
    })),
    improvement_opportunities: improvements.map(row => ({
      query_pattern: row.query_pattern,
      frequency: Number(row.frequency),
      avg_confidence: Number(row.avg_confidence),
      suggested_action: row.suggested_action
    }))
  };
}

export async function getRecentQuestions(limit = 50, offset = 0, confidence?: 'high' | 'medium' | 'low') {
  if (confidence) {
    return await sql`
      SELECT * FROM question_logs
      WHERE confidence = ${confidence}
      ORDER BY timestamp DESC
      LIMIT ${limit}
      OFFSET ${offset};
    `;
  }
  
  return await sql`
    SELECT * FROM question_logs
    ORDER BY timestamp DESC
    LIMIT ${limit}
    OFFSET ${offset};
  `;
}

export async function searchQuestions(searchTerm: string, limit = 20, offset = 0, confidence?: 'high' | 'medium' | 'low') {
  if (confidence) {
    return await sql`
      SELECT * FROM question_logs
      WHERE to_tsvector('english', query) @@ plainto_tsquery('english', ${searchTerm})
        AND confidence = ${confidence}
      ORDER BY timestamp DESC
      LIMIT ${limit}
      OFFSET ${offset};
    `;
  }
  
  return await sql`
    SELECT * FROM question_logs
    WHERE to_tsvector('english', query) @@ plainto_tsquery('english', ${searchTerm})
    ORDER BY timestamp DESC
    LIMIT ${limit}
    OFFSET ${offset};
  `;
}

export async function getConfidenceTrends(days = 30) {
  return await sql`
    SELECT 
      DATE(timestamp) as date,
      COUNT(*) as total_questions,
      COUNT(CASE WHEN confidence = 'high' THEN 1 END) as high_confidence,
      COUNT(CASE WHEN confidence = 'medium' THEN 1 END) as medium_confidence,
      COUNT(CASE WHEN confidence = 'low' THEN 1 END) as low_confidence,
      AVG(similarity_score) as avg_similarity,
      AVG(response_time_ms) as avg_response_time
    FROM question_logs
    WHERE timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(timestamp)
    ORDER BY date DESC;
  `;
}

// RAG Settings Management
export async function getRAGSettings(): Promise<RAGSettings> {
  const result = await sql`
    SELECT * FROM rag_settings ORDER BY id DESC LIMIT 1;
  `;
  
  if (result.length === 0) {
    // Return default settings if none exist
    return {
      id: 0,
      similarity_threshold: 0.45,
      source_count: 5,
      confidence_threshold_medium: 0.5,
      confidence_threshold_high: 0.7,
      updated_at: new Date()
    };
  }
  
  return result[0] as RAGSettings;
}

export async function updateRAGSettings(settings: Omit<RAGSettings, 'id' | 'updated_at'>): Promise<RAGSettings> {
  const result = await sql`
    INSERT INTO rag_settings (
      similarity_threshold,
      source_count, 
      confidence_threshold_medium,
      confidence_threshold_high,
      updated_at
    ) VALUES (
      ${settings.similarity_threshold},
      ${settings.source_count},
      ${settings.confidence_threshold_medium}, 
      ${settings.confidence_threshold_high},
      NOW()
    )
    RETURNING *;
  `;
  
  return result[0] as RAGSettings;
}

export async function initializeRAGSettingsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS rag_settings (
      id SERIAL PRIMARY KEY,
      similarity_threshold DECIMAL(3,2) NOT NULL DEFAULT 0.45,
      source_count INTEGER NOT NULL DEFAULT 5,
      confidence_threshold_medium DECIMAL(3,2) NOT NULL DEFAULT 0.40,
      confidence_threshold_high DECIMAL(3,2) NOT NULL DEFAULT 0.70,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  // Insert default settings if table is empty
  const existing = await sql`SELECT COUNT(*) as count FROM rag_settings;`;
  if (existing[0].count === 0) {
    await sql`
      INSERT INTO rag_settings (similarity_threshold, source_count, confidence_threshold_medium, confidence_threshold_high)
      VALUES (0.45, 5, 0.50, 0.70);
    `;
  }
}