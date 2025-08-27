const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config({ path: '.env.local' });

/**
 * Process the generated Idox navigation documentation and create embeddings
 */

// Initialize clients
const sql = neon(process.env.DATABASE_URL);
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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
    
    const command = new InvokeModelCommand({
      modelId: 'amazon.titan-embed-text-v2:0',
      body: JSON.stringify({
        inputText: processedText,
        dimensions: 1024,
        normalize: true
      }),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    if (!responseBody.embedding || !Array.isArray(responseBody.embedding)) {
      throw new Error('Invalid embedding response from Titan');
    }

    return responseBody.embedding;

  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`⚠️ Embedding generation failed, retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateEmbedding(text, retryCount + 1);
    }
    throw error;
  }
}

class VerifiedNavigationIngestor {
  constructor() {
    this.processedChunks = 0;
    this.errors = [];
  }

  async processNavigationData() {
    console.log('🚀 Processing verified Idox navigation documentation...');
    
    const navigationDataPath = path.join(__dirname, '../RAG Data/Generated-Navigation/navigation-data.json');
    const markdownDocPath = path.join(__dirname, '../RAG Data/Generated-Navigation/Idox-Navigation-Verified.md');
    
    if (!fs.existsSync(navigationDataPath)) {
      throw new Error('Navigation data not found. Please run the documentation script first.');
    }
    
    // Load the generated navigation data
    const navigationData = JSON.parse(fs.readFileSync(navigationDataPath, 'utf8'));
    let markdownContent = '';
    
    if (fs.existsSync(markdownDocPath)) {
      markdownContent = fs.readFileSync(markdownDocPath, 'utf8');
    }
    
    console.log(`📊 Processing navigation data generated on ${new Date(navigationData.generatedAt).toLocaleString()}`);
    console.log(`📋 Found ${navigationData.topModules.length} top modules`);
    console.log(`🔧 Found ${Object.keys(navigationData.moduleStructures).length} module structures`);
    console.log(`⚡ Found ${Object.keys(navigationData.workflowSteps).length} documented workflows`);
    
    // Clear existing verified navigation data
    await this.clearExistingData();
    
    // Process different types of navigation content
    await this.processTopModules(navigationData.topModules);
    await this.processModuleStructures(navigationData.moduleStructures);
    await this.processWorkflowSteps(navigationData.workflowSteps);
    
    // Process the markdown documentation
    if (markdownContent) {
      await this.processMarkdownDocumentation(markdownContent);
    }
    
    console.log(`✅ Processing complete!`);
    console.log(`📊 Total chunks processed: ${this.processedChunks}`);
    
    if (this.errors.length > 0) {
      console.log(`⚠️  Errors encountered: ${this.errors.length}`);
      this.errors.forEach(error => console.log(`   - ${error}`));
    }
  }

  async clearExistingData() {
    console.log('🧹 Clearing existing verified navigation data...');
    
    try {
      const result = await sql`
        DELETE FROM document_chunks 
        WHERE metadata->>'document_type' = 'verified_navigation'
      `;
      
      console.log(`🗑️  Removed ${result.rowCount} existing verified navigation chunks`);
    } catch (error) {
      console.error('Error clearing existing data:', error.message);
    }
  }

  async processTopModules(topModules) {
    console.log('📊 Processing top navigation modules...');
    
    const content = `# Top Navigation Modules

The Idox Public Protection System main navigation bar contains the following modules:

${topModules.map(module => `- **${module.text}**${module.href ? ` (${module.href})` : ''}`).join('\n')}

## Navigation Access

To access any module, click on the **${topModules.map(m => m.text).join('**, **')}** options in the top navigation bar.`;

    await this.createChunk({
      source_file: 'Idox-Navigation-Verified.md',
      section_title: 'Top Navigation Modules',
      chunk_text: content,
      metadata: {
        document_type: 'verified_navigation',
        section_type: 'top_navigation',
        module_count: topModules.length,
        verification_date: new Date().toISOString()
      }
    });
  }

  async processModuleStructures(moduleStructures) {
    console.log('🏗️  Processing module structures...');
    
    for (const [moduleName, structure] of Object.entries(moduleStructures)) {
      const content = `# ${moduleName} Module Navigation

## Access Path
Navigate to **${moduleName}** to access this module.

## Left Navigation Menu
${structure.leftMenuItems.length > 0 
  ? structure.leftMenuItems.map(item => `- **${item.text}**`).join('\n')
  : '- No left navigation menu items found'
}

## Available Actions
${structure.actionButtons.length > 0 
  ? structure.actionButtons.map(btn => `- **${btn.text}** button`).join('\n')
  : '- No action buttons documented'
}

## Navigation Format
Use the format: **${moduleName}** → **[Menu Option]** to access specific functions within this module.

${structure.leftMenuItems.length > 0 
  ? `\n## Quick Navigation Examples\n${structure.leftMenuItems.slice(0, 3).map(item => `- Navigate to **${moduleName}** → **${item.text}**`).join('\n')}`
  : ''
}`;

      await this.createChunk({
        source_file: 'Idox-Navigation-Verified.md',
        section_title: `${moduleName} Module Navigation`,
        chunk_text: content,
        metadata: {
          document_type: 'verified_navigation',
          section_type: 'module_structure',
          module_name: moduleName,
          left_menu_count: structure.leftMenuItems.length,
          action_button_count: structure.actionButtons.length,
          verification_date: new Date().toISOString()
        }
      });
    }
  }

  async processWorkflowSteps(workflowSteps) {
    console.log('⚡ Processing documented workflows...');
    
    for (const [workflowName, details] of Object.entries(workflowSteps)) {
      const content = `# How to ${workflowName}

## Navigation Path
Navigate to the appropriate module → Click **${workflowName}** button

## Form Structure
${details.formStructure && details.formStructure.length > 0
  ? details.formStructure.map(form => 
      form.labels.map(label => `- **${label}**: Form field for data entry`).join('\n')
    ).join('\n')
  : '- Form structure documentation not available'
}

## Available Actions
${details.actionButtons && details.actionButtons.length > 0
  ? details.actionButtons.map(btn => `- **${btn.text}** button`).join('\n')
  : '- Action buttons not documented'
}

## Workflow Steps
1. Navigate to the appropriate module
2. Locate and click **${workflowName}** button
3. Complete the required form fields
4. Use action buttons to save or complete the process

${details.url ? `\n## System URL\nThis workflow is accessed at: ${details.url}` : ''}`;

      await this.createChunk({
        source_file: 'Idox-Navigation-Verified.md',
        section_title: `How to ${workflowName}`,
        chunk_text: content,
        metadata: {
          document_type: 'verified_navigation',
          section_type: 'workflow_steps',
          workflow_name: workflowName,
          form_field_count: details.formStructure ? details.formStructure.reduce((acc, form) => acc + form.labels.length, 0) : 0,
          verification_date: new Date().toISOString()
        }
      });
    }
  }

  async processMarkdownDocumentation(markdownContent) {
    console.log('📝 Processing markdown documentation...');
    
    // Split markdown into sections
    const sections = markdownContent.split(/^##\s+/m).filter(section => section.trim());
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const lines = section.split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      
      if (content.length > 50) { // Only process substantial content
        await this.createChunk({
          source_file: 'Idox-Navigation-Verified.md',
          section_title: title,
          chunk_text: `## ${title}\n\n${content}`,
          metadata: {
            document_type: 'verified_navigation',
            section_type: 'markdown_section',
            section_index: i,
            verification_date: new Date().toISOString()
          }
        });
      }
    }
  }

  async createChunk(chunkData) {
    try {
      // Generate embedding for the chunk
      const embedding = await generateEmbedding(chunkData.chunk_text);
      
      // Insert into database
      await sql`
        INSERT INTO document_chunks (
          source_file, section_title, chunk_text, chunk_index,
          token_count, embedding, metadata, created_at
        ) VALUES (${chunkData.source_file}, ${chunkData.section_title}, ${chunkData.chunk_text}, ${this.processedChunks}, 
                 ${Math.ceil(chunkData.chunk_text.length / 4)}, ${JSON.stringify(embedding)}, ${JSON.stringify(chunkData.metadata)}, NOW())
      `;
      
      this.processedChunks++;
      
      if (this.processedChunks % 5 === 0) {
        console.log(`📊 Processed ${this.processedChunks} chunks...`);
      }
      
    } catch (error) {
      const errorMessage = `Failed to process chunk "${chunkData.section_title}": ${error.message}`;
      this.errors.push(errorMessage);
      console.error('❌', errorMessage);
    }
  }

  async close() {
    // Neon client doesn't require explicit connection cleanup
  }
}

// Run the ingestion
async function main() {
  const ingestor = new VerifiedNavigationIngestor();
  
  try {
    await ingestor.processNavigationData();
  } catch (error) {
    console.error('❌ Ingestion failed:', error.message);
    process.exit(1);
  } finally {
    await ingestor.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { VerifiedNavigationIngestor };