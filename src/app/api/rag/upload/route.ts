import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const documentType = formData.get('documentType') as string;
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', documentType);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate safe filename
      const timestamp = Date.now();
      const safeFileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeFileName);
      
      await writeFile(filePath, buffer);
      
      uploadedFiles.push({
        originalName: file.name,
        fileName: safeFileName,
        size: file.size,
        type: file.type,
        path: filePath
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
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}