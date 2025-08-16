#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: '.env.local' });

// Configuration
const MODULE_DOCS_DIR = path.join(__dirname, '..', 'RAG Data', 'Module Documentation');
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

function determineModuleTopicArea(filename) {
  const lowerName = filename.toLowerCase().replace('_module_documentation.md', '');
  
  // Module-specific topic areas
  if (lowerName.includes('accidents')) return 'accidents_module';
  if (lowerName.includes('admin')) return 'admin_module';
  if (lowerName.includes('audit')) return 'audit_module';
  if (lowerName.includes('bookings')) return 'bookings_module';
  if (lowerName.includes('complaints_admin')) return 'complaints_admin_module';
  if (lowerName.includes('complaints')) return 'complaints_module';
  if (lowerName.includes('contacts')) return 'contacts_module';
  if (lowerName.includes('dogs')) return 'dogs_module';
  if (lowerName.includes('food_poisoning')) return 'food_poisoning_module';
  if (lowerName.includes('gis')) return 'gis_module';
  if (lowerName.includes('grants')) return 'grants_module';
  if (lowerName.includes('initiatives')) return 'initiatives_module';
  if (lowerName.includes('inspections')) return 'inspections_module';
  if (lowerName.includes('licensing')) return 'licensing_module';
  if (lowerName.includes('locations')) return 'locations_module';
  if (lowerName.includes('notices')) return 'notices_module';
  if (lowerName.includes('planning')) return 'planning_module';
  if (lowerName.includes('premises')) return 'premises_module';
  if (lowerName.includes('prosecutions')) return 'prosecutions_module';
  if (lowerName.includes('samples')) return 'samples_module';
  if (lowerName.includes('service_requests')) return 'service_requests_module';
  
  return 'module_general';
}

function determineSectionType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('overview') || lowerTitle.includes('introduction')) return 'module_overview';
  if (lowerTitle.includes('workflow') || lowerTitle.includes('process')) return 'module_workflow';
  if (lowerTitle.includes('feature') || lowerTitle.includes('function')) return 'module_feature';
  if (lowerTitle.includes('configuration') || lowerTitle.includes('settings')) return 'module_config';
  if (lowerTitle.includes('report') || lowerTitle.includes('export')) return 'module_reporting';
  if (lowerTitle.includes('integration') || lowerTitle.includes('api')) return 'module_integration';
  if (lowerTitle.includes('troubleshoot') || lowerTitle.includes('common issue')) return 'module_troubleshooting';
  if (lowerTitle.includes('step') || lowerTitle.includes('procedure')) return 'module_procedure';
  if (lowerTitle.includes('example') || lowerTitle.includes('scenario')) return 'module_example';
  if (lowerTitle.includes('field') || lowerTitle.includes('form')) return 'module_fields';
  
  return 'module_content';
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
  const topicArea = determineModuleTopicArea(filename);
  
  for (const section of sections) {
    const sectionChunks = chunkSection(section, filename, MAX_TOKENS, OVERLAP_TOKENS, chunks.length);
    
    sectionChunks.forEach(chunk => {
      chunk.metadata = {
        section_type: determineSectionType(section.title),
        topic_area: topicArea,
        has_procedures: containsProcedures(section.content),
        subsection_count: countSubsections(section.content),
        document_type: 'module_documentation'
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

async function ingestModuleDocuments() {
  try {
    console.log('🚀 Starting Module Documentation ingestion...');
    
    // Check if Module Documentation directory exists
    if (!fs.existsSync(MODULE_DOCS_DIR)) {
      console.error(`❌ Module Documentation directory not found: ${MODULE_DOCS_DIR}`);
      process.exit(1);
    }
    
    // Remove any existing module documentation to avoid duplicates
    console.log('🗑️  Removing existing module documentation...');
    const deleteResult = await sql`
      DELETE FROM document_chunks 
      WHERE metadata->>'document_type' = 'module_documentation'
      OR source_file LIKE '%_Module_Documentation.md';
    `;
    console.log(`✅ Removed existing module documentation chunks`);
    
    // Get all module documentation files
    const files = fs.readdirSync(MODULE_DOCS_DIR)
      .filter(file => file.endsWith('_Module_Documentation.md'))
      .sort();
    
    console.log(`📚 Found ${files.length} module documentation files`);
    
    let totalChunks = 0;
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(MODULE_DOCS_DIR, file);
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
      WHERE metadata->>'document_type' = 'module_documentation';
    `;
    
    const totalDocumentCount = await sql`SELECT COUNT(*) as count FROM document_chunks;`;
    
    console.log('\n📊 Module Documentation Ingestion Summary:');
    console.log(`   Module files processed: ${files.length}`);
    console.log(`   Module chunks generated: ${totalChunks}`);
    console.log(`   Module chunks in database: ${finalCount[0].count}`);
    console.log(`   Total chunks in database: ${totalDocumentCount[0].count}`);
    
    if (parseInt(finalCount[0].count) !== totalChunks) {
      console.warn('⚠️  Warning: Mismatch between generated and inserted module chunks');
    }
    
    console.log('\n🎉 Module Documentation ingestion completed successfully!');
    console.log('\n🔍 You can now test the system with module-specific queries like:');
    console.log('   - "How do I use the Inspections module?"');
    console.log('   - "What features are available in the Licensing module?"');
    console.log('   - "How do I configure the Premises module?"');
    
  } catch (error) {
    console.error('❌ Module Documentation ingestion failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  ingestModuleDocuments();
}

module.exports = { ingestModuleDocuments };