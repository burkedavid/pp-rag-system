#!/usr/bin/env node

/**
 * Navigation System Cleanup Utility
 * 
 * Cleans up old navigation data, temporary files, and organizes backups
 */

const fs = require('fs');
const path = require('path');

class NavigationCleanup {
  constructor() {
    this.baseDir = path.join(__dirname, '../../..');
    this.dataDir = path.join(this.baseDir, 'data');
    this.backupDir = path.join(this.dataDir, 'backup');
  }

  async cleanupTemporaryFiles() {
    console.log('🧹 Cleaning up temporary files...');
    
    const tempFiles = [
      'test-navigation-quick.js',
      'test-navigation-targeted.js', 
      'inspect-navigation-chunk.js',
      'check-db-content.js'
    ];
    
    let cleaned = 0;
    for (const file of tempFiles) {
      const filePath = path.join(this.baseDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Removed: ${file}`);
        cleaned++;
      }
    }
    
    console.log(`✅ Cleaned ${cleaned} temporary files`);
  }

  async cleanupOldBackups(keepDays = 30) {
    console.log(`🧹 Cleaning backups older than ${keepDays} days...`);
    
    if (!fs.existsSync(this.backupDir)) {
      console.log('📁 No backup directory found');
      return;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - keepDays);
    
    const entries = fs.readdirSync(this.backupDir);
    let removed = 0;
    
    for (const entry of entries) {
      const entryPath = path.join(this.backupDir, entry);
      const stats = fs.statSync(entryPath);
      
      if (stats.isDirectory() && stats.mtime < cutoffDate) {
        fs.rmSync(entryPath, { recursive: true, force: true });
        console.log(`🗑️ Removed old backup: ${entry}`);
        removed++;
      }
    }
    
    console.log(`✅ Cleaned ${removed} old backups`);
  }

  async organizeScreenshots() {
    console.log('🖼️ Organizing screenshots...');
    
    const screenshotsDir = path.join(this.dataDir, 'raw', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      console.log('📁 No screenshots directory found');
      return;
    }
    
    const files = fs.readdirSync(screenshotsDir);
    const organized = {
      modules: 0,
      login: 0,
      other: 0
    };
    
    // Create subdirectories
    ['modules', 'login', 'debug'].forEach(subdir => {
      const subdirPath = path.join(screenshotsDir, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath);
      }
    });
    
    for (const file of files) {
      if (!file.endsWith('.png') && !file.endsWith('.html')) continue;
      
      const sourcePath = path.join(screenshotsDir, file);
      let targetDir, category;
      
      if (file.startsWith('module-')) {
        targetDir = path.join(screenshotsDir, 'modules');
        category = 'modules';
      } else if (file.includes('login')) {
        targetDir = path.join(screenshotsDir, 'login');
        category = 'login';
      } else {
        targetDir = path.join(screenshotsDir, 'debug');
        category = 'other';
      }
      
      const targetPath = path.join(targetDir, file);
      if (!fs.existsSync(targetPath)) {
        fs.renameSync(sourcePath, targetPath);
        organized[category]++;
      }
    }
    
    console.log(`📊 Organized screenshots: ${organized.modules} modules, ${organized.login} login, ${organized.other} other`);
  }

  async generateInventory() {
    console.log('📋 Generating file inventory...');
    
    const inventory = {
      timestamp: new Date().toISOString(),
      directories: {},
      summary: {
        totalFiles: 0,
        totalSize: 0
      }
    };
    
    const scanDirectory = (dir, relativePath = '') => {
      if (!fs.existsSync(dir)) return { files: 0, size: 0 };
      
      const items = fs.readdirSync(dir);
      let fileCount = 0;
      let totalSize = 0;
      
      const files = [];
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        const itemPath = path.join(relativePath, item);
        
        if (stats.isDirectory()) {
          const subResult = scanDirectory(fullPath, itemPath);
          fileCount += subResult.files;
          totalSize += subResult.size;
        } else {
          files.push({
            name: item,
            size: stats.size,
            modified: stats.mtime.toISOString()
          });
          fileCount++;
          totalSize += stats.size;
        }
      }
      
      if (files.length > 0) {
        inventory.directories[relativePath || 'root'] = {
          fileCount,
          totalSize,
          files: files.slice(0, 10) // Limit to first 10 files per directory
        };
      }
      
      return { files: fileCount, size: totalSize };
    };
    
    // Scan navigation system directories
    const navigationDir = path.join(this.baseDir, 'scripts', 'navigation-system');
    scanDirectory(navigationDir, 'scripts/navigation-system');
    scanDirectory(this.dataDir, 'data');
    
    inventory.summary.totalFiles = Object.values(inventory.directories)
      .reduce((sum, dir) => sum + dir.fileCount, 0);
    inventory.summary.totalSize = Object.values(inventory.directories)
      .reduce((sum, dir) => sum + dir.totalSize, 0);
    
    // Save inventory
    const inventoryPath = path.join(this.dataDir, 'file-inventory.json');
    fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
    
    console.log(`📋 Inventory saved to: ${inventoryPath}`);
    console.log(`📊 Total files: ${inventory.summary.totalFiles}, Total size: ${(inventory.summary.totalSize / 1024 / 1024).toFixed(2)} MB`);
  }

  async runFullCleanup() {
    console.log('🧹 Starting full navigation system cleanup...\n');
    
    try {
      await this.cleanupTemporaryFiles();
      console.log();
      
      await this.cleanupOldBackups();
      console.log();
      
      await this.organizeScreenshots();
      console.log();
      
      await this.generateInventory();
      console.log();
      
      console.log('✅ Full cleanup completed successfully!');
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const cleanup = new NavigationCleanup();
  
  try {
    await cleanup.runFullCleanup();
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { NavigationCleanup };