import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get all chunks with metadata
    const chunks = await sql`
      SELECT 
        id,
        source_file, 
        section_title,
        chunk_text, 
        chunk_index, 
        token_count,
        metadata,
        created_at
      FROM document_chunks 
      ORDER BY source_file, chunk_index;
    `;

    // Get statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total_chunks,
        COUNT(DISTINCT source_file) as total_files,
        SUM(token_count) as total_tokens
      FROM document_chunks;
    `;

    // Get document type breakdown
    const documentTypes = await sql`
      SELECT 
        metadata->>'document_type' as document_type,
        COUNT(*) as chunk_count,
        COUNT(DISTINCT source_file) as file_count
      FROM document_chunks 
      WHERE metadata->>'document_type' IS NOT NULL
      GROUP BY metadata->>'document_type'
      ORDER BY chunk_count DESC;
    `;

    return NextResponse.json({
      success: true,
      chunks: chunks.map(chunk => ({
        ...chunk,
        metadata: typeof chunk.metadata === 'string' ? JSON.parse(chunk.metadata) : chunk.metadata
      })),
      stats: {
        ...stats[0],
        document_types: documentTypes
      }
    });

  } catch (error) {
    console.error('Embeddings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch embeddings' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.chunkId) {
      // Delete single chunk
      const result = await sql`
        DELETE FROM document_chunks 
        WHERE id = ${body.chunkId}
      `;
      
      return NextResponse.json({
        success: true,
        message: 'Chunk deleted successfully',
        deletedCount: result.rowCount || 0
      });
      
    } else if (body.sourceFile) {
      // Delete all chunks for a file
      const result = await sql`
        DELETE FROM document_chunks 
        WHERE source_file = ${body.sourceFile}
      `;
      
      return NextResponse.json({
        success: true,
        message: `All chunks for "${body.sourceFile}" deleted successfully`,
        deletedCount: result.rowCount || 0
      });
      
    } else {
      return NextResponse.json(
        { error: 'Either chunkId or sourceFile must be provided' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Embeddings delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete embeddings' },
      { status: 500 }
    );
  }
}