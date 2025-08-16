#!/usr/bin/env node

// Questions that should have excellent responses based on available documentation
const candidateQuestions = [
  // Complaints module (has comprehensive content)
  "How do I manage complaints in the Complaints module?",
  "How do I investigate food safety complaints?",
  "How do I link complaints to business premises?",
  
  // Dogs module (seems to have good content)
  "How do I manage dog control cases?",
  "How do I record stray dog incidents?",
  "How do I handle dangerous dog investigations?",
  
  // Food poisoning (has specific workflows)
  "How do I record a food poisoning incident?",
  "How do I investigate food poisoning outbreaks?",
  "How do I collect samples for food poisoning cases?",
  
  // Admin module (comprehensive features)
  "How do I manage user permissions in the Admin module?",
  "How do I create new user accounts?",
  "How do I configure system settings?",
  
  // Contacts (fundamental functionality)
  "How do I create and manage contacts?",
  "How do I link contacts to premises?",
  "How do I search for existing contacts?",
  
  // GIS and mapping
  "How do I use the GIS mapping features?",
  "How do I search locations using the map?",
  "How do I view premises on the map?",
  
  // Licensing 
  "How do I process license applications?",
  "How do I create committee reports for licenses?",
  "How do I manage license renewals?",
  
  // Service requests
  "How do I create service requests?",
  "How do I track service request progress?",
  "How do I assign service requests to officers?"
];

async function testQuestion(question) {
  try {
    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: question })
    });

    const data = await response.json();
    
    // Score the response quality
    let score = 0;
    
    // Confidence scoring
    if (data.confidence === 'high') score += 30;
    else if (data.confidence === 'medium') score += 20;
    else score += 10;
    
    // Source count scoring
    if (data.sources.length >= 5) score += 20;
    else if (data.sources.length >= 3) score += 15;
    else if (data.sources.length >= 1) score += 10;
    
    // Length scoring (good detail)
    if (data.answer.length >= 1500) score += 20;
    else if (data.answer.length >= 800) score += 15;
    else if (data.answer.length >= 400) score += 10;
    
    // Negative scoring for "not available"
    if (data.answer.toLowerCase().includes('not available') || 
        data.answer.toLowerCase().includes('don\'t contain')) {
      score -= 30;
    }
    
    // Positive scoring for specific software terms
    const softwareTerms = ['click', 'navigate', 'select', 'module', 'button', 'menu', 'field', 'form'];
    const hasTerms = softwareTerms.filter(term => 
      data.answer.toLowerCase().includes(term)
    ).length;
    score += hasTerms * 2;
    
    return {
      question,
      score,
      confidence: data.confidence,
      sources: data.sources.length,
      length: data.answer.length,
      answer: data.answer
    };
    
  } catch (error) {
    return {
      question,
      score: 0,
      error: error.message
    };
  }
}

async function findBestQuestions() {
  console.log('🔍 Testing candidate questions to find the best ones...\n');
  
  const results = [];
  
  for (const question of candidateQuestions) {
    console.log(`Testing: ${question}`);
    const result = await testQuestion(question);
    results.push(result);
    console.log(`   Score: ${result.score} | Confidence: ${result.confidence || 'ERROR'} | Sources: ${result.sources || 0}`);
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Sort by score
  results.sort((a, b) => b.score - a.score);
  
  console.log('\n🏆 TOP 10 BEST QUESTIONS:');
  console.log('='.repeat(80));
  
  const top10 = results.slice(0, 10);
  top10.forEach((result, index) => {
    console.log(`${index + 1}. [Score: ${result.score}] ${result.question}`);
    console.log(`   Confidence: ${result.confidence} | Sources: ${result.sources} | Length: ${result.length}`);
    console.log('');
  });
  
  console.log('\n📝 RECOMMENDED EXAMPLE QUESTIONS (Top 9):');
  console.log('='.repeat(80));
  
  const recommended = top10.slice(0, 9).map(r => `"${r.question}"`);
  console.log(recommended.join(',\n'));
  
  return results;
}

if (require.main === module) {
  findBestQuestions().catch(console.error);
}