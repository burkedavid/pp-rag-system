# 🏛️ Idox Public Protection Knowledge Base

A sophisticated AI-powered RAG (Retrieval-Augmented Generation) system for the Idox Public Protection System documentation. Features a modern blue-themed interface, Claude 4.0 Sonnet intelligence, and Amazon Titan v2 embeddings for semantic search across regulatory documentation.

## ✨ Features

- **🚨 CRITICAL: Anti-Hallucination System**: Comprehensive safeguards prevent AI fabrication with strict similarity thresholds (<40% triggers safe fallback), ultra-conservative model settings (temperature: 0.1), and explicit source validation requirements
- **🧠 Advanced AI Integration**: Claude 4.0 Sonnet for intelligent, contextual responses with regulatory compliance focus
- **🔍 Hybrid Search**: 70% semantic + 30% keyword search for optimal results
- **🎨 Modern Professional UI**: Sophisticated blue-themed interface with professional loading animations
- **📱 Responsive Design**: Mobile-optimized with smooth animations and professional styling
- **🎯 Robust Confidence Scoring**: Strict anti-hallucination requirements with transparent similarity-based confidence levels
- **📊 Smart Analytics**: AI usage tracking with enhanced confidence scoring and tooltips
- **💾 Comprehensive Coverage**: 969 document chunks across 27 user guide modules
- **⚡ Real-time Search**: Instant suggestions, search history, and professional loading states
- **🏠 Enhanced Navigation**: Easy-to-use Home button for seamless user experience
- **💡 Intelligent Tooltips**: Detailed confidence explanations for user transparency
- **🔗 Related Questions**: AI-generated software-specific follow-up questions using Claude 4.0
- **📱 Smooth Navigation**: Auto-scroll to top when clicking related questions for optimal UX
- **🎛️ Dynamic Admin Controls**: Real-time RAG system configuration with similarity thresholds, source count, and confidence settings
- **📊 Comprehensive Analytics Dashboard**: Complete query logging, performance metrics, and system optimization insights
- **🔧 Production-Ready Management**: Advanced embeddings management, content pipeline control, and database administration

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

## 🎛️ Admin Dashboard & RAG Controls

### Admin Interface Overview

Access the comprehensive admin dashboard at `http://localhost:3000/admin` for:

- **📊 System Analytics**: Real-time RAG performance metrics and usage statistics
- **❓ Question Logs**: Complete query history with confidence scores and source analysis  
- **🔧 RAG Settings**: Dynamic configuration of system behavior and response quality
- **📚 Embeddings Management**: Vector database administration and content management
- **⚙️ RAG Management**: Document ingestion, processing, and content pipeline control

### RAG System Configuration

The admin dashboard includes **dynamic RAG controls** for real-time system tuning:

#### Configurable Settings

**🎯 Similarity Threshold** (0.1 - 1.0)
- Controls minimum similarity score required to provide an answer
- **Default: 0.45** - Below this threshold returns "Information Not Available"
- **Lower values**: More permissive, answers more queries but may reduce accuracy
- **Higher values**: More strict, only answers high-confidence queries

**📄 Source Count** (1 - 20)  
- Number of document chunks retrieved for each query
- **Default: 5** - Balanced between comprehensiveness and processing speed
- **Lower values**: Faster responses, more focused answers
- **Higher values**: More comprehensive context, longer processing time

**📈 Medium Confidence Threshold** (0.1 - 1.0)
- Minimum similarity required for medium confidence rating
- **Default: 0.50** - Must be above similarity threshold for logical consistency

**🎯 High Confidence Threshold** (0.1 - 1.0)
- Minimum similarity required for high confidence rating  
- **Default: 0.70** - Ensures only very relevant matches get high confidence

#### Using Admin Controls

1. **Access Admin Dashboard**: Navigate to `/admin`
2. **Select RAG Management Tab**: Click the "RAG Management" tab
3. **Configure Settings**: Use the RAG System Settings panel (right column)
4. **Real-time Updates**: Changes take effect immediately without restart
5. **Reset Defaults**: One-click restore to optimal settings

#### Configuration Examples

**Conservative Setup** (High Accuracy):
```json
{
  "similarity_threshold": 0.6,
  "source_count": 4,  
  "confidence_threshold_medium": 0.65,
  "confidence_threshold_high": 0.8
}
```

**Permissive Setup** (High Coverage):
```json
{
  "similarity_threshold": 0.3,
  "source_count": 8,
  "confidence_threshold_medium": 0.4, 
  "confidence_threshold_high": 0.6
}
```

### Admin Dashboard Features

