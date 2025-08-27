#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: '.env.local' });

// Configuration
const BATCH_SIZE = 5;
const MAX_TOKENS = 800;
const OVERLAP_TOKENS = 100;

// Initialize clients
const sql = neon(process.env.DATABASE_URL);
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper functions (copied from main script)
function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}

async function generateEmbedding(text, retryCount = 0) {
  const maxRetries = 3;
  const baseDelay = 1000;
  
  try {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Invalid text input for embedding generation');
    }
    
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
    
    if (!responseBody.embedding || !Array.isArray(responseBody.embedding)) {
      throw new Error('Invalid embedding response from Bedrock');
    }
    
    return responseBody.embedding;
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
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

function determineOnlineBATopicArea(filename) {
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
  
  return 'online_ba_general';
}

function determineSectionType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('overview') || lowerTitle.includes('introduction')) return 'online_ba_overview';
  if (lowerTitle.includes('step-by-step') || lowerTitle.includes('process')) return 'online_ba_process';
  if (lowerTitle.includes('matching') || lowerTitle.includes('algorithm')) return 'online_ba_matching';
  if (lowerTitle.includes('configuration') || lowerTitle.includes('settings')) return 'online_ba_configuration';
  if (lowerTitle.includes('fields') || lowerTitle.includes('data')) return 'online_ba_fields';
  if (lowerTitle.includes('what') || lowerTitle.includes('how does')) return 'online_ba_explanation';
  if (lowerTitle.includes('when') || lowerTitle.includes('triggers')) return 'online_ba_conditions';
  if (lowerTitle.includes('officer') || lowerTitle.includes('manual')) return 'online_ba_manual_process';
  if (lowerTitle.includes('benefits') || lowerTitle.includes('advantages')) return 'online_ba_benefits';
  if (lowerTitle.includes('troubleshooting') || lowerTitle.includes('issues')) return 'online_ba_troubleshooting';
  if (lowerTitle.includes('fees') || lowerTitle.includes('payment')) return 'online_ba_fees';
  if (lowerTitle.includes('due') || lowerTitle.includes('timeline')) return 'online_ba_timeline';
  
  return 'online_ba_content';
}

function containsProcedures(content) {
  const procedureIndicators = [
    'step 1', 'step 2', 'step 3', 'first', 'then', 'next', 'finally',
    '1.', '2.', '3.', 'click', 'navigate', 'select', 'enter',
    'complete', 'configure', 'review', 'save', 'submit', 'process'
  ];
  
  const lowerContent = content.toLowerCase();
  return procedureIndicators.some(indicator => lowerContent.includes(indicator));
}

function countSubsections(content) {
  return (content.match(/^###+ /gm) || []).length;
}

function extractComplexityLevel(content, title) {
  const complexityIndicators = {
    basic: ['basic', 'simple', 'overview', 'introduction'],
    intermediate: ['matching', 'process', 'configuration', 'officer'],
    advanced: ['algorithm', 'sophisticated', 'complex', 'hierarchical'],
    expert: ['source code', 'analysis', 'technical', 'implementation']
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
  const topicArea = determineOnlineBATopicArea(filename);
  
  for (const section of sections) {
    const sectionChunks = chunkSection(section, filename, MAX_TOKENS, OVERLAP_TOKENS, chunks.length);
    
    sectionChunks.forEach(chunk => {
      chunk.metadata = {
        section_type: determineSectionType(section.title),
        topic_area: topicArea,
        has_procedures: containsProcedures(section.content),
        subsection_count: countSubsections(section.content),
        complexity_level: extractComplexityLevel(section.content, section.title),
        document_type: 'online-ba-questions'
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
      const embeddings = [];
      for (let k = 0; k < batch.length; k++) {
        try {
          const embedding = await generateEmbedding(batch[k].chunk_text);
          embeddings.push(embedding);
        } catch (error) {
          console.error(`   ❌ Failed to generate embedding for chunk ${batch[k].chunk_index}: ${error.message}`);
          failedChunks.push({ chunk: batch[k], error: error.message, stage: 'embedding' });
          embeddings.push(null);
        }
      }
      
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        const embedding = embeddings[j];
        
        if (embedding === null) {
          console.log(`   ⏭️  Skipping chunk ${chunk.chunk_index} due to embedding failure`);
          continue;
        }
        
        try {
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
      
      console.log(`   ✅ Batch ${batchNum} completed (${totalInserted} total inserted)`);
      
    } catch (error) {
      console.error(`   ❌ Batch ${batchNum} failed completely:`, error.message);
      batch.forEach(chunk => {
        failedChunks.push({ chunk, error: error.message, stage: 'batch' });
      });
    }
    
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  
  console.log(`\n📊 Embedding and Insertion Summary:`);
  console.log(`   Total chunks processed: ${chunks.length}`);
  console.log(`   Successfully inserted: ${totalInserted}`);
  console.log(`   Failed chunks: ${failedChunks.length}`);
  
  return { totalInserted, failedChunks };
}

async function ingestSingleFile() {
  try {
    const filePath = process.argv[2];
    
    if (!filePath) {
      console.error('❌ Usage: node ingest-single-online-ba-question.js <file-path>');
      console.error('   Example: node ingest-single-online-ba-question.js "/path/to/file-faq.md"');
      process.exit(1);
    }
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }
    
    const filename = path.basename(filePath);
    
    console.log(`🚀 Starting single file ingestion for: ${filename}`);
    
    // Remove existing chunks for this specific file only
    console.log(`🗑️  Removing existing chunks for ${filename}...`);
    const deleteResult = await sql`
      DELETE FROM document_chunks 
      WHERE source_file = ${filename};
    `;
    console.log(`✅ Removed ${deleteResult.length} existing chunks for this file`);
    
    // Process the single file
    const chunks = await processDocument(filePath);
    
    if (chunks.length > 0) {
      await insertChunksWithEmbeddings(chunks);
      console.log(`✅ Successfully processed ${filename}: ${chunks.length} chunks`);
    } else {
      console.log(`⚠️  No chunks generated for ${filename}`);
    }
    
    // Final verification
    const finalCount = await sql`
      SELECT COUNT(*) as count 
      FROM document_chunks 
      WHERE source_file = ${filename};
    `;
    
    const totalDocumentCount = await sql`SELECT COUNT(*) as count FROM document_chunks;`;
    
    console.log('\n📊 Single File Ingestion Summary:');
    console.log(`   File processed: ${filename}`);
    console.log(`   Chunks generated: ${chunks.length}`);
    console.log(`   Chunks in database for this file: ${finalCount[0].count}`);
    console.log(`   Total chunks in database: ${totalDocumentCount[0].count}`);
    
    console.log('\n🎉 Single file ingestion completed successfully!');
    console.log('\n🔍 You can now test queries related to this content.');
    
  } catch (error) {
    console.error('❌ Single file ingestion failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  ingestSingleFile();
}

module.exports = { ingestSingleFile };