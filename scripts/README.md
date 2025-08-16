# 📜 Scripts Directory

This directory contains all operational scripts for the Public Protection Knowledge Base system.

## 🚀 **Active Production Scripts**

### **Data Ingestion** (Titan v2 + 1024-dimensional vectors)

| Script | Purpose | Usage |
|--------|---------|-------|
| `ingest-faq-documents.js` | Process FAQ documents from `/RAG Data/FAQs/` | `node scripts/ingest-faq-documents.js` |
| `ingest-module-docs.js` | Process module documentation from `/RAG Data/Module Documentation/` | `node scripts/ingest-module-docs.js` |
| `fix-database.js` | Fix database schema and reset data | `node scripts/fix-database.js` |

### **Quality Testing & Optimization**

| Script | Purpose | Usage |
|--------|---------|-------|
| `test-rag-quality.js` | Comprehensive system quality assessment | `node scripts/test-rag-quality.js` |
| `test-high-confidence.js` | Test specific questions for high confidence | `node scripts/test-high-confidence.js` |
| `test-specific-faqs.js` | Test FAQ-based questions for optimization | `node scripts/test-specific-faqs.js` |
| `quick-test.js` | Quick system validation test | `node scripts/quick-test.js` |

### **Utilities**

| Script | Purpose | Usage |
|--------|---------|-------|
| `find-best-questions.js` | Find highest-performing example questions | `node scripts/find-best-questions.js` |
| `debug-faq-parse.js` | Debug FAQ parsing issues | `node scripts/debug-faq-parse.js` |

## 📋 **Complete System Setup Workflow**

```bash
# 1. Fix/reset database schema
node scripts/fix-database.js

# 2. Ingest FAQ documents (15 files → ~139 chunks)
node scripts/ingest-faq-documents.js

# 3. Ingest module documentation (21 files → ~799 chunks)
node scripts/ingest-module-docs.js

# 4. Test system quality
node scripts/test-rag-quality.js

# 5. Find best example questions
node scripts/find-best-questions.js
```

## 🎯 **Current System Status**

- **Vector Model**: Amazon Titan Embed Text v2 (1024 dimensions)
- **AI Model**: Claude 4.0 Sonnet
- **Total Documents**: 36 files (15 FAQs + 21 modules)
- **Total Chunks**: ~938 document chunks
- **Search Type**: Hybrid (70% semantic + 30% keyword)
- **Similarity Threshold**: 0.3 (optimized for recall)

## 📁 **Archived Scripts**

The `/archived/` directory contains old/deprecated scripts:

- `ingest-documents.js` - Old User Guide ingestion (Titan v1)
- `generate-embeddings.js` - Conflicting embedding approach
- `ingest-simple.js` - Simple ingestion (deprecated)
- `ingest-mock.js` - Mock data testing
- `migrate.js` / `migrate-simple.js` - Old migration scripts
- `test-*.js` - Root-level test files (moved from project root)

## ⚠️ **Important Notes**

1. **Always use Titan v2 scripts** - The archived scripts use the old Titan v1 model
2. **Vector dimensions must be 1024** - Database is configured for Titan v2
3. **Run database fix first** - If switching between script versions
4. **Test after changes** - Always run quality tests after data changes

## 🔧 **Environment Requirements**

```env
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

## 📊 **Expected Processing Times**

- FAQ ingestion: 2-3 minutes
- Module documentation: 8-12 minutes  
- Complete system setup: 10-15 minutes
- Quality testing: 3-5 minutes

---

*Last updated: August 2025 - Post system optimization*