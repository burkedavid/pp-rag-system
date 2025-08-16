import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { generateEmbedding, estimateTokenCount } from './embeddings';

export interface DocumentChunk {
  source_file: string;
  section_title: string;
  chunk_text: string;
  chunk_index: number;
  token_count: number;
  embedding: number[];
  metadata: {
    file_number: number;
    section_type: string;
    topic_area: string;
    has_procedures: boolean;
    subsection_count: number;
  };
}

export interface ParsedDocument {
  filename: string;
  title: string;
  content: string;
  sections: Array<{
    title: string;
    content: string;
    level: number;
  }>;
}

export function parseMarkdownFile(filePath: string): ParsedDocument {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: markdownContent } = matter(content);
  
  const filename = path.basename(filePath);
  const title = extractTitle(markdownContent) || filename;
  
  // Parse sections based on heading levels
  const sections = parseMarkdownSections(markdownContent);
  
  return {
    filename,
    title,
    content: markdownContent,
    sections
  };
}

function extractTitle(content: string): string | null {
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.replace('# ', '').trim();
    }
  }
  return null;
}

function parseMarkdownSections(content: string): Array<{ title: string; content: string; level: number }> {
  const sections: Array<{ title: string; content: string; level: number }> = [];
  const lines = content.split('\n');
  
  let currentSection: { title: string; content: string; level: number } | null = null;
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Start new section
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      
      currentSection = {
        title,
        content: '',
        level
      };
    } else if (currentSection) {
      // Add content to current section
      currentSection.content += line + '\n';
    }
  }
  
  // Add final section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

export function chunkDocument(
  document: ParsedDocument,
  maxTokens: number = 800,
  overlapTokens: number = 100
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const fileNumber = extractFileNumber(document.filename);
  const topicArea = determineTopicArea(document.filename);
  
  for (let i = 0; i < document.sections.length; i++) {
    const section = document.sections[i];
    const sectionChunks = chunkSection(
      section,
      document.filename,
      maxTokens,
      overlapTokens,
      chunks.length
    );
    
    // Add metadata to each chunk
    sectionChunks.forEach(chunk => {
      (chunk as any).metadata = {
        file_number: fileNumber,
        section_type: determineSectionType(section.title),
        topic_area: topicArea,
        has_procedures: containsProcedures(section.content),
        subsection_count: countSubsections(section.content)
      };
    });
    
    chunks.push(...(sectionChunks as DocumentChunk[]));
  }
  
  return chunks;
}

function chunkSection(
  section: { title: string; content: string; level: number },
  sourceFile: string,
  maxTokens: number,
  overlapTokens: number,
  startIndex: number
): Omit<DocumentChunk, 'metadata'>[] {
  const chunks: Omit<DocumentChunk, 'metadata'>[] = [];
  const paragraphs = section.content.split('\n\n').filter(p => p.trim());
  
  let currentChunk = '';
  let chunkIndex = startIndex;
  
  for (const paragraph of paragraphs) {
    const potentialChunk = currentChunk + (currentChunk ? '\n\n' : '') + paragraph;
    const tokenCount = estimateTokenCount(potentialChunk);
    
    if (tokenCount > maxTokens && currentChunk) {
      // Finalize current chunk
      chunks.push({
        source_file: sourceFile,
        section_title: section.title,
        chunk_text: currentChunk.trim(),
        chunk_index: chunkIndex++,
        token_count: estimateTokenCount(currentChunk),
        embedding: [] // Will be populated later
      });
      
      // Start new chunk with overlap
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlapTokens / 4 * 4)); // Rough word estimation
      currentChunk = overlapWords.join(' ') + '\n\n' + paragraph;
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  // Add final chunk if there's content
  if (currentChunk.trim()) {
    chunks.push({
      source_file: sourceFile,
      section_title: section.title,
      chunk_text: currentChunk.trim(),
      chunk_index: chunkIndex,
      token_count: estimateTokenCount(currentChunk),
      embedding: []
    });
  }
  
  return chunks;
}

