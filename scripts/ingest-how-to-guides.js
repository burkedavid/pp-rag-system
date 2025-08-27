#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: '.env.local' });

// Configuration - can be overridden via environment variables
const HOW_TO_GUIDES_DIR = process.env.HOW_TO_GUIDES_DIR || path.join(__dirname, '..', 'RAG Data', 'How-To-Guides');
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 5;
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS) || 800;
const OVERLAP_TOKENS = parseInt(process.env.OVERLAP_TOKENS) || 100;
const DRY_RUN = process.env.DRY_RUN === 'true' || process.argv.includes('--dry-run');
const VERBOSE = process.env.VERBOSE === 'true' || process.argv.includes('--verbose');
const FORCE_REPROCESS = process.env.FORCE_REPROCESS === 'true' || process.argv.includes('--force');

// Initialize clients
const sql = neon(process.env.DATABASE_URL);
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper functions
function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}

async function generateEmbedding(text, retryCount = 0) {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second
  
  try {
    // Validate input text
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Invalid text input for embedding generation');
    }
    
    // Truncate text if too long (Titan has limits)
    const maxLength = 25000; // Conservative limit for Titan
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
    
    // Validate response
    if (!responseBody.embedding || !Array.isArray(responseBody.embedding)) {
      throw new Error('Invalid embedding response from Bedrock');
    }
    
    return responseBody.embedding;
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
      console.log(`⚠️  Embedding generation failed (attempt ${retryCount + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateEmbedding(text, retryCount + 1);
    }
    
    console.error('Error generating embedding after all retries:', error);
    throw error;
  }
}

function parseMarkdownSections(content) {
  const sections = [];
  // Handle both Unix and Windows line endings
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let currentSection = null;
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      
      currentSection = {
        title,
        content: '',
        level
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

function chunkSection(section, sourceFile, maxTokens, overlapTokens, startIndex) {
  const chunks = [];
  const paragraphs = section.content.split('\n\n').filter(p => p.trim());
  
  let currentChunk = '';
  let chunkIndex = startIndex;
  
  for (const paragraph of paragraphs) {
    const potentialChunk = currentChunk + (currentChunk ? '\n\n' : '') + paragraph;
    const tokenCount = estimateTokenCount(potentialChunk);
    
    if (tokenCount > maxTokens && currentChunk) {
      chunks.push({
        source_file: sourceFile,
        section_title: section.title,
        chunk_text: currentChunk.trim(),
        chunk_index: chunkIndex++,
        token_count: estimateTokenCount(currentChunk),
      });
      
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlapTokens / 4 * 4));
      currentChunk = overlapWords.join(' ') + '\n\n' + paragraph;
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push({
      source_file: sourceFile,
      section_title: section.title,
      chunk_text: currentChunk.trim(),
      chunk_index: chunkIndex,
      token_count: estimateTokenCount(currentChunk),
    });
  }
  
  return chunks;
}

function determineHowToTopicArea(filename) {
  const lowerName = filename.toLowerCase().replace('how-to-', '').replace('.md', '');
  
  // How-to guide specific topic areas based on the files created
  if (lowerName.includes('create-licensing-applications')) return 'licensing_howto';
  if (lowerName.includes('create-service-requests')) return 'service_requests_howto';
  if (lowerName.includes('create-inspection-records')) return 'inspections_howto';
  if (lowerName.includes('create-grant-applications')) return 'grants_howto';
  if (lowerName.includes('create-accident-records')) return 'accidents_howto';
  if (lowerName.includes('create-food-poisoning-investigations')) return 'food_poisoning_howto';
  if (lowerName.includes('create-dog-cases')) return 'dog_control_howto';
  if (lowerName.includes('add-actions-to-cases')) return 'actions_howto';
  if (lowerName.includes('create-premises-records')) return 'premises_howto';
  if (lowerName.includes('upload-files-to-cases')) return 'file_management_howto';
  if (lowerName.includes('add-additional-contacts-to-cases')) return 'contacts_howto';
  if (lowerName.includes('send-emails')) return 'email_howto';
  if (lowerName.includes('add-communications')) return 'communications_howto';
  if (lowerName.includes('create-notes')) return 'notes_howto';
  if (lowerName.includes('generate-notices')) return 'notices_howto';
  if (lowerName.includes('manage-prosecutions')) return 'prosecutions_howto';
  
  return 'howto_general';
}

function determineSectionType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('overview') || lowerTitle.includes('introduction')) return 'howto_overview';
  if (lowerTitle.includes('step-by-step') || lowerTitle.includes('guide to')) return 'howto_procedure';
  if (lowerTitle.includes('types of') || lowerTitle.includes('supported')) return 'howto_types';
  if (lowerTitle.includes('best practices') || lowerTitle.includes('practices')) return 'howto_best_practices';
  if (lowerTitle.includes('troubleshooting') || lowerTitle.includes('common issues')) return 'howto_troubleshooting';
  if (lowerTitle.includes('advanced') || lowerTitle.includes('features')) return 'howto_advanced';
  if (lowerTitle.includes('integration') || lowerTitle.includes('with other')) return 'howto_integration';
  if (lowerTitle.includes('step ') || lowerTitle.includes('complete ')) return 'howto_step';
  if (lowerTitle.includes('when to') || lowerTitle.includes('use ')) return 'howto_when';
  if (lowerTitle.includes('managing') || lowerTitle.includes('different')) return 'howto_managing';
  
  return 'howto_content';
}

function containsProcedures(content) {
  const procedureIndicators = [
    'step 1', 'step 2', 'step 3', 'first', 'then', 'next', 'finally',
    '1.', '2.', '3.', '4.', '5.', 'click', 'navigate', 'select', 'enter',
    'complete', 'configure', 'review', 'save', 'submit'
  ];
  
  const lowerContent = content.toLowerCase();
  return procedureIndicators.some(indicator => lowerContent.includes(indicator));
}

function countSubsections(content) {
  return (content.match(/^###+ /gm) || []).length;
}

function extractGuideComplexity(content, title) {
  const complexityIndicators = {
    basic: ['basic', 'simple', 'quick', 'overview'],
    intermediate: ['configure', 'manage', 'advanced', 'integration'],
    complex: ['troubleshooting', 'complex', 'comprehensive', 'multi-step']
  };
  
  const lowerContent = (title + ' ' + content).toLowerCase();
  
  for (const [level, indicators] of Object.entries(complexityIndicators)) {
    if (indicators.some(indicator => lowerContent.includes(indicator))) {
      return level;
    }
  }
  
  return 'intermediate';
}

async function processDocument(filePath) {
  console.log(`📄 Processing: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const sections = parseMarkdownSections(content);
  
  const chunks = [];
  const topicArea = determineHowToTopicArea(filename);
  
  for (const section of sections) {
    const sectionChunks = chunkSection(section, filename, MAX_TOKENS, OVERLAP_TOKENS, chunks.length);
    
    sectionChunks.forEach(chunk => {
      chunk.metadata = {
        section_type: determineSectionType(section.title),
        topic_area: topicArea,
        has_procedures: containsProcedures(section.content),
        subsection_count: countSubsections(section.content),
        guide_complexity: extractGuideComplexity(section.content, section.title),
        document_type: 'how_to_guide'
      };
    });
    
    chunks.push(...sectionChunks);
  }
  
  console.log(`   Generated ${chunks.length} chunks`);
  return chunks;
}

async function insertChunksWithEmbeddings(chunks) {
  console.log(`🤖 Generating embeddings for ${chunks.length} chunks...`);
  
  if (chunks.length === 0) {
    console.log('⚠️  No chunks to process');
    return;
  }
  
  let totalInserted = 0;
  let failedChunks = [];
  
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i/BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(chunks.length/BATCH_SIZE);
    
    console.log(`   Processing batch ${batchNum}/${totalBatches} (${batch.length} chunks)`);
    
    try {
      // Generate embeddings for batch with individual error handling
      const embeddings = [];
      for (let k = 0; k < batch.length; k++) {
        try {
          const embedding = await generateEmbedding(batch[k].chunk_text);
          embeddings.push(embedding);
        } catch (error) {
          console.error(`   ❌ Failed to generate embedding for chunk ${batch[k].chunk_index}: ${error.message}`);
          failedChunks.push({ chunk: batch[k], error: error.message, stage: 'embedding' });
          embeddings.push(null); // Placeholder
        }
      }
      
      // Insert chunks with embeddings (skip failed ones)
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        const embedding = embeddings[j];
        
        if (embedding === null) {
          console.log(`   ⏭️  Skipping chunk ${chunk.chunk_index} due to embedding failure`);
          continue;
        }
        
        try {
          // Validate chunk data before insertion
          if (!chunk.source_file || !chunk.chunk_text || chunk.chunk_text.trim().length === 0) {
            throw new Error('Invalid chunk data');
          }
          
          await sql`
            INSERT INTO document_chunks (
              source_file, section_title, chunk_text, chunk_index, 
              token_count, embedding, metadata
            ) VALUES (
              ${chunk.source_file}, 
              ${chunk.section_title || ''}, 
              ${chunk.chunk_text}, 
              ${chunk.chunk_index}, 
              ${chunk.token_count || estimateTokenCount(chunk.chunk_text)}, 
              ${JSON.stringify(embedding)}, 
              ${JSON.stringify(chunk.metadata || {})}
            );
          `;
          
          totalInserted++;
          
        } catch (error) {
          console.error(`   ❌ Failed to insert chunk ${chunk.chunk_index}: ${error.message}`);
          failedChunks.push({ chunk, error: error.message, stage: 'insertion' });
        }
      }
      
      // Progress update
      console.log(`   ✅ Batch ${batchNum} completed (${totalInserted} total inserted)`);
      
    } catch (error) {
      console.error(`   ❌ Batch ${batchNum} failed completely:`, error.message);
      batch.forEach(chunk => {
        failedChunks.push({ chunk, error: error.message, stage: 'batch' });
      });
    }
    
    // Rate limiting delay between batches
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  
  // Summary of results
  console.log(`\n📊 Embedding and Insertion Summary:`);
  console.log(`   Total chunks processed: ${chunks.length}`);
  console.log(`   Successfully inserted: ${totalInserted}`);
  console.log(`   Failed chunks: ${failedChunks.length}`);
  
  if (failedChunks.length > 0) {
    console.log(`\n⚠️  Failed Chunks Breakdown:`);
    const embeddingFailures = failedChunks.filter(f => f.stage === 'embedding').length;
    const insertionFailures = failedChunks.filter(f => f.stage === 'insertion').length;
    const batchFailures = failedChunks.filter(f => f.stage === 'batch').length;
    
    if (embeddingFailures > 0) console.log(`   Embedding failures: ${embeddingFailures}`);
    if (insertionFailures > 0) console.log(`   Database insertion failures: ${insertionFailures}`);
    if (batchFailures > 0) console.log(`   Batch processing failures: ${batchFailures}`);
    
    // Show first few failed chunks for debugging
    console.log(`\n❌ First few failed chunks:`);
    failedChunks.slice(0, 3).forEach((f, idx) => {
      console.log(`   ${idx + 1}. File: ${f.chunk.source_file}, Index: ${f.chunk.chunk_index}, Stage: ${f.stage}, Error: ${f.error}`);
    });
    
    if (failedChunks.length > 3) {
      console.log(`   ... and ${failedChunks.length - 3} more`);
    }
  }
  
  return { totalInserted, failedChunks };
}

