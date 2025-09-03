# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains a **RAG (Retrieval-Augmented Generation) System** for the Idox Public Protection System documentation. It's a sophisticated AI-powered knowledge base that uses Claude 4.0 Sonnet and Amazon Titan v2 embeddings to provide intelligent responses about regulatory compliance, system workflows, and operational procedures for UK Local Authority Public Protection teams.

## System Architecture

**Technology Stack:**
- **Frontend**: Next.js 15+ with TypeScript and Tailwind CSS
- **Backend**: Node.js with PostgreSQL and pgvector extension
- **AI Services**: AWS Bedrock (Claude 4.0 Sonnet + Amazon Titan v2)
- **Database**: PostgreSQL with 1024-dimensional vector similarity search
- **Deployment**: Vercel with serverless functions

## Repository Structure

```
src/
├── app/                           # Next.js App Router structure
│   ├── admin/                     # Admin dashboard for RAG management
│   ├── api/                       # API routes
│   │   ├── ask/                   # RAG query endpoint (Claude 4.0)
│   │   ├── search/                # Hybrid vector search
│   │   ├── rag/ingest/           # Document ingestion system
│   │   └── admin/                # Admin API routes
├── components/                    # React components
│   ├── admin/                     # Admin dashboard components
│   ├── rag/                       # RAG-specific components
│   └── ui/                        # UI component library
└── lib/                          # Core libraries
    ├── database.ts               # PostgreSQL + pgvector operations
    ├── claude.ts                 # Claude 4.0 integration
    ├── embeddings.ts             # Amazon Titan v2 embeddings
    └── file-storage.ts          # Vercel serverless file handling

scripts/                          # Processing scripts
├── ingest-faq-documents.js      # FAQ document processing
├── ingest-module-docs.js        # Module documentation processing
└── test-rag-quality.js         # System quality testing

User Guide/                       # Source documentation (27 files)
└── RAG Data/                    # Additional documentation sources
    ├── FAQs/                    # Frequently asked questions
    └── Module Documentation/    # Detailed module guides
```

## System Architecture

The Idox Public Protection System is a **comprehensive web-based regulatory management platform** with the following key characteristics:

### Core Service Areas
- **Environmental Health**: Food safety, health & safety, environmental protection, infectious disease, port health
- **Trading Standards**: Consumer protection, weights & measures, age-restricted sales, product safety
- **Licensing**: Alcohol, entertainment, taxi, animal, gambling, street trading licenses
- **Housing & Property**: Housing standards, HMO licensing, mobile homes, vacant properties

### Key System Modules
1. **Premises Management** - Central database for all regulated locations
2. **Inspections Management** - Risk-based inspection scheduling and execution
3. **Complaints Management** - Complete complaint lifecycle from receipt to resolution
4. **Licensing Management** - End-to-end license administration with statutory compliance
5. **Enforcement Management** - Formal enforcement powers with legal compliance
6. **Reports & Analytics** - Performance monitoring and statutory reporting

### Technical Architecture
- **Modern web application** built with Next.js 15+ and TypeScript
- **AI-powered search** using hybrid semantic + keyword search (70/30 weighting)
- **Vector database** with PostgreSQL + pgvector for similarity search
- **Serverless deployment** optimized for Vercel with edge functions
- **Professional UI** with blue-themed design and responsive layouts
- **Admin dashboard** for system configuration and analytics

## Recent RAG System Fixes

### Vercel Serverless Compatibility (January 2025)

**Issue**: RAG document ingestion was completely broken on Vercel deployment, causing infinite loops with no progress updates.

**Root Cause**: The system was using Node.js `child_process.spawn()` which doesn't work in Vercel's serverless environment.

**Solution**: Complete rewrite of the ingestion system (`src/app/api/rag/ingest/route.ts`):
- **Removed child processes**: Replaced `spawn()` calls with direct inline processing
- **Added Vercel compatibility**: Used `/tmp` directory for temporary file operations  
- **Implemented real-time tracking**: Database-based job status updates instead of in-memory state
- **Fixed file storage**: Corrected file lookup logic for in-memory storage keys

### TypeScript Type Safety Improvements

**Issues Fixed**:
1. **Property access errors**: `file.path` vs `file.id` type mismatches
2. **Duplicate function definitions**: Multiple `generateEmbedding` implementations
3. **Interface conflicts**: `StoredFile` vs `UploadedFileInfo` type confusion

**Solutions**:
- **Added proper interfaces**: `UploadedFileInfo` type matching frontend file structure
- **Fixed property access**: Used correct `file.path` property for storage key lookup
- **Removed duplicates**: Cleaned up redundant function implementations
- **Type consistency**: Ensured all file operations use matching interfaces

