import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { sql } from '@/lib/database';
import { uploadedFilesStore, StoredFile } from '@/lib/file-storage';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Type for uploaded file info from frontend
interface UploadedFileInfo {
  originalName: string;
  fileName: string;
  size: number;
  type: string;
  path: string; // This is the storage key
}

// Jobs are now tracked in database for serverless compatibility

function safeParseJSON(value: any, fallback: any) {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse JSON:', value, error);
    return fallback;
  }
}

// Vercel-compatible direct file processing
async function processFilesDirectly(jobId: string, job: any, files: UploadedFileInfo[], options: any) {
  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  job.totalFiles = files.length;
  job.processedFiles = 0;
  
  await updateJobStatus(jobId, { 
    logs: [...job.logs, `Processing ${files.length} file(s)...`]
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    job.currentFile = file.originalName;
    job.logs.push(`Processing: ${file.originalName} (${i + 1}/${files.length})`);
    
    await updateJobStatus(jobId, { 
      currentFile: job.currentFile,
      logs: job.logs
    });

    try {
      // Read file content from memory storage
      const storedFile = uploadedFilesStore.get(file.path);
      if (!storedFile) {
        throw new Error(`File not found in storage: ${file.originalName}`);
      }

      // Process markdown content
      await processMarkdownContent(client, storedFile.content.toString(), file.originalName, options);
      
      job.processedFiles++;
      job.progress = Math.round((job.processedFiles / job.totalFiles) * 100);
      job.logs.push(`✓ Completed: ${file.originalName}`);
      
      await updateJobStatus(jobId, { 
        processedFiles: job.processedFiles,
        progress: job.progress,
        logs: job.logs
      });

    } catch (error) {
      job.logs.push(`✗ Error processing ${file.originalName}: ${error.message}`);
      await updateJobStatus(jobId, { logs: job.logs });
      throw error;
    }
  }

  // Mark as completed
  job.status = 'completed';
  job.progress = 100;
  job.endTime = new Date();
  job.logs.push('✓ Ingestion completed successfully');
  
  await updateJobStatus(jobId, { 
    status: 'completed', 
    progress: 100,
    logs: job.logs,
    endTime: job.endTime
  });
}

// Process individual markdown content
async function processMarkdownContent(client: BedrockRuntimeClient, content: string, filename: string, options: any) {
  const maxTokens = options.maxTokens || 800;
  const overlapTokens = options.overlapTokens || 100;

  // Use existing chunking logic
  const chunks = createChunks(content, maxTokens, overlapTokens);
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    // Generate embedding
    const embedding = await generateEmbedding(chunk.text, client);
    
    // Store in database
    await sql`
      INSERT INTO document_chunks (
        source_file, section_title, chunk_text, chunk_index, 
        token_count, embedding, metadata
      ) VALUES (
        ${filename},
        ${extractTitle(chunk.text)},
        ${chunk.text},
        ${chunk.index || i},
        ${chunk.tokenCount},
        ${JSON.stringify(embedding)},
        ${JSON.stringify({ 
          topic_area: 'faq', 
          section_type: 'content',
          file_type: 'markdown'
        })}
      )
    `;
  }
}


