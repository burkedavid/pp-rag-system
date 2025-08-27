#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: '.env.local' });

// Configuration - can be overridden via environment variables
const USER_GUIDES_DIR = process.env.USER_GUIDES_DIR || path.join(__dirname, '..', 'RAG Data', 'User Guide');
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
    return responseBody.embedding;
  } catch (error) {
    console.error(`Error generating embedding (attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateEmbedding(text, retryCount + 1);
    } else {
      throw error;
    }
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

function determineUserGuideTopicArea(filename) {
  const lowerName = filename.toLowerCase();
  
  // User Guide specific topic areas
  if (lowerName.includes('system-overview')) return 'system_overview';
  if (lowerName.includes('premises-management')) return 'premises_management';
  if (lowerName.includes('inspections-management')) return 'inspections_management';
  if (lowerName.includes('complaints-management')) return 'complaints_management';
  if (lowerName.includes('licensing-management')) return 'licensing_management';
  if (lowerName.includes('enforcement-management')) return 'enforcement_management';
  if (lowerName.includes('mobile-working')) return 'mobile_working';
  if (lowerName.includes('user-management')) return 'user_management';
  if (lowerName.includes('system-configuration')) return 'system_configuration';
  if (lowerName.includes('system-integrations')) return 'system_integrations';
  if (lowerName.includes('reports-analytics')) return 'reports_analytics';
  if (lowerName.includes('samples-management')) return 'samples_management';
  if (lowerName.includes('accidents-riddor')) return 'accidents_riddor';
  if (lowerName.includes('food-poisoning')) return 'food_poisoning_management';
  if (lowerName.includes('prosecutions-management')) return 'prosecutions_management';
  if (lowerName.includes('dogs-management')) return 'dogs_management';
  if (lowerName.includes('planning-management')) return 'planning_management';
  if (lowerName.includes('grants-management')) return 'grants_management';
  if (lowerName.includes('bookings-management')) return 'bookings_management';
  if (lowerName.includes('initiatives-management')) return 'initiatives_management';
  if (lowerName.includes('notices-management')) return 'notices_management';
  if (lowerName.includes('gis-mapping')) return 'gis_mapping';
  if (lowerName.includes('communications-admin')) return 'communications_admin';
  if (lowerName.includes('audit-trail')) return 'audit_trail';
  if (lowerName.includes('end-to-end-processes')) return 'end_to_end_processes';
  if (lowerName.includes('daily-operations')) return 'daily_operations';
  if (lowerName.includes('role-based-handbooks')) return 'role_based_handbooks';
  if (lowerName.includes('administration-guide')) return 'administration_guide';
  if (lowerName.includes('licensing-user-guide')) return 'licensing_user_guide';
  
  return 'user_guide_general';
}

function determineSectionType(title) {
  if (!title) return 'content';
  
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('overview') || lowerTitle.includes('introduction')) {
    return 'overview';
  }
  if (lowerTitle.includes('getting started') || lowerTitle.includes('quick start')) {
    return 'getting_started';
  }
  if (lowerTitle.includes('step') || lowerTitle.includes('procedure') || lowerTitle.includes('workflow')) {
    return 'procedure';
  }
  if (lowerTitle.includes('configuration') || lowerTitle.includes('settings') || lowerTitle.includes('setup')) {
    return 'configuration';
  }
  if (lowerTitle.includes('features') || lowerTitle.includes('functionality')) {
    return 'features';
  }
  if (lowerTitle.includes('troubleshooting') || lowerTitle.includes('issues') || lowerTitle.includes('problems')) {
    return 'troubleshooting';
  }
  if (lowerTitle.includes('examples') || lowerTitle.includes('samples')) {
    return 'examples';
  }
  
  return 'content';
}

function containsProcedures(content) {
  const procedureKeywords = [
    'step', 'click', 'select', 'navigate', 'enter', 'choose',
    'follow', 'complete', 'fill in', 'submit', 'save', 'open'
  ];
  
  const lowerContent = content.toLowerCase();
  return procedureKeywords.some(keyword => lowerContent.includes(keyword));
}

function countSubsections(content) {
  const headingMatches = content.match(/^#{1,6}\s+/gm);
  return headingMatches ? headingMatches.length : 0;
}

function extractComplexityLevel(content, title) {
  const wordCount = content.split(/\s+/).length;
  const hasMultipleSteps = (content.match(/\d+\./g) || []).length > 5;
  const hasTechnicalTerms = /\b(API|SQL|configuration|integration|advanced|complex)\b/i.test(content);
  
  if (hasTechnicalTerms || wordCount > 800) return 'advanced';
  if (hasMultipleSteps || wordCount > 400) return 'intermediate';
  return 'basic';
}

async function processDocument(filePath) {
  console.log(`📄 Processing: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const sections = parseMarkdownSections(content);
  
  const chunks = [];
  const fileNumber = extractFileNumber(filename);
  const topicArea = determineUserGuideTopicArea(filename);
  
  for (const section of sections) {
    const sectionChunks = chunkSection(section, filename, MAX_TOKENS, OVERLAP_TOKENS, chunks.length);
    
    sectionChunks.forEach(chunk => {
      chunk.metadata = {
        file_number: fileNumber,
        section_type: determineSectionType(section.title),
        topic_area: topicArea,
        has_procedures: containsProcedures(section.content),
        subsection_count: countSubsections(section.content),
        complexity_level: extractComplexityLevel(section.content, section.title),
        document_type: 'user_guide'
      };
    });
    
    chunks.push(...sectionChunks);
  }
  
  console.log(`   Generated ${chunks.length} chunks`);
  return chunks;
}

async function insertChunksWithEmbeddings(chunks) {
  if (DRY_RUN) {
    console.log(`🔍 DRY RUN: Would insert ${chunks.length} chunks`);
    return;
  }
  
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    
    console.log(`📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)} (${batch.length} chunks)`);
    
    // Generate embeddings for the batch
    const embeddings = await Promise.all(
      batch.map(chunk => generateEmbedding(chunk.chunk_text))
    );
    
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
    
    console.log(`✅ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} successfully`);
  }
}

