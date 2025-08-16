# 🏛️ Idox Public Protection Knowledge Base

A sophisticated AI-powered RAG (Retrieval-Augmented Generation) system for the Idox Public Protection System documentation. Features a modern blue-themed interface, Claude 4.0 Sonnet intelligence, and Amazon Titan v2 embeddings for semantic search across regulatory documentation.

## ✨ Features

- **🧠 Advanced AI Integration**: Claude 4.0 Sonnet for intelligent, contextual responses
- **🔍 Hybrid Search**: 70% semantic + 30% keyword search for optimal results
- **🎨 Modern Professional UI**: Sophisticated blue-themed interface with professional loading animations
- **📱 Responsive Design**: Mobile-optimized with smooth animations and professional styling
- **🎯 Optimized Search Performance**: Tuned similarity thresholds and confidence scoring
- **📊 Smart Analytics**: AI usage tracking with enhanced confidence scoring and tooltips
- **💾 Comprehensive Coverage**: 969 document chunks across 27 user guide modules
- **⚡ Real-time Search**: Instant suggestions, search history, and professional loading states
- **🏠 Enhanced Navigation**: Easy-to-use Home button for seamless user experience
- **💡 Intelligent Tooltips**: Detailed confidence explanations for user transparency

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: Next.js 15+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Node.js with PostgreSQL and pgvector extension
- **AI Services**: AWS Bedrock Claude 4.0 Sonnet (`us.anthropic.claude-sonnet-4-20250514-v1:0`)
- **Embeddings**: Amazon Titan Embed Text v2 (`amazon.titan-embed-text-v2:0`)
- **Database**: PostgreSQL with vector similarity search (1024-dimensional vectors)
- **UI Components**: Radix UI with custom blue theme
- **Icons**: Lucide React for consistent iconography

### System Components

1. **📚 Document Processing Pipeline**
   - Processes 27 comprehensive user guide files
   - Intelligent chunking with context preservation (800 tokens with 100-token overlap)
   - Generates 1024-dimensional embeddings using Amazon Titan v2
   - Stores in PostgreSQL with rich metadata and topic classification

2. **🔍 Advanced Search & Retrieval**
   - Hybrid search combining semantic (70%) and keyword (30%) search
   - Optimized similarity threshold (0.3) for improved recall
   - IVFFlat indexing for sub-second response times
   - Context-aware result ranking with enhanced similarity scoring

3. **🤖 AI Response Generation**
   - Claude 4.0 Sonnet for natural language responses
   - Enhanced confidence scoring algorithm for better accuracy
   - Source citation with detailed similarity scores
   - Regulatory compliance context maintained
   - Professional government-appropriate language

4. **🎨 Modern Frontend Interface**
   - Sophisticated blue gradient header design with Home navigation
   - Professional loading animations with progress indicators
   - Card-based layout with shadows and animations
   - Real-time search with intelligent suggestions
   - Tabbed results (AI Answer vs. Detailed Sources)
   - Search history with confidence indicators and tooltips
   - Enhanced user experience with visual feedback

## 📊 Database Schema

```sql
-- Enhanced schema with Titan v2 1024-dimensional vectors
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
    id SERIAL PRIMARY KEY,
    source_file VARCHAR(255) NOT NULL,
    section_title TEXT,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    token_count INTEGER NOT NULL,
    embedding VECTOR(1024), -- Amazon Titan v2 dimensions
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_document_chunks_source_file 
ON document_chunks(source_file);

CREATE INDEX idx_document_chunks_embedding 
ON document_chunks USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- AI usage tracking
CREATE TABLE ai_usage_logs (
    id SERIAL PRIMARY KEY,
    prompt_type VARCHAR(255) NOT NULL,
    prompt_name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    duration DECIMAL,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database with pgvector extension
- AWS account with Bedrock access (Claude 4.0 and Titan v2 models)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/burkedavid/pp-rag-system.git
   cd pp-rag-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env.local`:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://user:pass@host:5432/dbname

   # AWS Bedrock Configuration (Required for AI features)
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=us-east-1

   # Claude Model Configuration (using inference profile)
   CLAUDE_MODEL_ID=us.anthropic.claude-sonnet-4-20250514-v1:0

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize the database**
   The database will be automatically initialized when you run the embedding generation script.