#### System Analytics
- **Query Performance**: Average response times and confidence distribution
- **Usage Trends**: Daily/weekly query patterns and success rates  
- **Source Quality**: Analysis of document types contributing to answers
- **Improvement Opportunities**: AI-identified areas for content enhancement

#### Question Logs  
- **Complete History**: Every query with timestamp, confidence, and similarity scores
- **Advanced Filtering**: Filter by confidence level, date range, or search terms
- **Source Analysis**: Detailed breakdown of which documents contributed to each answer
- **User Insights**: IP tracking and usage patterns for system optimization

#### Embeddings Management
- **Vector Database Control**: View, update, and manage document embeddings
- **Content Statistics**: Comprehensive overview of ingested content by type
- **Quality Metrics**: Embedding generation success rates and processing times
- **Cleanup Tools**: Remove outdated or duplicate content efficiently

### Database Schema (Admin Tables)

```sql
-- RAG configuration table
CREATE TABLE rag_settings (
    id SERIAL PRIMARY KEY,
    similarity_threshold DECIMAL(3,2) NOT NULL DEFAULT 0.45,
    source_count INTEGER NOT NULL DEFAULT 5,
    confidence_threshold_medium DECIMAL(3,2) NOT NULL DEFAULT 0.50,
    confidence_threshold_high DECIMAL(3,2) NOT NULL DEFAULT 0.70,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question logging for analytics
CREATE TABLE question_logs (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    confidence VARCHAR(10) NOT NULL,
    similarity_score DECIMAL(5,4) NOT NULL,
    sources_count INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    model_used VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    -- Additional analytics fields
    search_results_count INTEGER,
    how_to_guide_count INTEGER,
    verified_content_count INTEGER,
    faq_content_count INTEGER,
    module_doc_count INTEGER,
    answer_length INTEGER
);
```

### Admin API Endpoints

#### RAG Settings Management
```bash
# Get current settings
curl -X GET http://localhost:3000/api/admin/rag-settings

# Update settings  
curl -X POST http://localhost:3000/api/admin/rag-settings \
  -H "Content-Type: application/json" \
  -d '{
    "similarity_threshold": 0.45,
    "source_count": 6,
    "confidence_threshold_medium": 0.5,
    "confidence_threshold_high": 0.7
  }'
```

#### Analytics & Monitoring
```bash
# Get system analytics
curl -X GET http://localhost:3000/api/admin/analytics?days=30

# Query question logs
curl -X GET "http://localhost:3000/api/admin/questions?page=1&limit=50"

# Filter by confidence
curl -X GET "http://localhost:3000/api/admin/questions?confidence=high"
```

## 📖 Usage Guide

### Example Queries

The system expertly handles questions about all aspects of public protection. **High-confidence example questions** (optimized for best results):

**🐕 Animal Control & Dogs:**
- "How do I create a new dog case record?" (99.6% similarity)
- "How do I view dog records in the system?" (83.4% similarity)
- "How do I search for dog records?" (79.8% similarity)

**🍽️ Environmental Health:**
- "How do I investigate food poisoning incidents?" (87.2% similarity)
- "How do I record food poisoning cases?" (85.1% similarity)
- "How do I process online food business registrations?" (82.3% similarity)

**🔍 System Navigation:**
- "How do I save search criteria?" (83.4% similarity)
- "How do I search for contacts?" (81.7% similarity)
- "How do I submit ideas to the Idox Ideas Portal?" (79.8% similarity)

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
- `POST /api/related` - Generate software-specific follow-up questions using Claude 4.0
- `GET /api/documents` - List available source documents
- `GET /api/admin/rag-settings` - Get current RAG system configuration
- `POST /api/admin/rag-settings` - Update RAG system configuration

### Response Format

#### RAG Query Response (`/api/ask`)
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

#### Related Questions Response (`/api/related`)
```json
{
  "relatedQuestions": [
    "How do I create a new license application in Idox?",
    "Can I bulk import license applications into Idox?", 
    "How do I set up automated license renewal reminders?",
    "What screen do I use to view application history?",
    "How do I configure email notifications in the system?"
  ],
  "query": "How do I access the licensing module in Idox?",
  "note": "Related questions generated using Claude 4.0"
}
```

**Related Questions Request Format:**
```json
{
  "query": "Original user query",
  "sources": [{"source_file": "...", "section_title": "...", "similarity": 0.85}],
  "answer": "AI-generated answer from the original query..."
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

#### 🚨 CRITICAL: Anti-Hallucination System

**Comprehensive safeguards prevent AI from fabricating information:**

```javascript
// CRITICAL: Anti-hallucination validation - similarity thresholds
const maxSimilarity = searchResults.length > 0 ? Math.max(...searchResults.map(r => r.similarity)) : 0;