async function ingestUserGuides() {
  try {
    console.log('🚀 Starting User Guide ingestion...');
    
    // Check if User Guide directory exists
    if (!fs.existsSync(USER_GUIDES_DIR)) {
      console.error(`❌ User Guide directory not found: ${USER_GUIDES_DIR}`);
      process.exit(1);
    }
    
    // Remove any existing User Guide documents to avoid duplicates
    console.log('🗑️  Removing existing User Guide documents...');
    const deleteResult = await sql`
      DELETE FROM document_chunks 
      WHERE metadata->>'document_type' = 'user_guide';
    `;
    console.log(`✅ Removed ${deleteResult.length} existing User Guide chunks`);
    
    // Get all markdown files
    const files = fs.readdirSync(USER_GUIDES_DIR)
      .filter(file => file.endsWith('.md'))
      .sort();
    
    console.log(`📚 Found ${files.length} User Guide markdown files`);
    
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
    const finalCount = await sql`
      SELECT COUNT(*) as count 
      FROM document_chunks 
      WHERE metadata->>'document_type' = 'user_guide';
    `;
    
    const totalDocumentCount = await sql`SELECT COUNT(*) as count FROM document_chunks;`;
    
    console.log('\n📊 User Guide Ingestion Summary:');
    console.log(`   User Guide files processed: ${files.length}`);
    console.log(`   User Guide chunks generated: ${totalChunks}`);
    console.log(`   User Guide chunks in database: ${finalCount[0].count}`);
    console.log(`   Total chunks in database: ${totalDocumentCount[0].count}`);
    
    if (parseInt(finalCount[0].count) !== totalChunks) {
      console.warn('⚠️  Warning: Mismatch between generated and inserted User Guide chunks');
    }
    
    console.log('\n🎉 User Guide ingestion completed successfully!');
    console.log('\n🔍 You can now test the system with User Guide queries like:');
    console.log('   - "How do I configure system administration settings?"');
    console.log('   - "What are the licensing application procedures?"');
    console.log('   - "How do I set up user management and security?"');
    
  } catch (error) {
    console.error('❌ User Guide ingestion failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  ingestUserGuides();
}

module.exports = { ingestUserGuides };