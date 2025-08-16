#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: '.env.local' });

// Configuration
const USER_GUIDES_DIR = path.join(__dirname, '..', 'User Guide');
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

// Helper functions
function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}

async function generateEmbedding(text) {
  try {
    const input = {
      modelId: 'amazon.titan-embed-text-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        inputText: text,
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

function parseMarkdownSections(content) {
  const sections = [];
  const lines = content.split('\n');
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

function extractFileNumber(filename) {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}

function determineTopicArea(filename) {
  const lowerName = filename.toLowerCase();
  
  if (lowerName.includes('premises')) return 'premises_management';
  if (lowerName.includes('inspection')) return 'inspections';
  if (lowerName.includes('complaint')) return 'complaints';
  if (lowerName.includes('licensing')) return 'licensing';
  if (lowerName.includes('enforcement')) return 'enforcement';
  if (lowerName.includes('mobile')) return 'mobile_working';
  if (lowerName.includes('user') || lowerName.includes('security')) return 'user_management';
  if (lowerName.includes('configuration')) return 'system_config';
  if (lowerName.includes('integration')) return 'integrations';
  if (lowerName.includes('report') || lowerName.includes('analytics')) return 'reporting';
  if (lowerName.includes('sample')) return 'samples';
  if (lowerName.includes('accident') || lowerName.includes('riddor')) return 'accidents';
  if (lowerName.includes('food') && lowerName.includes('poisoning')) return 'food_poisoning';
  if (lowerName.includes('prosecution')) return 'prosecutions';
  if (lowerName.includes('dogs')) return 'animal_control';
  if (lowerName.includes('planning')) return 'planning';
  if (lowerName.includes('grant')) return 'grants';
  if (lowerName.includes('booking')) return 'bookings';
  if (lowerName.includes('initiative')) return 'initiatives';
  if (lowerName.includes('notice')) return 'notices';
  if (lowerName.includes('gis') || lowerName.includes('mapping')) return 'mapping';
  if (lowerName.includes('communication')) return 'communications';
  if (lowerName.includes('audit')) return 'audit';
  if (lowerName.includes('end-to-end') || lowerName.includes('processes')) return 'workflows';
  if (lowerName.includes('daily') || lowerName.includes('operations')) return 'operations';
  if (lowerName.includes('role') || lowerName.includes('handbook')) return 'role_guides';
  
  return 'general';
}

function determineSectionType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('workflow') || lowerTitle.includes('process')) return 'workflow';
  if (lowerTitle.includes('quick start') || lowerTitle.includes('getting started')) return 'quick_start';
  if (lowerTitle.includes('best practice') || lowerTitle.includes('tips')) return 'best_practices';
  if (lowerTitle.includes('troubleshoot') || lowerTitle.includes('common issue')) return 'troubleshooting';
  if (lowerTitle.includes('step') || lowerTitle.includes('procedure')) return 'procedure';
  if (lowerTitle.includes('example') || lowerTitle.includes('scenario')) return 'example';
  if (lowerTitle.includes('overview') || lowerTitle.includes('introduction')) return 'overview';
  if (lowerTitle.includes('feature') || lowerTitle.includes('function')) return 'feature_description';
  
  return 'content';
}

function containsProcedures(content) {
  const procedureIndicators = [
    'step 1', 'step 2', 'first', 'then', 'next', 'finally',
    '1.', '2.', '3.', 'click', 'navigate', 'select', 'enter'
  ];
  
  const lowerContent = content.toLowerCase();
  return procedureIndicators.some(indicator => lowerContent.includes(indicator));
}

function countSubsections(content) {
  return (content.match(/^###+ /gm) || []).length;
}

async function processDocument(filePath) {
  console.log(`📄 Processing: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const sections = parseMarkdownSections(content);
  
  const chunks = [];
  const fileNumber = extractFileNumber(filename);
  const topicArea = determineTopicArea(filename);
  
  for (const section of sections) {
    const sectionChunks = chunkSection(section, filename, MAX_TOKENS, OVERLAP_TOKENS, chunks.length);
    
    sectionChunks.forEach(chunk => {
      chunk.metadata = {
        file_number: fileNumber,
        section_type: determineSectionType(section.title),
        topic_area: topicArea,
        has_procedures: containsProcedures(section.content),
        subsection_count: countSubsections(section.content)
      };
    });
    
    chunks.push(...sectionChunks);
  }
  
  console.log(`   Generated ${chunks.length} chunks`);
  return chunks;
}

async function insertChunksWithEmbeddings(chunks) {
  console.log(`🤖 Generating embeddings for ${chunks.length} chunks...`);
  
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(`   Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(chunks.length/BATCH_SIZE)}`);
    
    // Generate embeddings for batch
    const embeddingPromises = batch.map(chunk => generateEmbedding(chunk.chunk_text));
    const embeddings = await Promise.all(embeddingPromises);
    
    // Insert chunks with embeddings
    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];
      const embedding = embeddings[j];
      
      await sql`
        INSERT INTO document_chunks (
          source_file, section_title, chunk_text, chunk_index, 
          token_count, embedding, metadata
        ) VALUES (
          ${chunk.source_file}, ${chunk.section_title}, ${chunk.chunk_text}, 
          ${chunk.chunk_index}, ${chunk.token_count}, ${JSON.stringify(embedding)}, 
          ${JSON.stringify(chunk.metadata)}
        );
      `;
    }
    
    // Small delay between batches to avoid rate limits
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

async function ingestDocuments() {
  try {
    console.log('🚀 Starting document ingestion...');
    
    // Check if User Guide directory exists
    if (!fs.existsSync(USER_GUIDES_DIR)) {
      console.error(`❌ User Guide directory not found: ${USER_GUIDES_DIR}`);
      process.exit(1);
    }
    
    // Clear existing chunks
    console.log('🗑️  Clearing existing document chunks...');
    await sql`DELETE FROM document_chunks;`;
    console.log('✅ Existing chunks cleared');
    
    // Get all markdown files
    const files = fs.readdirSync(USER_GUIDES_DIR)
      .filter(file => file.endsWith('.md'))
      .sort();
    
    console.log(`📚 Found ${files.length} markdown files`);
    
    let totalChunks = 0;
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(USER_GUIDES_DIR, file);
      const chunks = await processDocument(filePath);
      
      if (chunks.length > 0) {
        await insertChunksWithEmbeddings(chunks);
        totalChunks += chunks.length;
        console.log(`✅ Processed ${file}: ${chunks.length} chunks`);
      } else {
        console.log(`⚠️  No chunks generated for ${file}`);
      }
    }
    
    // Final verification
    const finalCount = await sql`SELECT COUNT(*) as count FROM document_chunks;`;
    
    console.log('\n📊 Ingestion Summary:');
    console.log(`   Files processed: ${files.length}`);
    console.log(`   Total chunks generated: ${totalChunks}`);
    console.log(`   Chunks in database: ${finalCount[0].count}`);
    
    if (parseInt(finalCount[0].count) !== totalChunks) {
      console.warn('⚠️  Warning: Mismatch between generated and inserted chunks');
    }
    
    console.log('\n🎉 Document ingestion completed successfully!');
    console.log('\n🔍 You can now test the system with queries like:');
    console.log('   - "How do I process a food business registration?"');
    console.log('   - "What are the steps for a routine inspection?"');
    console.log('   - "How do I handle a noise complaint?"');
    
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  ingestDocuments();
}

module.exports = { ingestDocuments };