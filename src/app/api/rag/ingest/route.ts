import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { sql } from '@/lib/database';
import { uploadedFilesStore, StoredFile } from '@/lib/file-storage';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Store active ingestion jobs in memory (in production, use Redis or database)
const activeJobs = new Map<string, {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalFiles: number;
  processedFiles: number;
  currentFile?: string;
  startTime: Date;
  endTime?: Date;
  error?: string;
  logs: string[];
}>();

export async function POST(request: NextRequest) {
  try {
    const { documentType, action, files, options } = await request.json();
    
    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    // Generate unique job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Map document types to script paths
    const scriptMap: Record<string, string> = {
      'how-to-guides': 'scripts/ingest-how-to-guides.js',
      'module-docs': 'scripts/ingest-module-docs.js',
      'faq-documents': 'scripts/ingest-faq-documents.js',
      'online-ba-questions': 'scripts/ingest-online-ba-questions.js',
      'verified-content': 'scripts/ingest-verified-content.js',
      'navigation-guides': 'scripts/navigation-system/process/ingest-navigation.js'
    };

    // Single file ingestion script map
    const singleFileScriptMap: Record<string, string> = {
      'online-ba-questions': 'scripts/ingest-single-online-ba-question.js'
    };

    // Determine if we should process only uploaded files or full directory
    const shouldProcessOnlyUploadedFiles = action === 'custom' && files && files.length > 0;
    const shouldProcessSingleFiles = shouldProcessOnlyUploadedFiles && singleFileScriptMap[documentType];

    // Initialize job tracking
    const job: {
      id: string;
      type: string;
      status: 'pending' | 'running' | 'completed' | 'failed';
      progress: number;
      totalFiles: number;
      processedFiles: number;
      currentFile?: string;
      startTime: Date;
      endTime?: Date;
      error?: string;
      logs: string[];
    } = {
      id: jobId,
      type: documentType,
      status: 'pending',
      progress: 0,
      totalFiles: shouldProcessOnlyUploadedFiles ? files.length : 0,
      processedFiles: 0,
      startTime: new Date(),
      logs: []
    };
    
    activeJobs.set(jobId, job);

    if (shouldProcessSingleFiles) {
      // Process only the uploaded files using single-file ingestion
      job.logs.push(`Processing ${files.length} uploaded file(s) only`);
      job.status = 'running';
      
      let processedCount = 0;
      let hasError = false;
      
      for (const file of files) {
        try {
          job.currentFile = file.originalName;
          job.logs.push(`Processing: ${file.originalName}`);
          
          // Get file from memory store
          const fileId = file.path; // path is actually the fileId for memory storage
          const storedFile = uploadedFilesStore.get(fileId);
          
          if (!storedFile) {
            throw new Error(`File not found in memory store: ${file.originalName}`);
          }
          
          // Create temporary file for processing (in /tmp which is writable in Vercel)
          const tempDir = '/tmp/rag-uploads';
          if (!existsSync(tempDir)) {
            await mkdir(tempDir, { recursive: true });
          }
          
          const tempFilePath = path.join(tempDir, `${fileId}-${file.originalName}`);
          await writeFile(tempFilePath, storedFile.content);
          
          // Process file directly using inline ingestion logic
          await processFileDirectly(storedFile, documentType, job);
          
          processedCount++;
          job.processedFiles = processedCount;
          job.progress = Math.round((processedCount / files.length) * 100);
          job.logs.push(`✅ Completed: ${file.originalName}`);
          
          // Clean up from memory store
          uploadedFilesStore.delete(fileId);
          
        } catch (error) {
          hasError = true;
          job.logs.push(`❌ Error processing ${file.originalName}: ${error}`);
        }
      }
      
      // Update final job status
      job.endTime = new Date();
      if (hasError) {
        job.status = 'failed';
        job.error = 'One or more files failed to process';
      } else {
        job.status = 'completed';
        job.progress = 100;
        job.logs.push('✅ All uploaded files processed successfully');
      }
      
    } else {
      // Use existing full directory processing
      const scriptPath = scriptMap[documentType];
      if (!scriptPath) {
        return NextResponse.json(
          { error: 'Invalid document type' },
          { status: 400 }
        );
      }

      job.logs.push(`Started ${action === 'full-reingestion' ? 'full re-ingestion' : 'incremental ingestion'} for ${documentType}`);
      
      // Start ingestion process
      const scriptFullPath = path.join(process.cwd(), scriptPath);
      const nodeProcess = spawn('node', [scriptFullPath], {
        cwd: process.cwd(),
        env: { ...process.env }
      });

      job.status = 'running';

      // Handle process output
      nodeProcess.stdout.on('data', (data) => {
        const output = data.toString();
        job.logs.push(output.trim());
        
        // Parse progress from output
        if (output.includes('Processing') && output.includes('/')) {
          const match = output.match(/(\d+)\/(\d+)/);
          if (match) {
            job.processedFiles = parseInt(match[1]);
            job.totalFiles = parseInt(match[2]);
            job.progress = Math.round((job.processedFiles / job.totalFiles) * 100);
          }
        }
        
        // Extract current file being processed
        if (output.includes('Processing:')) {
          const fileMatch = output.match(/Processing: (.+)/);
          if (fileMatch) {
            job.currentFile = fileMatch[1];
          }
        }
      });

      nodeProcess.stderr.on('data', (data) => {
        const error = data.toString();
        job.logs.push(`ERROR: ${error.trim()}`);
      });

      nodeProcess.on('close', (code) => {
        job.endTime = new Date();
        if (code === 0) {
          job.status = 'completed';
          job.progress = 100;
          job.logs.push('Ingestion completed successfully');
        } else {
          job.status = 'failed';
          job.error = `Process exited with code ${code}`;
          job.logs.push(`Process failed with exit code: ${code}`);
        }
      });
    }

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Ingestion started',
      documentType
    });

  } catch (error) {
    console.error('Ingestion start error:', error);
    return NextResponse.json(
      { error: 'Failed to start ingestion' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');
  
  if (!jobId) {
    // Return all active jobs
    return NextResponse.json({
      jobs: Array.from(activeJobs.values())
    });
  }
  
  const job = activeJobs.get(jobId);
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(job);
}

// Direct file processing function for Vercel compatibility
async function processFileDirectly(file: StoredFile, documentType: string, job: any) {
  try {
    job.logs.push(`Starting direct processing of ${file.originalName}`);
    
    // Initialize Bedrock client
    const bedrockClient = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    
    // Extract text content from file
    const content = file.content.toString('utf-8');
    job.logs.push(`Extracted ${content.length} characters from file`);
    
    // Parse markdown content and extract topic area
    const topicAreaMatch = content.match(/\*\*Topic Area:\*\*\s*(.+)/i);
    const topicArea = topicAreaMatch ? topicAreaMatch[1].trim() : extractTopicFromFilename(file.originalName);
    
    job.logs.push(`Detected topic area: ${topicArea}`);
    
    // Clean and chunk the content
    const cleanedContent = cleanMarkdownContent(content);
    const chunks = createChunks(cleanedContent, 800, 100);
    
    job.logs.push(`Created ${chunks.length} chunks for processing`);
    
    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      job.logs.push(`Processing chunk ${i + 1}/${chunks.length}`);
      
      // Generate embedding
      const embedding = await generateEmbedding(chunk.text, bedrockClient);
      
      // Store in database
      await sql`
        INSERT INTO embeddings_v2 (
          content, 
          embedding, 
          document_type, 
          source_file, 
          chunk_index, 
          token_count,
          topic_area,
          created_at
        ) VALUES (
          ${chunk.text},
          ${JSON.stringify(embedding)},
          ${documentType},
          ${file.originalName},
          ${i},
          ${chunk.tokenCount},
          ${topicArea},
          ${new Date().toISOString()}
        )
      `;
      
      job.logs.push(`Stored chunk ${i + 1} in database`);
    }
    
    job.logs.push(`✅ Successfully processed ${file.originalName} with ${chunks.length} chunks`);
    
  } catch (error) {
    job.logs.push(`❌ Error processing ${file.originalName}: ${error}`);
    throw error;
  }
}

// Helper functions
function extractTopicFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/-faq$/, '')
    .replace(/-/g, '_')
    .toLowerCase();
}

