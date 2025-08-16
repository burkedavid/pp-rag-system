#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

// Configuration
const USER_GUIDES_DIR = path.join(__dirname, '..', 'User Guide');
const DATABASE_URL = process.env.DATABASE_URL;

const MAX_TOKENS = 800;

// Initialize clients
const sql = neon(DATABASE_URL);

// Helper functions
function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}

// Generate mock embeddings based on text content
function generateMockEmbedding(text) {
  // Create a deterministic but varied embedding based on text content
  const hash = simpleHash(text);
  const embedding = [];
  
  for (let i = 0; i < 1536; i++) {
    // Generate pseudo-random values based on text hash and position
    const value = (Math.sin(hash * (i + 1)) + Math.cos(hash * (i + 2))) / 2;
    embedding.push(value);
  }
  
  return embedding;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
}

function parseMarkdownSections(content) {
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      if (currentSection && currentSection.content.trim()) {
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
  
  if (currentSection && currentSection.content.trim()) {
    sections.push(currentSection);
  }
  
  return sections;
}

function chunkSection(section, sourceFile, maxTokens) {
  const chunks = [];
  const paragraphs = section.content.split('\n\n').filter(p => p.trim());
  
  let currentChunk = '';
  let chunkIndex = 0;
  
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
      currentChunk = paragraph;
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
  
  return 'general';
}

async function processDocument(filePath) {
  console.log(`📄 Processing: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const sections = parseMarkdownSections(content);
  
  const chunks = [];
  const topicArea = determineTopicArea(filename);
  
  for (const section of sections) {
    const sectionChunks = chunkSection(section, filename, MAX_TOKENS);
    
    sectionChunks.forEach(chunk => {
      chunk.metadata = {
        topic_area: topicArea,
        section_type: 'content'
      };
    });
    
    chunks.push(...sectionChunks);
  }
  
  console.log(`   Generated ${chunks.length} chunks`);
  return chunks;
}

async function insertChunksWithMockEmbeddings(chunks) {
  console.log(`🤖 Generating mock embeddings for ${chunks.length} chunks...`);
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    try {
      const embedding = generateMockEmbedding(chunk.chunk_text);
      
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
      
      if (i % 10 === 0) {
        console.log(`   Processed ${i + 1}/${chunks.length} chunks`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to process chunk ${i + 1}:`, error.message);
    }
  }
}

async function ingestDocuments() {
  try {
    console.log('🚀 Starting document ingestion with mock embeddings...');
    console.log('⚠️  Note: Using mock embeddings for demo. For production, configure AWS Bedrock access.');
    
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
      .sort()
      .slice(0, 10); // Process first 10 files for demo
    
    console.log(`📚 Found ${files.length} markdown files (processing subset for demo)`);
    
    let totalChunks = 0;
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(USER_GUIDES_DIR, file);
      const chunks = await processDocument(filePath);
      
      if (chunks.length > 0) {
        await insertChunksWithMockEmbeddings(chunks);
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
    
    console.log('\n🎉 Document ingestion completed successfully!');
    console.log('\n🔍 You can now start the development server:');
    console.log('   npm run dev');
    console.log('\n📝 The system will work for text search and basic RAG functionality.');
    console.log('   For production deployment, configure proper AWS Bedrock access.');
    
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  }
}

ingestDocuments();