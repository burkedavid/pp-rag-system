#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: '.env.local' });

// Configuration - can be overridden via environment variables
const VERIFIED_CONTENT_DIR = process.env.VERIFIED_CONTENT_DIR || path.join(__dirname, '..', 'RAG Data', 'Verified-Content');
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

function determineVerifiedTopicArea(filename) {
  const lowerName = filename.toLowerCase().replace('-module-verified.md', '');
  
  // Verified content specific topic areas based on the files found
  if (lowerName.includes('contacts')) return 'contacts_verified';
  if (lowerName.includes('dogs-animals')) return 'dogs_animals_verified';
  if (lowerName.includes('enforcement')) return 'enforcement_verified';
  if (lowerName.includes('food-safety')) return 'food_safety_verified';
  if (lowerName.includes('inspections')) return 'inspections_verified';
  if (lowerName.includes('licensing')) return 'licensing_verified';
  if (lowerName.includes('mobile-working')) return 'mobile_working_verified';
  if (lowerName.includes('premises-management')) return 'premises_management_verified';
  if (lowerName.includes('prosecutions')) return 'prosecutions_verified';
  if (lowerName.includes('system-search')) return 'system_search_verified';
  
  return 'verified_general';
}

function determineSectionType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('overview') || lowerTitle.includes('introduction')) return 'verified_overview';
  if (lowerTitle.includes('navigation') || lowerTitle.includes('access')) return 'verified_navigation';
  if (lowerTitle.includes('features') || lowerTitle.includes('functionality')) return 'verified_features';
  if (lowerTitle.includes('workflow') || lowerTitle.includes('process')) return 'verified_workflow';
  if (lowerTitle.includes('forms') || lowerTitle.includes('fields')) return 'verified_forms';
  if (lowerTitle.includes('search') || lowerTitle.includes('filter')) return 'verified_search';
  if (lowerTitle.includes('reports') || lowerTitle.includes('export')) return 'verified_reporting';
  if (lowerTitle.includes('integration') || lowerTitle.includes('link')) return 'verified_integration';
  if (lowerTitle.includes('verification') || lowerTitle.includes('source')) return 'verified_source';
  if (lowerTitle.includes('user interface') || lowerTitle.includes('ui')) return 'verified_ui';
  
  return 'verified_content';
}

function containsProcedures(content) {
  const procedureIndicators = [
    'step 1', 'step 2', 'step 3', 'first', 'then', 'next', 'finally',
    '1.', '2.', '3.', 'click', 'navigate', 'select', 'enter',
    'complete', 'configure', 'review', 'save', 'submit'
  ];
  
  const lowerContent = content.toLowerCase();
  return procedureIndicators.some(indicator => lowerContent.includes(indicator));
}