function cleanMarkdownContent(content: string): string {
  return content
    .replace(/^#+ /gm, '')  // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1')  // Remove italic formatting
    .replace(/`(.*?)`/g, '$1')  // Remove code formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Remove links, keep text
    .replace(/^\s*[-*+]\s/gm, '')  // Remove list markers
    .replace(/\n{3,}/g, '\n\n')  // Normalize line breaks
    .trim();
}

function createChunks(text: string, maxTokens: number, overlapTokens: number) {
  const words = text.split(/\s+/);
  const chunks = [];
  const wordsPerToken = 4; // Rough estimate
  const maxWords = maxTokens * wordsPerToken;
  const overlapWords = overlapTokens * wordsPerToken;
  
  let startIndex = 0;
  let chunkIndex = 0;
  
  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + maxWords, words.length);
    const chunkWords = words.slice(startIndex, endIndex);
    const chunkText = chunkWords.join(' ');
    
    chunks.push({
      text: chunkText,
      tokenCount: Math.ceil(chunkWords.length / wordsPerToken),
      index: chunkIndex++
    });
    
    // Move start index, considering overlap
    if (endIndex >= words.length) break;
    startIndex = Math.max(startIndex + maxWords - overlapWords, startIndex + 1);
  }
  
  return chunks;
}

async function generateEmbedding(text: string, bedrockClient: BedrockRuntimeClient): Promise<number[]> {
  const maxLength = 25000;
  const processedText = text.length > maxLength ? text.substring(0, maxLength) : text;
  
  const input = {
    modelId: 'amazon.titan-embed-text-v2:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      inputText: processedText,
      dimensions: 1024,
      normalize: true
    }),
  };

  const command = new InvokeModelCommand(input);
  const response = await bedrockClient.send(command);
  
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.embedding;
}