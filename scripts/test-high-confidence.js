#!/usr/bin/env node

// Test specific questions to find high confidence responses
const testQuestions = [
  // Dogs module (has good detailed content)
  "How do I create a new dog case record?",
  "How do I search for existing dog records?", 
  "How do I view dog records in the system?",
  
  // FAQ procedural content
  "How do I process an online food business registration?",
  "How do I carry out a premises search?",
  "How do I create a new contact record?",
  
  // Service requests (should have good content)
  "How do I create a new service request?",
  "How do I view existing service requests?",
  "How do I update a service request status?",
  
  // Grants (has specific content)
  "How do I create a new grant record?",
  "How do I search for grant applications?",
  "How do I process grant applications?",
  
  // Notices (enforcement content)
  "How do I create enforcement notices?",
  "How do I issue improvement notices?",
  "How do I manage notice workflows?",
  
  // Licensing 
  "How do I process license applications?",
  "How do I create license committee reports?",
  "How do I manage license renewals?",
  
  // Food poisoning (detailed procedures)
  "How do I investigate food poisoning incidents?",
  "How do I record food poisoning cases?",
  "How do I link food poisoning to premises?",
  
  // Getting started (fundamental workflows)
  "How do I get started with the system?",
  "How do I navigate the main interface?",
  "How do I access different modules?",
  
  // Admin and permissions
  "How do I manage user permissions?",
  "How do I create new user accounts?",
  "How do I configure system settings?"
];

async function testQuestion(question) {
  try {
    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: question })
    });

    const data = await response.json();
    
    // Get highest similarity score
    const maxSimilarity = Math.max(...data.sources.map(s => s.similarity));
    
    return {
      question,
      confidence: data.confidence,
      sources: data.sources.length,
      maxSimilarity: maxSimilarity,
      avgSimilarity: data.sources.reduce((sum, s) => sum + s.similarity, 0) / data.sources.length,
      answerLength: data.answer.length,
      topSource: data.sources[0]?.source_file || 'none'
    };
    
  } catch (error) {
    return {
      question,
      error: error.message
    };
  }
}

async function findHighConfidenceQuestions() {
  console.log('🔍 Testing questions for high confidence responses...\n');
  
  const results = [];
  
  for (const question of testQuestions) {
    console.log(`Testing: ${question}`);
    const result = await testQuestion(question);
    results.push(result);
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    } else {
      console.log(`   📊 Max Sim: ${(result.maxSimilarity * 100).toFixed(1)}% | Avg: ${(result.avgSimilarity * 100).toFixed(1)}% | Sources: ${result.sources} | Conf: ${result.confidence}`);
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  // Sort by max similarity score
  results.sort((a, b) => (b.maxSimilarity || 0) - (a.maxSimilarity || 0));
  
  console.log('\n🏆 TOP 9 HIGH SIMILARITY QUESTIONS (for examples):');
  console.log('='.repeat(80));
  
  const top9 = results.slice(0, 9);
  top9.forEach((result, index) => {
    if (!result.error) {
      console.log(`${index + 1}. [${(result.maxSimilarity * 100).toFixed(1)}%] ${result.question}`);
      console.log(`   Source: ${result.topSource} | Avg: ${(result.avgSimilarity * 100).toFixed(1)}%`);
      console.log('');
    }
  });
  
  console.log('\n📝 RECOMMENDED EXAMPLE QUESTIONS:');
  console.log('='.repeat(80));
  
  const recommended = top9
    .filter(r => !r.error && r.maxSimilarity > 0.7)
    .slice(0, 9)
    .map(r => `"${r.question}"`);
  
  console.log(recommended.join(',\n'));
  
  return results;
}

if (require.main === module) {
  findHighConfidenceQuestions().catch(console.error);
}