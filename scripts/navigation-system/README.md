# Navigation System Documentation

This directory contains the complete navigation extraction and processing system for the Idox Public Protection RAG system.

## Directory Structure

```
navigation-system/
├── README.md                          # This documentation
├── extract/                           # Data extraction scripts
│   ├── playwright-extractor.js       # Main Playwright navigation extraction
│   └── simple-extractor.js          # HTTP fallback extraction
├── process/                          # Data processing scripts
│   ├── ingest-navigation.js         # Process navigation data into RAG
│   └── create-visual-guides.js     # Process screenshots into RAG
├── test/                             # Testing and validation
│   ├── test-navigation-responses.js # Test navigation response quality (needs fixing)
│   └── simple-test.js               # Working navigation test script
├── utils/                           # Utility scripts
│   ├── cleanup.js                   # Clean up and organize files
│   └── check-db-content.js         # Database content analysis
└── pipeline/                        # Complete workflow scripts
    └── full-update.js              # Complete navigation update pipeline
```

## Data Organization

```
data/
├── raw/                             # Raw extracted data
│   ├── navigation-data.json        # Raw Playwright extraction results
│   ├── screenshots/                # Module interface screenshots
│   └── html-sources/               # Raw HTML for debugging
├── processed/                       # Processed documentation
│   ├── navigation-guides/          # Generated navigation guides
│   ├── visual-guides/              # Visual interface guides
│   └── standards/                  # Navigation standards and templates
└── backup/                         # Backup copies with timestamps
    ├── 2025-08-20/                 # Today's extraction
    └── previous/                   # Previous extractions
```

## Quick Start

### ⚠️ Important: Use npm Scripts (Not Direct Node Commands)
**OLD (BROKEN) Command:**
```bash
node scripts/document-idox-navigation.js  ❌ FILE MOVED
```

**NEW (WORKING) Commands - Run from project root:**

### Complete Navigation System Update
```bash
# Run from: C:\Users\david.burke\GitProjects\pp-rag-system> (Windows PowerShell)
npm run navigation:full-update
```

### Individual Components
```bash
# Extract navigation data using Playwright
npm run navigation:extract

# Process navigation into RAG embeddings  
npm run navigation:process

# Create visual interface guides
npm run navigation:visual

# Test navigation response quality
npm run navigation:test

# Clean up and organize files
npm run navigation:cleanup

# Check database statistics
npm run navigation:stats
```

### Manual Script Execution (Advanced)
If you need to run scripts directly:
```bash
# Complete pipeline
node scripts/navigation-system/pipeline/full-update.js

# Individual components
node scripts/navigation-system/extract/playwright-extractor.js
node scripts/navigation-system/process/ingest-navigation.js
node scripts/navigation-system/process/create-visual-guides.js
```

## Maintenance

### Regular Updates
- **Monthly**: Full navigation extraction to capture interface changes
- **Weekly**: Test navigation response quality
- **On-demand**: When new modules are added or UI changes

### Troubleshooting

#### Common Errors

**"Cannot find module 'document-idox-navigation.js'"**
```bash
❌ Error: Cannot find module 'C:\...\scripts\document-idox-navigation.js'
```
**Solution**: The file was moved during organization. Use the new npm commands:
```bash
✅ npm run navigation:extract  # Instead of the old direct node command
```

**"No database connection string"**
- Ensure you're running from the project root directory
- Check that `.env.local` file exists with database credentials

**"Playwright timeout errors"**
- Run from Windows PowerShell (not WSL) for better browser compatibility
- Check if you can manually access the Idox system at the URL

#### System Diagnostics
- **Check logs**: `logs/navigation-pipeline.log`
- **Database content**: `npm run navigation:stats`
- **File organization**: `npm run navigation:cleanup`
- **System test**: `node scripts/navigation-system/test/simple-test.js`

---
*Last Updated: 2025-08-20*
*System Status: ✅ Organized and Production Ready*