### UI/UX Enhancements

**Improvements Made**:
- **Professional loading messages**: Replaced robot emoji (🤖) with professional icons (💡)
- **Improved layout**: Moved ingestion status display closer to "Ingestion Options" for better UX
- **Better error handling**: Clear error messages and proper status updates
- **Real-time feedback**: Live progress monitoring during document processing

### Code Quality & Reliability

**Technical Fixes**:
```typescript
// Before: Broken child process approach
const nodeProcess = spawn('node', [scriptFullPath]);

// After: Vercel-compatible direct processing  
await processFilesDirectly(jobId, job, files, options);
```

**File Storage Fix**:
```typescript
// Before: Incorrect property access
const storedFile = uploadedFilesStore.get(file.id);

// After: Correct storage key usage
const storedFile = uploadedFilesStore.get(file.path);
```

**Type Safety**:
```typescript
// Added proper interface for frontend file objects
interface UploadedFileInfo {
  originalName: string;
  fileName: string; 
  size: number;
  type: string;
  path: string; // Storage key
}
```

## Documentation Standards

### Content Organization
- Each guide focuses on a specific functional area of the system
- Guides follow consistent structure: Overview → Quick Start → Workflows → Best Practices
- Step-by-step procedures with clear action items and checklists
- Real-world scenarios demonstrating module integration

### Writing Conventions
- User-focused language explaining "what this does for you" and "why it matters"
- Numbered steps and bulleted lists for procedures
- **Bold text** for important concepts and UI elements
- Consistent terminology across all documents
- Practical examples and common use cases

### File Management
- All documentation files use `.md` extension
- Files numbered sequentially (00-29) for logical reading order
- Descriptive filenames indicating content focus
- No technical configuration files (this is documentation-only repository)

## Common Development Tasks

### RAG System Development
- **API endpoint development**: Creating new routes for search, ingestion, and admin functions
- **Frontend component development**: Building React components for the admin dashboard and search interface
- **Database schema updates**: Modifying PostgreSQL tables and adding new indexes
- **AI integration improvements**: Enhancing Claude 4.0 prompts and embedding generation
- **Performance optimization**: Improving vector search speed and response times

### Document Processing & Ingestion
- **Adding new document types**: Creating specialized ingestion scripts
- **Improving chunking algorithms**: Optimizing text segmentation for better retrieval
- **Metadata enhancement**: Adding richer document classification and tagging
- **Quality testing**: Running comprehensive tests on search accuracy and response quality

### System Administration
- **Vercel deployment management**: Handling serverless function limitations and optimizations
- **Database maintenance**: Managing embeddings, cleaning up old data, optimizing indexes
- **Admin dashboard features**: Adding new analytics, configuration options, and monitoring tools
- **Error handling & logging**: Improving system reliability and debugging capabilities

### Content & Documentation Updates
- **User guide maintenance**: Updating source documentation in `/User Guide/` directory
- **FAQ management**: Adding new questions and improving existing answers
- **System documentation**: Keeping README.md and technical documentation current
- **Example queries**: Maintaining high-quality example questions for testing

## Important Notes

### Development Environment
- **TypeScript/Next.js application** with comprehensive build and testing processes
- **Serverless deployment** optimized for Vercel with specific constraints
- **Database integration** requires PostgreSQL with pgvector extension
- **AI services** require AWS Bedrock access with Claude 4.0 and Titan v2 models
- **Environment variables** must be configured for database and AWS credentials

### Key System Constraints
- **Vercel serverless limitations**: No child processes, limited execution time, `/tmp` directory usage
- **File storage**: In-memory storage for uploads due to serverless constraints
- **Vector dimensions**: Must use 1024-dimensional embeddings (Amazon Titan v2)
- **Database compatibility**: Requires pgvector extension for similarity search

### Production Considerations
- **Anti-hallucination requirements**: Strict similarity thresholds prevent incorrect regulatory guidance
- **Performance optimization**: Vector indexing and hybrid search for sub-second responses
- **Regulatory compliance**: Professional UI and accurate information for government users
- **Error handling**: Graceful degradation when insufficient information is available

### Common Commands
```bash
# Development
npm run dev           # Start development server
npm run build         # Production build with type checking
npm run typecheck     # TypeScript validation

# RAG System
node scripts/ingest-faq-documents.js      # Process FAQ documents
node scripts/ingest-module-docs.js        # Process module documentation
node scripts/test-rag-quality.js          # Test system accuracy
```