// If similarity is too low, provide safe fallback response
if (maxSimilarity < 0.4) {
  return {
    answer: `## Information Not Available
I don't have sufficient information in the documentation to answer your question...`,
    confidence: 'low',
    sourceQuality: { qualityScore: 'Insufficient information available' }
  };
}
```

**Enhanced Confidence Scoring - Strict Anti-Hallucination Requirements:**
```javascript
// STRICT Anti-Hallucination Confidence Scoring
const qualitySourceCount = howToGuideCount + verifiedContentCount + moduleDocCount;

// CRITICAL: Prevent hallucination with strict similarity thresholds
if (maxSimilarity < 0.7) {
  // If best match is below 70%, always medium or low confidence
  if (maxSimilarity > 0.5 && qualitySourceCount >= 2) {
    confidence = 'medium';
  } else if (maxSimilarity > 0.4 && qualitySourceCount >= 1) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }
} else {
  // Only allow high confidence with strong similarity AND quality sources
  if (maxSimilarity > 0.8 && (howToGuideCount >= 2 || verifiedContentCount >= 1)) {
    confidence = 'high';
  } else if (maxSimilarity > 0.75 && qualitySourceCount >= 2) {
    confidence = 'high';
  } else {
    confidence = 'medium';
  }
}
```

**AI Model Configuration - Ultra-Conservative Settings:**
```javascript
// ULTRA-CONSERVATIVE: Anti-hallucination model settings
temperature: 0.1,  // Reduced from 0.3 to prevent hallucination
topK: 150          // Further reduced for maximum precision
```

**Explicit Anti-Hallucination Prompt Instructions:**
- **NEVER FABRICATE INFORMATION** - Only provide information explicitly in context
- **STRICT SOURCE ADHERENCE** - Every piece of information must be traceable to sources
- **NO EXTRAPOLATION** - Do not infer, assume, or extend beyond documented content
- **ACKNOWLEDGE LIMITATIONS** - If context doesn't contain sufficient information, clearly state this
- **VERIFY CONTEXT RELEVANCE** - Ensure source material actually addresses the user's question

**Confidence Transparency for Regulatory Compliance:**
- **High Confidence**: Strong match found (>75% similarity) with quality sources
- **Medium Confidence**: Moderate match found (40-75% similarity) with appropriate limitations
- **Low Confidence**: Insufficient information available (<40% similarity) - safe fallback response

### 🎯 Quality Assurance & System Tuning

#### Comprehensive System Optimization (Latest)

The system has been extensively tuned through a comprehensive optimization process:

**🔧 Technical Improvements Made:**
- **Vector Dimension Fix**: Updated from 1536 to 1024 dimensions for Titan v2 compatibility
- **Similarity Threshold Optimization**: Lowered from 0.7 to 0.3 for better recall (200% improvement)
- **Hybrid Search Implementation**: Combined 70% semantic + 30% keyword search
- **Confidence Algorithm Enhancement**: Added maximum similarity consideration for accuracy
- **AI Prompt Optimization**: Made more helpful and less restrictive for comprehensive responses

**📊 Performance Results:**
- **Example Questions Optimized**: All 9 example questions now achieve 79%+ similarity scores
- **High Confidence Rate**: 100% of suggested questions return high confidence responses
- **Search Quality**: Dramatically improved recall and relevance scores
- **User Experience**: Professional loading animations and confidence tooltips added

#### Testing Framework

```bash
# Run comprehensive quality assessment
node scripts/test-rag-quality.js

# Test specific high-confidence questions
node scripts/test-specific-faqs.js

# Find best-performing questions for examples
node scripts/test-high-confidence.js