5. **Generate embeddings for all documentation**
   ```bash
   node scripts/generate-embeddings.js
   ```
   
   **⏱️ Processing Time**: This will process all 27 user guide files and generate 969 document chunks with Titan v2 embeddings. Expect 15-20 minutes for complete processing.

   **📊 What happens during embedding generation:**
   - Parses all 27 markdown user guide files
   - Creates intelligent document chunks (800 tokens with overlap)
   - Generates 1024-dimensional embeddings using Amazon Titan v2
   - Stores chunks with metadata in PostgreSQL
   - Creates vector indexes for fast similarity search

6. **Start the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to access the modern knowledge base interface.

## 📖 Usage Guide

### Example Queries

The system expertly handles questions about all aspects of public protection:

**🍽️ Environmental Health:**
- "What are the steps for a routine food safety inspection?"
- "How do I process a new food business registration?"
- "What is the process for investigating food poisoning incidents?"

**🛡️ Trading Standards:**
- "How do I handle consumer complaints about product safety?"
- "What are the procedures for weights and measures inspections?"

**🍺 Licensing:**
- "What documents are needed for an alcohol license application?"
- "How do I process temporary event notices?"

**🏠 Housing:**
- "What are the HMO licensing requirements?"
- "How do I conduct housing standards inspections?"

**⚖️ Enforcement:**
- "How do I issue an improvement notice?"
- "What is the prosecution process for regulatory offenses?"

### API Endpoints

- `POST /api/ask` - RAG query with Claude 4.0 AI-generated response
- `POST /api/search` - Pure vector similarity search with sources
- `GET /api/suggestions` - Intelligent query suggestions
- `GET /api/documents` - List available source documents

### Response Format

```json
{
  "answer": "Detailed AI-generated response using Claude 4.0...",
  "sources": [
    {
      "source_file": "02-Inspections-Management-User-Guide.md",
      "section_title": "Routine Food Safety Inspection Workflow",
      "similarity": 0.8745
    }
  ],
  "confidence": "high",
  "note": "AI-powered response using Claude 4.0 with Amazon Titan semantic search"
}
```

## 🚀 Documentation Management & Embedding Generation

The system supports multiple types of documentation with specialized processing pipelines for optimal search results.

### 📁 Documentation Structure

```
/RAG Data/
├── FAQs/                           # Frequently Asked Questions
│   ├── 01-getting-started-faq.md
│   ├── 02-premises-management-faq.md
│   ├── 03-licences-guide-faq.md
│   └── ... (15 FAQ files total)
│
└── Module Documentation/           # Detailed module guides
    ├── Accidents_Module_Documentation.md
    ├── Admin_Module_Documentation.md
    ├── Complaints_Module_Documentation.md
    └── ... (21 module files total)
```

### 🔄 Adding New Documentation

#### 1. FAQ Documents

**File Location**: `/RAG Data/FAQs/`
**Naming Convention**: `##-topic-name-faq.md` (e.g., `16-new-feature-faq.md`)

```bash
# Add new FAQ files to the FAQs directory
cp new-feature-faq.md "/RAG Data/FAQs/16-new-feature-faq.md"

# Process FAQ documents
node scripts/ingest-faq-documents.js
```

**FAQ Processing Features:**
- ✅ **Specialized FAQ parsing** with question-answer structure preservation
- ✅ **Topic area classification** (premises_management, licensing, inspections, etc.)
- ✅ **Procedure detection** for step-by-step guides
- ✅ **File numbering** for organized priority and sequencing
- ✅ **Windows line ending handling** for cross-platform compatibility

#### 2. Module Documentation

**File Location**: `/RAG Data/Module Documentation/`
**Naming Convention**: `ModuleName_Module_Documentation.md`

```bash
# Add new module documentation
cp new-module-guide.md "/RAG Data/Module Documentation/NewModule_Module_Documentation.md"

# Process module documentation
node scripts/ingest-module-docs.js
```

