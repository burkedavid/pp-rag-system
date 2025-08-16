import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET() {
  try {
    const results = await sql`
      SELECT 
        source_file,
        COUNT(*) as chunk_count,
        MIN(created_at) as first_indexed,
        MAX(created_at) as last_updated,
        array_agg(DISTINCT section_title) as sections
      FROM document_chunks
      GROUP BY source_file
      ORDER BY source_file;
    `;

    const documents = results.map(row => ({
      source_file: row.source_file,
      chunk_count: parseInt(row.chunk_count),
      first_indexed: row.first_indexed,
      last_updated: row.last_updated,
      sections: row.sections || []
    }));

    const totalChunks = documents.reduce((sum, doc) => sum + doc.chunk_count, 0);

    return NextResponse.json({
      documents,
      total_documents: documents.length,
      total_chunks: totalChunks
    });

  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}