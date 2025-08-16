#!/usr/bin/env node

const testQuestions = [
  "How do I manage complaints in the Complaints module?",
  "How do I use the Licensing module for alcohol licenses?", 
  "How do I record a food poisoning incident?",
  "How do I access the Admin module?",
  "How do I create and track grants?",
  "How do I navigate the Inspections module?",
  "How do I use the GIS mapping features?",
  "How do I manage dog control cases?"
];

async function testQuestion(question) {
  try {
    console.log(`🔍 Testing: ${question}`);
    
    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: question })
    });

    const data = await response.json();
    
    console.log(`   📊 Confidence: ${data.confidence.toUpperCase()}`);
    console.log(`   📄 Sources: ${data.sources.length}`);
    console.log(`   📝 Answer Length: ${data.answer.length} chars`);
    
    // Check for "not available" phrases
    const hasNotAvailable = data.answer.toLowerCase().includes('not available') || 
                           data.answer.toLowerCase().includes('don\'t contain');
    
    if (hasNotAvailable) {
      console.log(`   ⚠️  Contains "not available" phrase`);
    } else {
      console.log(`   ✅ Provides specific guidance`);
    }
    
    console.log('');
    return data;
    
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return null;
  }
}

async function runQuickTest() {
  console.log('🚀 Running quick quality test...\n');
  
  for (const question of testQuestions) {
    await testQuestion(question);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('✅ Quick test completed!');
}

runQuickTest().catch(console.error);