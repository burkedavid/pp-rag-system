#!/usr/bin/env node

/**
 * Complete Navigation System Update Pipeline
 * 
 * This script runs the complete navigation extraction and processing pipeline:
 * 1. Extract navigation data using Playwright
 * 2. Process navigation data into RAG embeddings
 * 3. Process screenshots into visual guides
 * 4. Test and validate the results
 * 5. Generate reports
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class NavigationUpdatePipeline {
  constructor() {
    this.baseDir = path.join(__dirname, '../../..');
    this.logFile = path.join(this.baseDir, 'logs', 'navigation-pipeline.log');
    this.startTime = new Date();
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async runScript(scriptPath, description) {
    this.log(`🚀 Starting: ${description}`);
    
    return new Promise((resolve, reject) => {
      const child = spawn('node', [scriptPath], {
        cwd: this.baseDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        // Log progress indicators
        if (output.includes('✅') || output.includes('📊') || output.includes('🎉')) {
          this.log(`   ${output.trim()}`);
        }
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          this.log(`✅ Completed: ${description}`);
          resolve({ stdout, stderr });
        } else {
          this.log(`❌ Failed: ${description} (exit code: ${code})`);
          this.log(`   Error: ${stderr}`);
          reject(new Error(`${description} failed with exit code ${code}`));
        }
      });
    });
  }

  async runFullUpdate() {
    this.log('🌟 Starting Full Navigation System Update Pipeline');
    this.log(`📁 Base directory: ${this.baseDir}`);
    
    try {
      // Step 1: Extract navigation data
      await this.runScript(
        'scripts/navigation-system/extract/playwright-extractor.js',
        'Navigation data extraction using Playwright'
      );
      
      // Step 2: Process navigation into RAG
      await this.runScript(
        'scripts/navigation-system/process/ingest-navigation.js',
        'Processing navigation data into RAG embeddings'
      );
      
      // Step 3: Process screenshots into visual guides
      await this.runScript(
        'scripts/navigation-system/process/create-visual-guides.js',
        'Creating visual interface guides from screenshots'
      );
      
      // Step 4: Test navigation responses
      await this.runScript(
        'scripts/navigation-system/test/test-navigation-responses.js',
        'Testing navigation response quality'
      );
      
      // Step 5: Generate statistics
      await this.generateReport();
      
      const duration = ((new Date() - this.startTime) / 1000).toFixed(2);
      this.log(`🎉 Full navigation update completed successfully in ${duration}s`);
      
      return true;
      
    } catch (error) {
      const duration = ((new Date() - this.startTime) / 1000).toFixed(2);
      this.log(`❌ Pipeline failed after ${duration}s: ${error.message}`);
      throw error;
    }
  }

  async generateReport() {
    this.log('📊 Generating navigation system report...');
    
    try {
      // Run database content check
      const { stdout } = await this.runScript(
        'scripts/navigation-system/utils/check-db-content.js',
        'Database content analysis'
      );
      
      // Extract key metrics from output
      const report = this.parseSystemStats(stdout);
      
      // Save report
      const reportPath = path.join(this.baseDir, 'data', 'processed', 'navigation-system-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      this.log(`📋 Report saved to: ${reportPath}`);
      this.log(`📊 Total RAG chunks: ${report.totalChunks}`);
      this.log(`🔍 Navigation chunks: ${report.navigationChunks}`);
      this.log(`🖼️ Visual guides: ${report.visualGuides}`);
      
    } catch (error) {
      this.log(`⚠️ Report generation failed: ${error.message}`);
    }
  }

  parseSystemStats(output) {
    const stats = {
      timestamp: new Date().toISOString(),
      totalChunks: 0,
      navigationChunks: 0,
      visualGuides: 0,
      chunksByType: {}
    };
    
    // Parse the database content check output
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('verified_navigation:')) {
        const match = line.match(/verified_navigation:\s*(\d+)/);
        if (match) stats.navigationChunks = parseInt(match[1]);
      }
      if (line.includes('visual_interface_guide:')) {
        const match = line.match(/visual_interface_guide:\s*(\d+)/);
        if (match) stats.visualGuides = parseInt(match[1]);
      }
      if (line.includes('chunks')) {
        const typeMatch = line.match(/(\w+):\s*(\d+)\s*chunks/);
        if (typeMatch) {
          stats.chunksByType[typeMatch[1]] = parseInt(typeMatch[2]);
          stats.totalChunks += parseInt(typeMatch[2]);
        }
      }
    }
    
    return stats;
  }
}

// Main execution
async function main() {
  const pipeline = new NavigationUpdatePipeline();
  
  try {
    await pipeline.runFullUpdate();
    process.exit(0);
  } catch (error) {
    console.error('❌ Navigation update pipeline failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { NavigationUpdatePipeline };