function countSubsections(content) {
  return (content.match(/^###+ /gm) || []).length;
}

function extractVerificationLevel(content, title) {
  const verificationIndicators = {
    high: ['source code verified', 'cypress verified', 'tested', 'confirmed'],
    medium: ['documented', 'observed', 'referenced'],
    basic: ['described', 'mentioned', 'noted']
  };
  
  const lowerContent = (title + ' ' + content).toLowerCase();
  
  for (const [level, indicators] of Object.entries(verificationIndicators)) {
    if (indicators.some(indicator => lowerContent.includes(indicator))) {
      return level;
    }
  }
  
  return 'medium';
}

async function processDocument(filePath) {
  console.log(`📄 Processing: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const sections = parseMarkdownSections(content);
  
  const chunks = [];
  const topicArea = determineVerifiedTopicArea(filename);
  
  for (const section of sections) {
    const sectionChunks = chunkSection(section, filename, MAX_TOKENS, OVERLAP_TOKENS, chunks.length);
    
    sectionChunks.forEach(chunk => {
      chunk.metadata = {
        section_type: determineSectionType(section.title),
        topic_area: topicArea,
        has_procedures: containsProcedures(section.content),
        subsection_count: countSubsections(section.content),
        verification_level: extractVerificationLevel(section.content, section.title),
        document_type: 'verified_content'
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
  console.log('Usage: node ingest-verified-content.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --dry-run    Simulate the ingestion without making database changes');
  console.log('  --verbose    Enable verbose logging');
  console.log('  --force      Force reprocessing even if files haven\'t changed');
  console.log('  --help       Show this help message');
  console.log('');
  console.log('Environment Variables:');
  console.log('  VERIFIED_CONTENT_DIR   Directory containing verified content files (default: RAG Data/Verified-Content)');
  console.log('  BATCH_SIZE             Number of chunks to process in each batch (default: 5)');
  console.log('  MAX_TOKENS             Maximum tokens per chunk (default: 800)');
  console.log('  OVERLAP_TOKENS         Token overlap between chunks (default: 100)');
  console.log('  DRY_RUN               Set to "true" for dry run mode');
  console.log('  VERBOSE               Set to "true" for verbose logging');
  console.log('  FORCE_REPROCESS       Set to "true" to force reprocessing');
}

async function ingestVerifiedContent() {
  try {
    // Handle help flag
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
      printUsage();
      return;
    }
    
    console.log('🚀 Starting Verified Content ingestion...');
    
    // Log configuration
    if (VERBOSE) {
      console.log('\n⚙️  Configuration:');
      console.log(`   Directory: ${VERIFIED_CONTENT_DIR}`);
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
    
    // Check if Verified Content directory exists
    if (!fs.existsSync(VERIFIED_CONTENT_DIR)) {
      console.error(`❌ Verified Content directory not found: ${VERIFIED_CONTENT_DIR}`);
      process.exit(1);
    }
    
    // Remove any existing verified content to avoid duplicates (unless dry run)
    if (!DRY_RUN) {
      console.log('🗑️  Removing existing Verified Content...');
      const deleteResult = await sql`
        DELETE FROM document_chunks 
        WHERE metadata->>'document_type' = 'verified_content'
        OR source_file LIKE '%-Module-Verified.md';
      `;
      console.log(`✅ Removed ${deleteResult.length} existing Verified Content chunks`);
    } else {
      // In dry run, just count existing chunks
      const existingCount = await sql`
        SELECT COUNT(*) as count
        FROM document_chunks 
        WHERE metadata->>'document_type' = 'verified_content'
        OR source_file LIKE '%-Module-Verified.md';
      `;
      console.log(`📊 Would remove ${existingCount[0].count} existing Verified Content chunks (dry run)`);
    }
    
    // Get all verified content markdown files
    const files = fs.readdirSync(VERIFIED_CONTENT_DIR)
      .filter(file => file.endsWith('-Module-Verified.md'))
      .sort();
    
    console.log(`📚 Found ${files.length} Verified Content markdown files`);
    
    if (files.length === 0) {
      console.log('⚠️  No Verified Content files found to process');
      return;
    }
    
    let totalChunks = 0;
    let processedFiles = 0;
    let failedFiles = [];
    
    // Process each file with error handling
    for (const file of files) {
      try {
        console.log(`\n📄 Processing ${processedFiles + 1}/${files.length}: ${file}`);
        const filePath = path.join(VERIFIED_CONTENT_DIR, file);
        
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
            WHERE metadata->>'document_type' = 'verified_content';
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
        WHERE metadata->>'document_type' = 'verified_content'
        GROUP BY source_file
        ORDER BY source_file;
      `;
    } else {
      console.log('\n📊 Dry run verification - no database queries performed');
      finalCount = [{ count: 0 }];
      totalDocumentCount = [{ count: 0 }];
      fileBreakdown = [];
    }
    
    console.log('\n📊 Verified Content Ingestion Summary:');
    console.log(`   Verified Content files found: ${files.length}`);
    console.log(`   Verified Content files processed: ${processedFiles}`);
    console.log(`   Verified Content files failed: ${failedFiles.length}`);
    console.log(`   Verified Content chunks generated: ${totalChunks}`);
    console.log(`   Verified Content chunks in database: ${finalCount[0].count}`);
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
    
    if (actualChunks !== expectedChunks && !DRY_RUN) {
      console.warn(`\n⚠️  Warning: Chunk count mismatch!`);
      console.warn(`   Expected: ${expectedChunks} chunks`);
      console.warn(`   Found in database: ${actualChunks} chunks`);
      console.warn(`   Difference: ${actualChunks - expectedChunks} chunks`);
    } else if (!DRY_RUN) {
      console.log('\n✅ Chunk count validation passed');
    }
    
    if (processedFiles === files.length && failedFiles.length === 0) {
      if (DRY_RUN) {
        console.log('\n🎉 Verified Content dry run completed successfully!');
        console.log('   Run without --dry-run to perform actual ingestion');
      } else {
        console.log('\n🎉 Verified Content ingestion completed successfully!');
      }
    } else {
      console.log('\n⚠️  Verified Content ingestion completed with some issues');
      if (processedFiles > 0) {
        console.log(`   ${processedFiles} files processed successfully`);
      }
      if (failedFiles.length > 0) {
        console.log(`   ${failedFiles.length} files failed to process`);
      }
    }
    
    if (!DRY_RUN) {
      console.log('\n🔍 You can now test the system with verified content queries like:');
      console.log('   - "How does the Contacts module work?"');
      console.log('   - "What features are available in Food Safety?"');
      console.log('   - "How do I navigate the Licensing module?"');
      console.log('   - "What enforcement options are available?"');
      console.log('   - "How does mobile working function?"');
      console.log('   - "What search capabilities exist in the system?"');
    } else {
      console.log('\n📋 Dry run completed. Use the following command to run the actual ingestion:');
      console.log('   node scripts/ingest-verified-content.js');
    }
    
  } catch (error) {
    console.error('❌ Verified Content ingestion failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  ingestVerifiedContent();
}

module.exports = { ingestVerifiedContent };