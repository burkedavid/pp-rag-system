import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { sql } from '@/lib/database';

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
          
          const singleFileScript = singleFileScriptMap[documentType];
          const scriptFullPath = path.join(process.cwd(), singleFileScript);
          
          // Run single file ingestion synchronously
          await new Promise<void>((resolve, reject) => {
            const nodeProcess = spawn('node', [scriptFullPath, file.path], {
              cwd: process.cwd(),
              env: { ...process.env }
            });

            let processOutput = '';
            
            nodeProcess.stdout.on('data', (data) => {
              const output = data.toString();
              processOutput += output;
              job.logs.push(output.trim());
            });

            nodeProcess.stderr.on('data', (data) => {
              const error = data.toString();
              job.logs.push(`ERROR: ${error.trim()}`);
            });

            nodeProcess.on('close', (code) => {
              if (code === 0) {
                processedCount++;
                job.processedFiles = processedCount;
                job.progress = Math.round((processedCount / files.length) * 100);
                job.logs.push(`✅ Completed: ${file.originalName}`);
                resolve();
              } else {
                hasError = true;
                job.logs.push(`❌ Failed: ${file.originalName} (exit code: ${code})`);
                reject(new Error(`Process failed with code ${code}`));
              }
            });
          });
          
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