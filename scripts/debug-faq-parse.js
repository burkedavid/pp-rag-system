#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseMarkdownSections(content) {
  console.log('Content length:', content.length);
  console.log('First 200 chars:', content.substring(0, 200));
  
  const sections = [];
  const lines = content.split('\n');
  let currentSection = null;
  
  console.log('Total lines:', lines.length);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Debug: check first few lines
    if (i < 10) {
      console.log(`Line ${i}: "${line}" (starts with #: ${line.startsWith('#')})`);
      if (line.startsWith('#')) {
        const testMatch = line.match(/^(#{1,6})\s+(.+)$/);
        console.log(`  Regex test result:`, testMatch);
      }
    }
    
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      console.log(`Found heading at line ${i}: ${line}`);
      
      if (currentSection) {
        console.log(`Pushing previous section: ${currentSection.title} (${currentSection.content.length} chars)`);
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
    console.log(`Pushing final section: ${currentSection.title} (${currentSection.content.length} chars)`);
    sections.push(currentSection);
  }
  
  console.log(`Total sections found: ${sections.length}`);
  return sections;
}

function chunkSection(section, sourceFile, maxTokens, overlapTokens, startIndex) {
  console.log(`\nChunking section: ${section.title}`);
  console.log(`Content length: ${section.content.length}`);
  console.log(`Content preview: ${section.content.substring(0, 100)}...`);
  
  const chunks = [];
  const paragraphs = section.content.split('\n\n').filter(p => p.trim());
  
  console.log(`Found ${paragraphs.length} paragraphs`);
  
  let currentChunk = '';
  let chunkIndex = startIndex;
  
  for (const paragraph of paragraphs) {
    const potentialChunk = currentChunk + (currentChunk ? '\n\n' : '') + paragraph;
    const tokenCount = Math.ceil(potentialChunk.length / 4);
    
    if (tokenCount > maxTokens && currentChunk) {
      chunks.push({
        source_file: sourceFile,
        section_title: section.title,
        chunk_text: currentChunk.trim(),
        chunk_index: chunkIndex++,
        token_count: Math.ceil(currentChunk.length / 4),
      });
      console.log(`Created chunk ${chunkIndex - 1}: ${Math.ceil(currentChunk.length / 4)} tokens`);
      
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
      token_count: Math.ceil(currentChunk.length / 4),
    });
    console.log(`Created final chunk ${chunkIndex}: ${Math.ceil(currentChunk.length / 4)} tokens`);
  }
  
  console.log(`Section generated ${chunks.length} chunks`);
  return chunks;
}

// Test with one file
const faqPath = path.join(__dirname, '..', 'RAG Data', 'FAQs', '01-getting-started-faq.md');
console.log('Reading file:', faqPath);

const content = fs.readFileSync(faqPath, 'utf-8');
const sections = parseMarkdownSections(content);

let totalChunks = 0;
for (const section of sections) {
  const chunks = chunkSection(section, '01-getting-started-faq.md', 800, 100, totalChunks);
  totalChunks += chunks.length;
}