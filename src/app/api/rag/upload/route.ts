import { NextRequest, NextResponse } from 'next/server';
import { uploadedFilesStore, cleanupOldFiles } from '@/lib/file-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');
    
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const documentType = formData.get('documentType') as string;
    
    console.log('Form data parsed:', {
      filesCount: files.length,
      documentType,
      fileNames: files.map(f => f.name)
    });
    
    if (!files || files.length === 0) {
      console.log('No files provided');
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!documentType) {
      console.log('No document type provided');
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    for (const file of files) {
      console.log(`Processing file: ${file.name}, size: ${file.size}`);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique file ID for memory storage
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const safeFileName = `${fileId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      // Store file in memory
      uploadedFilesStore.set(fileId, {
        id: fileId,
        originalName: file.name,
        content: buffer,
        size: file.size,
        type: file.type,
        uploadTime: new Date()
      });
      
      console.log(`File stored in memory with ID: ${fileId}`);
      
      uploadedFiles.push({
        originalName: file.name,
        fileName: safeFileName,
        size: file.size,
        type: file.type,
        path: fileId // Use fileId as path reference for memory storage
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
      documentType
    });

  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to upload files',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}