# Quick system validation
node scripts/quick-test.js
```

#### Quality Metrics

- **Answer relevance** - Checks for topic coverage and software specificity
- **Confidence levels** - Enhanced algorithm monitoring AI certainty
- **Similarity scores** - All example questions achieve >79% similarity
- **Source count** - Ensures comprehensive context with hybrid search
- **Response length** - Validates detailed, actionable answers
- **User transparency** - Confidence tooltips explain scoring to users

## 🎨 Modern Interface Features

### Professional Blue Theme
- **Primary Blue**: #1e40af (deep blue for headers)
- **Secondary Blue**: #3b82f6 (bright blue for buttons)
- **Accent Blue**: #60a5fa (light blue for hover states)
- **Background**: #f8fafc (clean off-white backdrop)

### Advanced UI Components
- **Enhanced Header**: Professional blue gradient with Home navigation button
- **Card-Based Layout**: Modern cards with shadows and rounded corners
- **Interactive Elements**: Smooth hover animations and transitions
- **Search Interface**: Large, prominent search bar with blue accents
- **Professional Loading**: Sophisticated loading animation with progress steps
- **Result Display**: Tabbed interface with enhanced typography
- **Mobile Optimized**: Responsive design with touch-friendly interactions

### User Experience Features
- **Navigation**: Easy-to-use Home button with state reset functionality
- **Search History**: Grid-based layout with confidence indicators and tooltips
- **Example Questions**: Interactive cards showcasing high-confidence queries
- **Related Questions**: AI-generated follow-up questions with amber-themed design
- **Smart Navigation**: Auto-scroll to top when selecting related questions
- **Loading Experience**: Professional animations with status indicators
- **Confidence Transparency**: Hover tooltips explaining confidence levels
- **Real-time Feedback**: Enhanced loading states and progress indicators
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
- `/src/app/api/related/route.ts` - AI-generated software-specific follow-up questions

**Frontend Components:**
- `/src/components/search-interface.tsx` - Main modern blue-themed interface
- `/src/components/ui/` - Reusable UI components with professional styling
- `/src/lib/utils.ts` - Utility functions for formatting and highlighting

**Scripts:**
- `/scripts/ingest-faq-documents.js` - FAQ document processing (Titan v2)
- `/scripts/ingest-module-docs.js` - Module documentation processing (Titan v2)
- `/scripts/test-rag-quality.js` - System quality assessment
- `/scripts/fix-database.js` - Database schema management

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

### 🚨 CRITICAL: Regulatory Safety & Anti-Hallucination

**Why Anti-Hallucination is Essential for Regulatory Systems:**

This RAG system serves government regulatory officers making compliance decisions with legal consequences. **AI hallucination in this context is extremely dangerous** as it could:
- ❌ Provide incorrect legal procedures leading to invalid enforcement actions
- ❌ Give false information about regulatory requirements, compromising public safety
- ❌ Create fabricated compliance guidance that violates statutory obligations
- ❌ Generate incorrect inspection procedures, missing critical health hazards

**Our Comprehensive Solution:**
- ✅ **Strict Similarity Thresholds**: <40% similarity triggers "Information Not Available" response
- ✅ **Conservative AI Settings**: Ultra-low temperature (0.1) prevents creative fabrication
- ✅ **Source Validation**: Every response must be traceable to documentation
- ✅ **Transparent Limitations**: System explicitly acknowledges when information is insufficient
- ✅ **Quality Source Requirements**: High confidence requires verified procedural content

**Result**: The system will **refuse to answer** rather than risk providing incorrect regulatory guidance.

### Standard Security Features
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

## 🛠️ Recent System Updates

### January 2025 - Vercel Serverless Compatibility & Critical Bug Fixes

**🚨 Major Issues Resolved:**
- **✅ RAG Ingestion Fixed**: Completely rewrote document ingestion system for Vercel compatibility
- **✅ TypeScript Errors**: Resolved all compilation errors preventing deployment
- **✅ File Storage**: Fixed file lookup errors causing "File not found in storage" failures
- **✅ UI/UX Improvements**: Enhanced admin interface layout and professional messaging

**🔧 Technical Improvements:**

**Vercel Serverless Compatibility**
```typescript
// Before: Broken child process approach (doesn't work on Vercel)
const nodeProcess = spawn('node', [scriptFullPath]);

// After: Direct inline processing (Vercel compatible)
await processFilesDirectly(jobId, job, files, options);
```

**File Storage Fix**
```typescript
// Fixed file lookup using correct storage key
const storedFile = uploadedFilesStore.get(file.path); // ✅ Correct
```

**Type Safety Enhancement**
```typescript
// Added proper interface for file objects
interface UploadedFileInfo {
  originalName: string;
  fileName: string; 
  size: number;
  type: string;
  path: string; // Storage key for Vercel memory store
}
```

**UI/UX Enhancements**
- 💡 Replaced robot emoji with professional loading icons
- 📍 Moved ingestion status closer to options for better workflow
- ⚡ Real-time progress tracking via database updates
- 🎯 Improved error messages and status feedback

**System Reliability**
- 🔒 Database-based job tracking instead of in-memory state
- 🗂️ Proper `/tmp` directory usage for temporary files
- 📊 Real-time ingestion progress monitoring
- ⚠️ Graceful error handling and user feedback

**Deployment Impact**
- ✅ RAG document ingestion now works properly on Vercel production
- ✅ TypeScript compilation passes without errors
- ✅ Professional user experience with proper status updates
- ✅ Reliable file processing for FAQ documents and module guides

---

**🚀 Built with cutting-edge AI technology for modern government agencies**

*Last updated: January 2025 - Vercel compatibility and critical bug fixes*