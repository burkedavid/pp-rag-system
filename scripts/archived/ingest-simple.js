#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

// Configuration
const USER_GUIDES_DIR = path.join(__dirname, '..', 'User Guide');
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

const BATCH_SIZE = 3;
const MAX_TOKENS = 800;

// Initialize clients
const sql = neon(DATABASE_URL);
const bedrockClient = new BedrockRuntimeClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
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
        inputText: text.substring(0, 8000), // Limit text length for embedding
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.embedding;
  } catch (error) {
    console.error('Error generating embedding for text:', text.substring(0, 100) + '...');
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
  
  return 'general';
}

async function processDocument(filePath) {
  console.log(`📄 Processing: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const sections = parseMarkdownSections(content);
  
  const chunks = [];
  const topicArea = determineTopicArea(filename);
  
  for (const section of sections.slice(0, 5)) { // Limit sections for testing
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
  return chunks.slice(0, 5); // Limit chunks for testing
}

async function insertChunksWithEmbeddings(chunks) {
  console.log(`🤖 Generating embeddings for ${chunks.length} chunks...`);
  
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(`   Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(chunks.length/BATCH_SIZE)}`);
    
    // Generate embeddings for batch
    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];
      
      try {
        const embedding = await generateEmbedding(chunk.chunk_text);
        
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
        
        console.log(`     ✅ Inserted chunk ${j+1}/${batch.length}`);
      } catch (error) {
        console.error(`     ❌ Failed to process chunk ${j+1}:`, error.message);
      }
      
      // Small delay between embeddings
      await new Promise(resolve => setTimeout(resolve, 200));
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
    
    // Get first few markdown files for testing
    const files = fs.readdirSync(USER_GUIDES_DIR)
      .filter(file => file.endsWith('.md'))
      .sort()
      .slice(0, 3); // Process only first 3 files for testing
    
    console.log(`📚 Found ${files.length} markdown files (processing subset for testing)`);
    
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
    
    console.log('\n🎉 Document ingestion completed successfully!');
    console.log('\n🔍 You can now test the system by starting the dev server:');
    console.log('   npm run dev');
    
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  }
}

ingestDocuments();