**Module Documentation Processing Features:**
- ✅ **Module-specific categorization** (admin_module, complaints_module, etc.)
- ✅ **Section type classification** (overview, workflow, feature, config, reporting)
- ✅ **Comprehensive metadata** including subsection counts and procedure detection
- ✅ **Integration-focused parsing** for complex system workflows

#### 3. Legacy User Guide Documents (Deprecated)

**Note**: The original `/User Guide` directory processing is deprecated in favor of the specialized FAQ and Module Documentation processing above.

### 🛠️ Embedding Generation Scripts

#### Complete System Setup

```bash
# Fix database schema (if needed)
node scripts/fix-database.js

# Process all FAQ documents (15 files → ~139 chunks)
node scripts/ingest-faq-documents.js

# Process all module documentation (21 files → ~799 chunks)
node scripts/ingest-module-docs.js
```

#### Individual Processing

```bash
# Process only FAQ documents
node scripts/ingest-faq-documents.js

# Process only module documentation  
node scripts/ingest-module-docs.js

# Test system quality
node scripts/test-rag-quality.js
```

### 📊 Processing Statistics

| Document Type | Files | Chunks Generated | Processing Time |
|---------------|-------|------------------|-----------------|
| **FAQ Documents** | 15 | ~139 chunks | 2-3 minutes |
| **Module Documentation** | 21 | ~799 chunks | 8-12 minutes |
| **Total System** | 36 | ~938 chunks | 10-15 minutes |

### 🔧 Advanced Processing Configuration

#### Chunk Settings (Configurable in scripts)

```javascript
const BATCH_SIZE = 5;          // Embedding batch size
const MAX_TOKENS = 800;        // Maximum tokens per chunk
const OVERLAP_TOKENS = 100;    // Overlap between chunks
```

#### Topic Area Classification

**FAQ Topics:**
- `getting_started`, `premises_management`, `licensing`, `service_requests`
- `notices`, `prosecutions`, `locations`, `grants`, `food_poisoning`
- `accidents`, `animal_control`, `contacts`, `inspections`, `searches`

**Module Topics:**
- `accidents_module`, `admin_module`, `audit_module`, `bookings_module`
- `complaints_module`, `contacts_module`, `dogs_module`, `food_poisoning_module`
- `gis_module`, `grants_module`, `initiatives_module`, `inspections_module`
- `licensing_module`, `locations_module`, `notices_module`, `premises_module`
- `prosecutions_module`, `samples_module`, `service_requests_module`

#### Section Type Classification

**FAQ Sections:** `faq`, `workflow`, `quick_start`, `best_practices`, `troubleshooting`, `procedure`

**Module Sections:** `module_overview`, `module_workflow`, `module_feature`, `module_config`, `module_reporting`, `module_integration`

### 🧹 Database Management

#### Clear Specific Document Types

```bash
# Clear only FAQ documents
psql $DATABASE_URL -c "DELETE FROM document_chunks WHERE metadata->>'document_type' = 'faq';"

# Clear only module documentation
psql $DATABASE_URL -c "DELETE FROM document_chunks WHERE metadata->>'document_type' = 'module_documentation';"

# Clear all documents
node scripts/fix-database.js
```

#### Verify Processing

```sql
-- Check document counts by type
SELECT 
    metadata->>'document_type' as doc_type,
    COUNT(*) as chunk_count
FROM document_chunks 
GROUP BY metadata->>'document_type';

-- Check topic area distribution
SELECT 
    metadata->>'topic_area' as topic,
    COUNT(*) as chunks
FROM document_chunks 
GROUP BY metadata->>'topic_area'
ORDER BY chunks DESC;
```

### ⚡ Performance Optimizations

#### Hybrid Search Implementation

The system now uses **hybrid search** combining:
- **Semantic search** (70% weight) - Amazon Titan v2 embeddings
- **Keyword search** (30% weight) - PostgreSQL full-text search

#### Vector Configuration

```sql
-- Optimized for 1024-dimensional Titan v2 vectors
embedding VECTOR(1024)

-- Similarity threshold lowered for better recall
WHERE 1 - (embedding <=> query_vector) > 0.3
```

