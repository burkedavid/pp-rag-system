#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

// Initialize database connection
const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);

// Initialize AWS Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

function parseMarkdownDocument(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: markdownContent } = matter(content);
  
  const filename = path.basename(filePath);
  
  // Parse markdown and extract sections
  const tokens = marked.lexer(markdownContent);
  const sections = [];
  let currentSection = null;
  
  for (const token of tokens) {
    if (token.type === 'heading') {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: token.text,
        level: token.depth,
        content: ''
      };
    } else if (currentSection) {
      // Add content to current section
      if (token.type === 'paragraph') {
        currentSection.content += token.text + '\n\n';
      } else if (token.type === 'list') {
        const listItems = token.items.map(item => `- ${item.text}`).join('\n');
        currentSection.content += listItems + '\n\n';
      } else if (token.type === 'blockquote') {
        currentSection.content += `> ${token.text}\n\n`;
      } else if (token.type === 'code') {
        currentSection.content += '```\n' + token.text + '\n```\n\n';
      }
    }
  }
  
  // Add final section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return {
    filename,
    frontmatter,
    sections: sections.filter(section => section.content.trim().length > 0)
  };
}

function chunkSection(section, sourceFile, maxTokens = 800, overlapTokens = 100, startIndex = 0) {
  const chunks = [];
  const paragraphs = section.content.split('\n\n').filter(p => p.trim());
  
  let currentChunk = '';
  let chunkIndex = startIndex;
  
  for (const paragraph of paragraphs) {
    const potentialChunk = currentChunk + (currentChunk ? '\n\n' : '') + paragraph;
    const tokenCount = Math.ceil(potentialChunk.length / 4); // Rough estimation
    
    if (tokenCount > maxTokens && currentChunk) {
      // Finalize current chunk
      chunks.push({
        source_file: sourceFile,
        section_title: section.title,
        chunk_text: currentChunk.trim(),
        chunk_index: chunkIndex++,
        token_count: Math.ceil(currentChunk.length / 4),
        embedding: [], // Will be filled later
        metadata: {}
      });
      
      // Start new chunk with overlap
      const sentences = currentChunk.split('. ');
      const overlapSentences = sentences.slice(-2); // Keep last 2 sentences for overlap
      currentChunk = overlapSentences.join('. ') + (overlapSentences.length > 0 ? '. ' : '') + paragraph;
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  // Add final chunk
  if (currentChunk.trim()) {
    chunks.push({
      source_file: sourceFile,
      section_title: section.title,
      chunk_text: currentChunk.trim(),
      chunk_index: chunkIndex,
      token_count: Math.ceil(currentChunk.length / 4),
      embedding: [],
      metadata: {}
    });
  }
  
  return chunks;
}

function determineTopicArea(filename) {
  const topicMap = {
    'premises': 'premises_management',
    'inspection': 'inspections',
    'complaint': 'complaints',
    'licensing': 'licensing',
    'enforcement': 'enforcement',
    'mobile': 'mobile_working',
    'user': 'user_management',
    'system': 'system_configuration',
    'integration': 'system_integrations',
    'report': 'reports_analytics',
    'sample': 'samples_management',
    'accident': 'accidents_riddor',
    'food': 'food_poisoning',
    'prosecution': 'prosecutions',
    'dog': 'dogs_management',
    'planning': 'planning_management',
    'grant': 'grants_management',
    'booking': 'bookings_management',
    'initiative': 'initiatives_management',
    'notice': 'notices_management',
    'gis': 'gis_mapping',
    'communication': 'communications',
    'audit': 'audit_trail',
    'process': 'regulatory_processes',
    'operation': 'daily_operations',
    'handbook': 'role_based_handbooks'
  };
  
  const lowerFilename = filename.toLowerCase();
  for (const [key, value] of Object.entries(topicMap)) {
    if (lowerFilename.includes(key)) {
      return value;
    }
  }
  return 'general';
}

async function initializeDatabase() {
  console.log('🔄 Initializing database...');
  
  // Create pgvector extension
  await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
  
  // Drop and recreate table with correct dimensions
  await sql`DROP TABLE IF EXISTS document_chunks;`;
  
  await sql`
    CREATE TABLE document_chunks (
      id SERIAL PRIMARY KEY,
      source_file VARCHAR(255) NOT NULL,
      section_title TEXT,
      chunk_text TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      token_count INTEGER NOT NULL,
      embedding VECTOR(1024), -- Updated for Titan v2
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  
  // Create indexes
  await sql`
    CREATE INDEX IF NOT EXISTS idx_document_chunks_source_file 
    ON document_chunks(source_file);
  `;
  
  await sql`
    CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
    ON document_chunks USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100);
  `;
  
  console.log('✅ Database initialized with Titan v2 schema');
}

async function processDocuments() {
  const userGuideDir = '/mnt/c/Users/david.burke/GitProjects/pp-rag-system/User Guide';
  const files = fs.readdirSync(userGuideDir).filter(file => file.endsWith('.md'));
  
  console.log(`📚 Found ${files.length} user guide files to process`);
  
  let totalChunks = 0;
  
  for (const [index, file] of files.entries()) {
    console.log(`\n🔄 Processing ${index + 1}/${files.length}: ${file}`);
    
    const filePath = path.join(userGuideDir, file);
    const document = parseMarkdownDocument(filePath);
    const topicArea = determineTopicArea(file);
    
    console.log(`   📄 Found ${document.sections.length} sections`);
    
    let fileChunks = 0;
    
    for (const section of document.sections) {
      const sectionChunks = chunkSection(section, file, 800, 100, totalChunks);
      
      for (const chunk of sectionChunks) {
        // Add metadata
        chunk.metadata = {
          topic_area: topicArea,
          section_type: 'content',
          file_number: parseInt(file.match(/^\\d+/)?.[0] || '0'),
          has_procedures: chunk.chunk_text.toLowerCase().includes('step') || 
                         chunk.chunk_text.toLowerCase().includes('procedure'),
        };
        
        console.log(`   🔄 Generating embedding for chunk ${fileChunks + 1}...`);
        
        try {
          // Generate embedding with Titan v2
          chunk.embedding = await generateEmbedding(chunk.chunk_text);
          
          // Insert into database
          await sql`
            INSERT INTO document_chunks (
              source_file, section_title, chunk_text, chunk_index,
              token_count, embedding, metadata
            ) VALUES (
              ${chunk.source_file}, ${chunk.section_title}, ${chunk.chunk_text}, 
              ${chunk.chunk_index}, ${chunk.token_count}, ${JSON.stringify(chunk.embedding)}, 
              ${JSON.stringify(chunk.metadata)}
            )
          `;
          
          fileChunks++;
          totalChunks++;
          
          // Add small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`   ❌ Failed to process chunk: ${error.message}`);
          continue;
        }
      }
    }
    
    console.log(`   ✅ Processed ${fileChunks} chunks from ${file}`);
  }
  
  console.log(`\n🎉 Completed! Processed ${totalChunks} total chunks with Titan v2 embeddings`);
  
  // Verify the results
  const result = await sql`SELECT COUNT(*) as count FROM document_chunks WHERE embedding IS NOT NULL`;
  console.log(`📊 Database contains ${result[0].count} chunks with embeddings`);
}

async function main() {
  try {
    console.log('🚀 Starting Titan v2 embedding generation...');
    console.log('🔧 Using Amazon Titan Embed Text v2 (1024 dimensions)');
    
    await initializeDatabase();
    await processDocuments();
    
    console.log('\n✅ All embeddings generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();