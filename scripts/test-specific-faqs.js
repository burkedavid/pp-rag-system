#!/usr/bin/env node

// Test very specific questions based on actual FAQ content
const specificQuestions = [
  // Dogs - highest scoring so far
  "How do I create a new dog case record?",
  "How do I view dog records in the system?", 
  "How do I search for dog records?",
  
  // Food poisoning - good scores
  "How do I investigate food poisoning incidents?",
  "How do I record food poisoning cases?",
  
  // Premises management - specific to content
  "How do I process online food business registrations?",
  
  // Getting started - should have basic content
  "How do I get started with the Public Protection system?",
  
  // Maps/Locations - has detailed content
  "How do I use the maps interface?",
  "How do I search for locations using the map?",
  
  // Contact management - basic functionality
  "How do I create contacts in the system?",
  "How do I search for contacts?",
  
  // Ideas portal - specific content
  "How do I submit ideas to the Idox Ideas Portal?",
  
  // Saved searches - specific functionality  
  "How do I save search criteria?",
  "How do I use saved searches?",
  
  // Module access questions
  "How do I access the Dogs module?",
  "How do I navigate to the Premises module?",
  "How do I use the Inspections module?",
  
  // Accidents 
  "How do I record accident reports?",
  "How do I create accident incidents?"
];

async function testSpecificQuestion(question) {
  try {
    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: question })
    });

    const data = await response.json();
    const maxSim = Math.max(...data.sources.map(s => s.similarity));
    
    return {
      question,
      maxSimilarity: maxSim,
      confidence: data.confidence,
      sources: data.sources.length,
      topSource: data.sources[0]?.source_file?.replace('.md', '') || 'none'
    };
    
  } catch (error) {
    return { question, error: error.message };
  }
}

async function findBestFAQQuestions() {
  console.log('🎯 Testing specific FAQ-based questions...\n');
  
  const results = [];
  
  for (const question of specificQuestions) {
    const result = await testSpecificQuestion(question);
    results.push(result);
    
    if (result.error) {
      console.log(`❌ ${question} - ERROR`);
    } else {
      console.log(`${(result.maxSimilarity * 100).toFixed(1)}% - ${question} (${result.topSource})`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
  }
  
  // Sort by similarity and get top 9
  const sorted = results
    .filter(r => !r.error && r.maxSimilarity > 0.5)
    .sort((a, b) => b.maxSimilarity - a.maxSimilarity)
    .slice(0, 9);
  
  console.log('\n🏆 TOP 9 QUESTIONS FOR EXAMPLES:');
  console.log('='.repeat(60));
  
  sorted.forEach((result, index) => {
    console.log(`${index + 1}. [${(result.maxSimilarity * 100).toFixed(1)}%] ${result.question}`);
  });
  
  console.log('\n📝 COPY-PASTE FOR CODE:');
  console.log('='.repeat(60));
  const codeArray = sorted.map(r => `"${r.question}"`).join(',\n                  ');
  console.log(`[\n                  ${codeArray}\n                ]`);
  
  return sorted;
}

findBestFAQQuestions().catch(console.error);