// Extract title from chunk
function extractTitle(text: string): string {
  const lines = text.trim().split('\n');
  for (const line of lines) {
    if (line.startsWith('#')) {
      return line.replace(/^#+\s*/, '').trim();
    }
  }
  return 'Content';
}

async function updateJobStatus(jobId: string, updates: {
  status?: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  processedFiles?: number;
  currentFile?: string;
  logs?: string[];
  error?: string;
  endTime?: Date;
}) {
  // Build individual update queries for each field
  if (updates.status !== undefined) {
    await sql`UPDATE ingestion_jobs SET status = ${updates.status} WHERE id = ${jobId}`;
  }
  if (updates.progress !== undefined) {
    await sql`UPDATE ingestion_jobs SET progress = ${updates.progress} WHERE id = ${jobId}`;
  }
  if (updates.processedFiles !== undefined) {
    await sql`UPDATE ingestion_jobs SET processed_files = ${updates.processedFiles} WHERE id = ${jobId}`;
  }
  if (updates.currentFile !== undefined) {
    await sql`UPDATE ingestion_jobs SET current_file = ${updates.currentFile} WHERE id = ${jobId}`;
  }
  if (updates.logs !== undefined) {
    await sql`UPDATE ingestion_jobs SET logs = ${JSON.stringify(updates.logs)} WHERE id = ${jobId}`;
  }
  if (updates.error !== undefined) {
    await sql`UPDATE ingestion_jobs SET error = ${updates.error} WHERE id = ${jobId}`;
  }
  if (updates.endTime !== undefined) {
    await sql`UPDATE ingestion_jobs SET end_time = ${updates.endTime.toISOString()} WHERE id = ${jobId}`;
  }
}

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

    // Initialize job in database
    await sql`
      INSERT INTO ingestion_jobs (
        id, document_type, status, progress, total_files, processed_files, 
        start_time, logs
      ) VALUES (
        ${jobId}, ${documentType}, 'pending', 0, 
        ${shouldProcessOnlyUploadedFiles ? files.length : 0}, 0,
        ${new Date().toISOString()}, ${JSON.stringify([])}
      )
    `;
    
    const job: {
      id: string;
      type: string;
      status: 'pending' | 'running' | 'completed' | 'failed';
      progress: number;
      totalFiles: number;
      processedFiles: number;
      startTime: Date;
      logs: string[];
      currentFile?: string;
      endTime?: Date;
      error?: string;
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

    if (shouldProcessSingleFiles) {
      // Process only the uploaded files using single-file ingestion
      job.logs.push(`Processing ${files.length} uploaded file(s) only`);
      job.status = 'running';
      await updateJobStatus(jobId, { status: 'running', logs: job.logs });
      
      let processedCount = 0;
      let hasError = false;
      
      for (const file of files) {
        try {
          job.currentFile = file.originalName;
          job.logs.push(`Processing: ${file.originalName}`);
          await updateJobStatus(jobId, { currentFile: file.originalName, logs: job.logs });
          
          // Get file from memory store
          const fileId = file.path; // path contains the actual storage key
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
          await updateJobStatus(jobId, { 
            processedFiles: processedCount, 
            progress: job.progress, 
            logs: job.logs 
          });
          
          // Clean up from memory store
          uploadedFilesStore.delete(fileId);
          
        } catch (error) {
          hasError = true;
          job.logs.push(`❌ Error processing ${file.originalName}: ${error}`);
          await updateJobStatus(jobId, { logs: job.logs });
        }
      }
      
      // Update final job status
      const endTime = new Date();
      if (hasError) {
        await updateJobStatus(jobId, { 
          status: 'failed', 
          error: 'One or more files failed to process',
          endTime 
        });
      } else {
        job.logs.push('✅ All uploaded files processed successfully');
        await updateJobStatus(jobId, { 
          status: 'completed', 
          progress: 100, 
          logs: job.logs,
          endTime 
        });
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
      
      // Process files directly in serverless function (Vercel compatible)
      job.status = 'running';
      await updateJobStatus(jobId, { status: 'running' });
      
      try {
        // Process uploaded files directly
        await processFilesDirectly(jobId, job, files, options);
      } catch (error) {
        job.status = 'failed';
        job.error = error.message;
        job.logs.push(`ERROR: ${error.message}`);
        await updateJobStatus(jobId, { 
          status: 'failed', 
          error: job.error,
          logs: job.logs 
        });
      }
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
  
  try {
    if (!jobId) {
      // Return all recent jobs
      const jobs = await sql`
        SELECT id, document_type as type, status, progress, total_files, 
               processed_files, current_file, start_time, end_time, error, logs
        FROM ingestion_jobs 
        WHERE start_time > NOW() - INTERVAL '1 hour'
        ORDER BY start_time DESC
      `;
      
      return NextResponse.json({
        jobs: jobs.map(job => ({
          ...job,
          startTime: new Date(job.start_time),
          endTime: job.end_time ? new Date(job.end_time) : undefined,
          logs: safeParseJSON(job.logs, []),
          totalFiles: job.total_files,
          processedFiles: job.processed_files,
          currentFile: job.current_file
        }))
      });
    }
    
    const jobResult = await sql`
      SELECT id, document_type as type, status, progress, total_files, 
             processed_files, current_file, start_time, end_time, error, logs
      FROM ingestion_jobs 
      WHERE id = ${jobId}
    `;
    
    if (jobResult.length === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    const job = jobResult[0];
    return NextResponse.json({
      ...job,
      startTime: new Date(job.start_time),
      endTime: job.end_time ? new Date(job.end_time) : undefined,
      logs: safeParseJSON(job.logs, []),
      totalFiles: job.total_files,
      processedFiles: job.processed_files,
      currentFile: job.current_file
    });
  } catch (error) {
    console.error('Job status error:', error);
    return NextResponse.json(
      { error: 'Failed to get job status' },
      { status: 500 }
    );
  }
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
    
    // Parse markdown content and extract topic area based on document type
    let topicArea: string;
    if (documentType === 'online-ba-questions') {
      topicArea = determineOnlineBATopicArea(file.originalName);
    } else {
      const topicAreaMatch = content.match(/\*\*Topic Area:\*\*\s*(.+)/i);
      topicArea = topicAreaMatch ? topicAreaMatch[1].trim() : extractTopicFromFilename(file.originalName);
    }
    
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
        INSERT INTO document_chunks (
          source_file, 
          section_title,
          chunk_text, 
          chunk_index, 
          token_count,
          embedding, 
          metadata
        ) VALUES (
          ${file.originalName},
          ${''},
          ${chunk.text},
          ${i},
          ${chunk.tokenCount},
          ${JSON.stringify(embedding)},
          ${JSON.stringify({
            document_type: documentType,
            topic_area: topicArea,
            section_type: 'online_ba_content',
            has_procedures: false,
            subsection_count: 0,
            complexity_level: 'intermediate'
          })}
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

function determineOnlineBATopicArea(filename: string): string {
  const lowerName = filename.toLowerCase().replace('-faq.md', '');
  
  if (lowerName.includes('automatic-matching-settings-configuration')) return 'matching_configuration_ba';
  if (lowerName.includes('food-poisoning-additional-victims-complainants')) return 'food_poisoning_victims_ba';
  if (lowerName.includes('gazetteer-address-integration')) return 'gazetteer_integration_ba';
  if (lowerName.includes('online-request-premises-matching-fields')) return 'matching_fields_ba';
  if (lowerName.includes('online-request-premises-matching-process')) return 'matching_process_ba';
  if (lowerName.includes('premises-matching-online-service-requests')) return 'service_requests_matching_ba';
  if (lowerName.includes('prosecution-outcome-information')) return 'prosecution_outcomes_ba';
  if (lowerName.includes('system-complex-areas-user-confusion')) return 'user_confusion_ba';
  if (lowerName.includes('notice-type-days-to-fees-due')) return 'notice_fees_due_ba';
  if (lowerName.includes('trading-standards-cacs-citizens-advice')) return 'trading_standards_imports_ba';
  
  return 'online_ba_general';
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