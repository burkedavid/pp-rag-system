import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get document counts by type
    const documentStats = await sql`
      SELECT 
        metadata->>'document_type' as document_type,
        COUNT(*) as chunk_count,
        COUNT(DISTINCT source_file) as file_count,
        AVG(token_count) as avg_token_count,
        MAX(created_at) as last_updated
      FROM document_chunks 
      WHERE metadata->>'document_type' IS NOT NULL
      GROUP BY metadata->>'document_type'
      ORDER BY chunk_count DESC;
    `;

    // Get total counts
    const totalStats = await sql`
      SELECT 
        COUNT(*) as total_chunks,
        COUNT(DISTINCT source_file) as total_files,
        SUM(token_count) as total_tokens
      FROM document_chunks;
    `;

    // Get recent ingestion activity (from question logs as proxy)
    const recentActivity = await sql`
      SELECT 
        confidence,
        source_quality_score,
        timestamp,
        faq_content_count,
        how_to_guide_count,
        verified_content_count,
        module_doc_count
      FROM question_logs 
      ORDER BY timestamp DESC 
      LIMIT 10;
    `;

    // Calculate confidence distribution
    const confidenceStats = await sql`
      SELECT 
        confidence,
        COUNT(*) as count
      FROM question_logs 
      WHERE timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY confidence;
    `;

    return NextResponse.json({
      success: true,
      stats: {
        total: totalStats[0],
        byType: documentStats,
        confidence: confidenceStats,
        recentActivity: recentActivity.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Status error:', error);
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    );
  }
}