function printUsage() {
  console.log('Usage: node ingest-how-to-guides.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --dry-run    Simulate the ingestion without making database changes');
  console.log('  --verbose    Enable verbose logging');
  console.log('  --force      Force reprocessing even if files haven\'t changed');
  console.log('  --help       Show this help message');
  console.log('');
  console.log('Environment Variables:');
  console.log('  HOW_TO_GUIDES_DIR  Directory containing How-To guide files (default: RAG Data/How-To-Guides)');
  console.log('  BATCH_SIZE         Number of chunks to process in each batch (default: 5)');
  console.log('  MAX_TOKENS         Maximum tokens per chunk (default: 800)');
  console.log('  OVERLAP_TOKENS     Token overlap between chunks (default: 100)');
  console.log('  DRY_RUN           Set to "true" for dry run mode');
  console.log('  VERBOSE           Set to "true" for verbose logging');
  console.log('  FORCE_REPROCESS   Set to "true" to force reprocessing');
}

async function ingestHowToGuides() {
  try {
    // Handle help flag
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
      printUsage();
      return;
    }
    
    console.log('🚀 Starting How-To Guides ingestion...');
    
    // Log configuration
    if (VERBOSE) {
      console.log('\n⚙️  Configuration:');
      console.log(`   Directory: ${HOW_TO_GUIDES_DIR}`);
      console.log(`   Batch size: ${BATCH_SIZE}`);
      console.log(`   Max tokens per chunk: ${MAX_TOKENS}`);
      console.log(`   Token overlap: ${OVERLAP_TOKENS}`);
      console.log(`   Dry run: ${DRY_RUN}`);
      console.log(`   Verbose: ${VERBOSE}`);
      console.log(`   Force reprocess: ${FORCE_REPROCESS}`);
    }
    
    if (DRY_RUN) {
      console.log('🔍 DRY RUN MODE - No database changes will be made');
    }
    
    // Check if How-To Guides directory exists
    if (!fs.existsSync(HOW_TO_GUIDES_DIR)) {
      console.error(`❌ How-To Guides directory not found: ${HOW_TO_GUIDES_DIR}`);
      process.exit(1);
    }
    
    // Remove any existing how-to guides to avoid duplicates (unless dry run)
    if (!DRY_RUN) {
      console.log('🗑️  Removing existing How-To Guides...');
      const deleteResult = await sql`
        DELETE FROM document_chunks 
        WHERE metadata->>'document_type' = 'how_to_guide'
        OR source_file LIKE 'How-to-%.md';
      `;
      console.log(`✅ Removed ${deleteResult.length} existing How-To Guide chunks`);
    } else {
      // In dry run, just count existing chunks
      const existingCount = await sql`
        SELECT COUNT(*) as count
        FROM document_chunks 
        WHERE metadata->>'document_type' = 'how_to_guide'
        OR source_file LIKE 'How-to-%.md';
      `;
      console.log(`📊 Would remove ${existingCount[0].count} existing How-To Guide chunks (dry run)`);
    }
    
    // Get all how-to guide markdown files
    const files = fs.readdirSync(HOW_TO_GUIDES_DIR)
      .filter(file => file.startsWith('How-to-') && file.endsWith('.md'))
      .sort();
    
    console.log(`📚 Found ${files.length} How-To Guide markdown files`);
    
    if (files.length === 0) {
      console.log('⚠️  No How-To Guide files found to process');
      return;
    }
    
    let totalChunks = 0;
    let processedFiles = 0;
    let failedFiles = [];
    
    // Process each file with error handling
    for (const file of files) {
      try {
        console.log(`\n📄 Processing ${processedFiles + 1}/${files.length}: ${file}`);
        const filePath = path.join(HOW_TO_GUIDES_DIR, file);
        
        // Check if file exists and is readable
        if (!fs.existsSync(filePath)) {
          console.log(`⚠️  File not found: ${file}`);
          failedFiles.push({ file, reason: 'File not found' });
          continue;
        }
        
        const chunks = await processDocument(filePath);
        
        if (chunks.length > 0) {
          if (!DRY_RUN) {
            await insertChunksWithEmbeddings(chunks);
          } else {
            console.log(`📊 Would generate embeddings for ${chunks.length} chunks (dry run)`);
          }
          totalChunks += chunks.length;
          processedFiles++;
          console.log(`✅ Processed ${file}: ${chunks.length} chunks`);
          
          // Progress indicator
          console.log(`   Progress: ${processedFiles}/${files.length} files (${Math.round(processedFiles/files.length*100)}%)`);
        } else {
          console.log(`⚠️  No chunks generated for ${file}`);
          failedFiles.push({ file, reason: 'No chunks generated' });
        }
        
        // Small delay between files to prevent rate limiting
        if (processedFiles < files.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        failedFiles.push({ file, reason: error.message });
        continue;
      }
    }
    
    // Final verification with retry logic (skip in dry run)
    let finalCount, totalDocumentCount, fileBreakdown;
    
    if (!DRY_RUN) {
      console.log('\n🔍 Verifying ingestion...');
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          finalCount = await sql`
            SELECT COUNT(*) as count 
            FROM document_chunks 
            WHERE metadata->>'document_type' = 'how_to_guide';
          `;
          break;
        } catch (error) {
          retryCount++;
          console.log(`⚠️  Database query failed (attempt ${retryCount}/${maxRetries}), retrying...`);
          if (retryCount === maxRetries) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      totalDocumentCount = await sql`SELECT COUNT(*) as count FROM document_chunks;`;
      
      // Get detailed breakdown
      fileBreakdown = await sql`
        SELECT source_file, COUNT(*) as chunk_count
        FROM document_chunks 
        WHERE metadata->>'document_type' = 'how_to_guide'
        GROUP BY source_file
        ORDER BY source_file;
      `;
    } else {
      console.log('\n📊 Dry run verification - no database queries performed');
      finalCount = [{ count: 0 }];
      totalDocumentCount = [{ count: 0 }];
      fileBreakdown = [];
    }
    
    console.log('\n📊 How-To Guides Ingestion Summary:');
    console.log(`   How-To Guide files found: ${files.length}`);
    console.log(`   How-To Guide files processed: ${processedFiles}`);
    console.log(`   How-To Guide files failed: ${failedFiles.length}`);
    console.log(`   How-To Guide chunks generated: ${totalChunks}`);
    console.log(`   How-To Guide chunks in database: ${finalCount[0].count}`);
    console.log(`   Total chunks in database: ${totalDocumentCount[0].count}`);
    
    // Show failed files if any
    if (failedFiles.length > 0) {
      console.log('\n⚠️  Failed Files:');
      failedFiles.forEach(({ file, reason }) => {
        console.log(`   ❌ ${file}: ${reason}`);
      });
    }
    
    // Show successful files breakdown
    if (fileBreakdown.length > 0) {
      console.log('\n✅ Successfully Processed Files:');
      fileBreakdown.forEach(row => {
        console.log(`   📄 ${row.source_file}: ${row.chunk_count} chunks`);
      });
    }
    
    // Validation checks
    const expectedChunks = totalChunks;
    const actualChunks = parseInt(finalCount[0].count);
    
    if (actualChunks !== expectedChunks) {
      console.warn(`\n⚠️  Warning: Chunk count mismatch!`);
      console.warn(`   Expected: ${expectedChunks} chunks`);
      console.warn(`   Found in database: ${actualChunks} chunks`);
      console.warn(`   Difference: ${actualChunks - expectedChunks} chunks`);
    } else {
      console.log('\n✅ Chunk count validation passed');
    }
    
    if (processedFiles === files.length && failedFiles.length === 0) {
      if (DRY_RUN) {
        console.log('\n🎉 How-To Guides dry run completed successfully!');
        console.log('   Run without --dry-run to perform actual ingestion');
      } else {
        console.log('\n🎉 How-To Guides ingestion completed successfully!');
      }
    } else {
      console.log('\n⚠️  How-To Guides ingestion completed with some issues');
      if (processedFiles > 0) {
        console.log(`   ${processedFiles} files processed successfully`);
      }
      if (failedFiles.length > 0) {
        console.log(`   ${failedFiles.length} files failed to process`);
      }
    }
    
    if (!DRY_RUN) {
      console.log('\n🔍 You can now test the system with procedural queries like:');
      console.log('   - "How do I create a licensing application?"');
      console.log('   - "What are the steps to upload files to a case?"');
      console.log('   - "How do I add actions to accident investigations?"');
      console.log('   - "What is the process for creating service requests?"');
      console.log('   - "How do I generate formal notices?"');
      console.log('   - "What are the steps for managing prosecutions?"');
    } else {
      console.log('\n📋 Dry run completed. Use the following command to run the actual ingestion:');
      console.log('   node scripts/ingest-how-to-guides.js');
    }
    
  } catch (error) {
    console.error('❌ How-To Guides ingestion failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  ingestHowToGuides();
}

module.exports = { ingestHowToGuides };