#### Confidence Scoring

**Improved confidence calculation:**
```javascript
// More lenient scoring for better user experience
if (avgSimilarity > 0.5 && resultCount >= 3) confidence = 'high';
else if (avgSimilarity > 0.3 && resultCount >= 2) confidence = 'medium';
else if (avgSimilarity > 0.2 || resultCount >= 1) confidence = 'medium';
```

### 🎯 Quality Assurance

#### Testing Framework

```bash
# Run comprehensive quality assessment
node scripts/test-rag-quality.js

# Test specific questions for quality
node scripts/quick-test.js

# Find best-performing questions
node scripts/find-best-questions.js
```

#### Quality Metrics

- **Answer relevance** - Checks for topic coverage
- **Confidence levels** - Monitors AI certainty
- **Source count** - Ensures comprehensive context
- **Response length** - Validates detailed answers
- **Software specificity** - Confirms practical guidance

## 🎨 Modern Interface Features

### Professional Blue Theme
- **Primary Blue**: #1e40af (deep blue for headers)
- **Secondary Blue**: #3b82f6 (bright blue for buttons)
- **Accent Blue**: #60a5fa (light blue for hover states)
- **Background**: #f8fafc (clean off-white backdrop)

### Advanced UI Components
- **Gradient Header**: Professional blue gradient with pattern overlay
- **Card-Based Layout**: Modern cards with shadows and rounded corners
- **Interactive Elements**: Smooth hover animations and transitions
- **Search Interface**: Large, prominent search bar with blue accents
- **Result Display**: Tabbed interface with enhanced typography
- **Mobile Optimized**: Responsive design with touch-friendly interactions