function extractFileNumber(filename: string): number {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}

function determineTopicArea(filename: string): string {
  const lowerName = filename.toLowerCase();
  
  if (lowerName.includes('premises')) return 'premises_management';
  if (lowerName.includes('inspection')) return 'inspections';
  if (lowerName.includes('complaint')) return 'complaints';
  if (lowerName.includes('licensing')) return 'licensing';
  if (lowerName.includes('enforcement')) return 'enforcement';
  if (lowerName.includes('mobile')) return 'mobile_working';
  if (lowerName.includes('user') || lowerName.includes('security')) return 'user_management';
  if (lowerName.includes('configuration')) return 'system_config';
  if (lowerName.includes('integration')) return 'integrations';
  if (lowerName.includes('report') || lowerName.includes('analytics')) return 'reporting';
  if (lowerName.includes('sample')) return 'samples';
  if (lowerName.includes('accident') || lowerName.includes('riddor')) return 'accidents';
  if (lowerName.includes('food') && lowerName.includes('poisoning')) return 'food_poisoning';
  if (lowerName.includes('prosecution')) return 'prosecutions';
  if (lowerName.includes('dogs')) return 'animal_control';
  if (lowerName.includes('planning')) return 'planning';
  if (lowerName.includes('grant')) return 'grants';
  if (lowerName.includes('booking')) return 'bookings';
  if (lowerName.includes('initiative')) return 'initiatives';
  if (lowerName.includes('notice')) return 'notices';
  if (lowerName.includes('gis') || lowerName.includes('mapping')) return 'mapping';
  if (lowerName.includes('communication')) return 'communications';
  if (lowerName.includes('audit')) return 'audit';
  if (lowerName.includes('end-to-end') || lowerName.includes('processes')) return 'workflows';
  if (lowerName.includes('daily') || lowerName.includes('operations')) return 'operations';
  if (lowerName.includes('role') || lowerName.includes('handbook')) return 'role_guides';
  
  return 'general';
}

function determineSectionType(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('workflow') || lowerTitle.includes('process')) return 'workflow';
  if (lowerTitle.includes('quick start') || lowerTitle.includes('getting started')) return 'quick_start';
  if (lowerTitle.includes('best practice') || lowerTitle.includes('tips')) return 'best_practices';
  if (lowerTitle.includes('troubleshoot') || lowerTitle.includes('common issue')) return 'troubleshooting';
  if (lowerTitle.includes('step') || lowerTitle.includes('procedure')) return 'procedure';
  if (lowerTitle.includes('example') || lowerTitle.includes('scenario')) return 'example';
  if (lowerTitle.includes('overview') || lowerTitle.includes('introduction')) return 'overview';
  if (lowerTitle.includes('feature') || lowerTitle.includes('function')) return 'feature_description';
  
  return 'content';
}

function containsProcedures(content: string): boolean {
  const procedureIndicators = [
    'step 1', 'step 2', 'first', 'then', 'next', 'finally',
    '1.', '2.', '3.', 'click', 'navigate', 'select', 'enter'
  ];
  
  const lowerContent = content.toLowerCase();
  return procedureIndicators.some(indicator => lowerContent.includes(indicator));
}

function countSubsections(content: string): number {
  return (content.match(/^###+ /gm) || []).length;
}

export async function processDocumentWithEmbeddings(
  document: ParsedDocument,
  maxTokens: number = 800
): Promise<DocumentChunk[]> {
  const chunks = chunkDocument(document, maxTokens);
  
  // Generate embeddings for all chunks
  const texts = chunks.map(chunk => chunk.chunk_text);
  const embeddings = await Promise.all(texts.map(text => generateEmbedding(text)));
  
  // Add embeddings to chunks
  chunks.forEach((chunk, index) => {
    chunk.embedding = embeddings[index];
  });
  
  return chunks;
}