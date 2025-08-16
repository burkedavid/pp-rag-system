#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: '.env.local' });

// Configuration
const FAQ_DIR = path.join(__dirname, '..', 'RAG Data', 'FAQs');
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
      modelId: 'amazon.titan-embed-text-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        inputText: text,
        dimensions: 1024,
        normalize: true
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

function extractFileNumber(filename) {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}

function determineFAQTopicArea(filename) {
  const lowerName = filename.toLowerCase();
  
  // FAQ-specific topic areas
  if (lowerName.includes('getting-started')) return 'getting_started';
  if (lowerName.includes('premises-management')) return 'premises_management';
  if (lowerName.includes('licences-guide')) return 'licensing';
  if (lowerName.includes('service-requests')) return 'service_requests';
  if (lowerName.includes('notices-guide')) return 'notices';
  if (lowerName.includes('prosecutions-guide')) return 'prosecutions';
  if (lowerName.includes('locations-guide')) return 'locations';
  if (lowerName.includes('grants-guide')) return 'grants';
  if (lowerName.includes('food-poisoning')) return 'food_poisoning';
  if (lowerName.includes('accidents-guide')) return 'accidents';
  if (lowerName.includes('dogs-guide')) return 'animal_control';
  if (lowerName.includes('contacts-guide')) return 'contacts';
  if (lowerName.includes('inspections-guide')) return 'inspections';
  if (lowerName.includes('saved-searches')) return 'searches';
  if (lowerName.includes('idox-ideas-portal')) return 'ideas_portal';
  
  return 'faq_general';
}

function determineSectionType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('question') || lowerTitle.includes('faq')) return 'faq';
  if (lowerTitle.includes('workflow') || lowerTitle.includes('process')) return 'workflow';
  if (lowerTitle.includes('quick start') || lowerTitle.includes('getting started')) return 'quick_start';
  if (lowerTitle.includes('best practice') || lowerTitle.includes('tips')) return 'best_practices';
  if (lowerTitle.includes('troubleshoot') || lowerTitle.includes('common issue')) return 'troubleshooting';
  if (lowerTitle.includes('step') || lowerTitle.includes('procedure')) return 'procedure';
  if (lowerTitle.includes('example') || lowerTitle.includes('scenario')) return 'example';
  if (lowerTitle.includes('overview') || lowerTitle.includes('introduction')) return 'overview';
  if (lowerTitle.includes('feature') || lowerTitle.includes('function')) return 'feature_description';
  
  return 'faq_content';
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
  const topicArea = determineFAQTopicArea(filename);
  
  for (const section of sections) {
    const sectionChunks = chunkSection(section, filename, MAX_TOKENS, OVERLAP_TOKENS, chunks.length);
    
    sectionChunks.forEach(chunk => {
      chunk.metadata = {
        file_number: fileNumber,
        section_type: determineSectionType(section.title),
        topic_area: topicArea,
        has_procedures: containsProcedures(section.content),
        subsection_count: countSubsections(section.content),
        document_type: 'faq'
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

async function ingestFAQDocuments() {
  try {
    console.log('🚀 Starting FAQ document ingestion...');
    
    // Check if FAQ directory exists
    if (!fs.existsSync(FAQ_DIR)) {
      console.error(`❌ FAQ directory not found: ${FAQ_DIR}`);
      process.exit(1);
    }
    
    // Remove any existing FAQ documents to avoid duplicates
    console.log('🗑️  Removing existing FAQ documents...');
    const deleteResult = await sql`
      DELETE FROM document_chunks 
      WHERE metadata->>'document_type' = 'faq'
      OR source_file LIKE '%-faq.md';
    `;
    console.log(`✅ Removed ${deleteResult.length} existing FAQ chunks`);
    
    // Get all FAQ markdown files
    const files = fs.readdirSync(FAQ_DIR)
      .filter(file => file.endsWith('-faq.md'))
      .sort();
    
    console.log(`📚 Found ${files.length} FAQ markdown files`);
    
    let totalChunks = 0;
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(FAQ_DIR, file);
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
    const finalCount = await sql`
      SELECT COUNT(*) as count 
      FROM document_chunks 
      WHERE metadata->>'document_type' = 'faq';
    `;
    
    const totalDocumentCount = await sql`SELECT COUNT(*) as count FROM document_chunks;`;
    
    console.log('\n📊 FAQ Ingestion Summary:');
    console.log(`   FAQ files processed: ${files.length}`);
    console.log(`   FAQ chunks generated: ${totalChunks}`);
    console.log(`   FAQ chunks in database: ${finalCount[0].count}`);
    console.log(`   Total chunks in database: ${totalDocumentCount[0].count}`);
    
    if (parseInt(finalCount[0].count) !== totalChunks) {
      console.warn('⚠️  Warning: Mismatch between generated and inserted FAQ chunks');
    }
    
    console.log('\n🎉 FAQ document ingestion completed successfully!');
    console.log('\n🔍 You can now test the system with FAQ queries like:');
    console.log('   - "How do I get started with the system?"');
    console.log('   - "What are the steps for premises management?"');
    console.log('   - "How do I handle licensing procedures?"');
    
  } catch (error) {
    console.error('❌ FAQ ingestion failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  ingestFAQDocuments();
}

module.exports = { ingestFAQDocuments };