### User Experience Features
- **Search History**: Grid-based layout with confidence indicators
- **Example Questions**: Interactive cards with call-to-action styling
- **Real-time Feedback**: Loading states and progress indicators
- **Professional Footer**: Clean attribution and system information

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production with type checking
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run typecheck` - TypeScript type checking
- `node scripts/generate-embeddings.js` - Generate/update embeddings

### Key Architecture Files

**Core AI & Database:**
- `/src/lib/database.ts` - PostgreSQL operations and vector search
- `/src/lib/embeddings.ts` - Amazon Titan v2 embedding generation
- `/src/lib/claude.ts` - Claude 4.0 integration for RAG responses
- `/src/lib/ai-audit.ts` - AI usage tracking and analytics

**API Routes:**
- `/src/app/api/ask/route.ts` - RAG endpoint with pure vector search
- `/src/app/api/search/route.ts` - Detailed source search
- `/src/app/api/suggestions/route.ts` - Query suggestions

**Frontend Components:**
- `/src/components/search-interface.tsx` - Main modern blue-themed interface
- `/src/components/ui/` - Reusable UI components with professional styling
- `/src/lib/utils.ts` - Utility functions for formatting and highlighting

**Scripts:**
- `/scripts/generate-embeddings.js` - Complete document processing pipeline

## 📊 Performance & Monitoring

### Optimizations
- **Vector Indexing**: IVFFlat index for sub-second similarity search on 969 chunks
- **Pure Vector Search**: No keyword fallbacks for optimal semantic accuracy
- **Intelligent Chunking**: Context-preserving chunks with optimal token utilization
- **Caching**: Application-level caching for improved response times
- **Batch Processing**: Efficient embedding generation with rate limiting

### Analytics & Tracking
- **AI Usage Logs**: Complete tracking of Claude 4.0 usage and costs
- **Search Analytics**: Query patterns, confidence scores, and result quality
- **Performance Metrics**: Response times, similarity scores, and user interactions
- **Source Attribution**: Detailed tracking of document section usage

### System Statistics
- **📚 Total Documents**: 27 comprehensive user guides
- **🔢 Total Chunks**: 969 intelligently processed document chunks
- **📏 Vector Dimensions**: 1024 (Amazon Titan v2)
- **⚡ Search Performance**: Sub-second vector similarity search
- **🎯 Coverage**: Complete Idox Public Protection System documentation

## 🔒 Security & Compliance

- **🔐 Secure Credentials**: Environment-based AWS credential management
- **🌐 HTTPS**: Encrypted communication in production
- **📊 Data Protection**: Public documentation with no sensitive data
- **🛡️ API Security**: Rate limiting and input validation
- **✅ Audit Trail**: Complete AI usage logging for compliance

## 🚀 Production Deployment

### Vercel Deployment (Recommended)

1. **Connect repository** to Vercel dashboard
2. **Configure environment variables:**
   ```env
   DATABASE_URL=postgresql://...
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   CLAUDE_MODEL_ID=us.anthropic.claude-sonnet-4-20250514-v1:0
   ```
3. **Deploy**: Automatic deployment on git push

### Database Setup for Production

**Recommended: Neon Database**
- Built-in pgvector support
- Automatic scaling
- Simple setup with connection string

**Alternative: Supabase**
- PostgreSQL with extensions
- Built-in vector support
- Additional real-time features

## 📚 Documentation Coverage

The system includes comprehensive coverage of:

```
📁 User Guide/ (27 files, 969 chunks)
├── 00-System-Overview.md (47 chunks)
├── 01-Premises-Management-User-Guide.md (54 chunks)
├── 02-Inspections-Management-User-Guide.md (41 chunks)
├── 03-Complaints-Management-User-Guide.md (35 chunks)
├── 04-Licensing-Management-User-Guide.md (34 chunks)
├── 05-Enforcement-Management-User-Guide.md (40 chunks)
├── 06-Mobile-Working-User-Guide.md (40 chunks)
├── 07-User-Management-Security-User-Guide.md (42 chunks)
├── 08-System-Configuration-User-Guide.md (41 chunks)
├── 09-System-Integrations-User-Guide.md (36 chunks)
├── 10-Reports-Analytics-User-Guide.md (40 chunks)
├── 14-Samples-Management-User-Guide.md (31 chunks)
├── 15-Accidents-RIDDOR-User-Guide.md (35 chunks)
├── 16-Food-Poisoning-Management-User-Guide.md (33 chunks)
├── 17-Prosecutions-Management-User-Guide.md (32 chunks)
├── 18-Dogs-Management-User-Guide.md (35 chunks)
├── 19-Planning-Management-User-Guide.md (33 chunks)
├── 20-Grants-Management-User-Guide.md (33 chunks)
├── 21-Bookings-Management-User-Guide.md (33 chunks)
├── 22-Initiatives-Management-User-Guide.md (36 chunks)
├── 23-Notices-Management-User-Guide.md (36 chunks)
├── 24-GIS-Mapping-User-Guide.md (22 chunks)
├── 25-Communications-Admin-User-Guide.md (24 chunks)
├── 26-Audit-Trail-User-Guide.md (24 chunks)
├── 27-End-to-End-Regulatory-Processes.md (39 chunks)
├── 28-Daily-Operations-Guide.md (34 chunks)
└── 29-Role-Based-Handbooks.md (39 chunks)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the existing code style and TypeScript practices
4. Test your changes with the development server
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**CSS Not Loading:**
- Clear browser cache (Ctrl+F5)
- Check DevTools Network tab for CSS loading errors
- Restart development server

**Embedding Generation Errors:**
- Verify AWS credentials and permissions
- Check Bedrock model access in your AWS region
- Ensure sufficient API limits for Titan v2

**Search Not Working:**
- Verify database connection and pgvector extension
- Check if embeddings were generated successfully
- Review API logs for error messages

### Support Channels
- **GitHub Issues**: Technical issues and feature requests
- **Documentation**: Complete user guides in `/User Guide` directory
- **API Testing**: Use the included examples and test queries

## 🙏 Acknowledgments

- **🏛️ Idox Group**: Comprehensive Public Protection System documentation
- **🤖 AWS Bedrock**: Claude 4.0 and Titan v2 AI services
- **🔍 pgvector**: High-performance vector similarity search
- **⚡ Vercel**: Seamless deployment and hosting platform
- **🎨 Radix UI**: Professional component library
- **💙 Tailwind CSS**: Modern styling framework

---

**🚀 Built with cutting-edge AI technology for modern government agencies**

*Last updated: August 2025*