#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test questions that should have definitive answers in the RAG data
const testQuestions = [
  // FAQ-based questions
  {
    id: 1,
    question: "How do I register a new food business online?",
    expectedTopics: ["online food business registration", "FSA website", "premises module"],
    category: "premises_management"
  },
  {
    id: 2,
    question: "What are the steps to process an online food registration?",
    expectedTopics: ["review information", "match premises", "match operator", "acceptance"],
    category: "premises_management"
  },
  {
    id: 3,
    question: "How do I create a new service request?",
    expectedTopics: ["service request", "create", "module"],
    category: "service_requests"
  },
  {
    id: 4,
    question: "What are the different types of notices I can issue?",
    expectedTopics: ["notice types", "enforcement", "regulations"],
    category: "notices"
  },
  {
    id: 5,
    question: "How do I start a prosecution case?",
    expectedTopics: ["prosecution", "case", "legal action"],
    category: "prosecutions"
  },
  
  // Module-specific questions
  {
    id: 6,
    question: "How do I navigate the Inspections module?",
    expectedTopics: ["inspections module", "navigation", "access"],
    category: "inspections_module"
  },
  {
    id: 7,
    question: "What features are available in the Premises module?",
    expectedTopics: ["premises module", "features", "functionality"],
    category: "premises_module"
  },
  {
    id: 8,
    question: "How do I use the Licensing module for alcohol licenses?",
    expectedTopics: ["licensing module", "alcohol", "license"],
    category: "licensing_module"
  },
  {
    id: 9,
    question: "How do I manage complaints in the system?",
    expectedTopics: ["complaints module", "manage", "workflow"],
    category: "complaints_module"
  },
  {
    id: 10,
    question: "What is the Admin module used for?",
    expectedTopics: ["admin module", "administration", "user management"],
    category: "admin_module"
  },
  
  // Workflow and procedure questions
  {
    id: 11,
    question: "How do I record a food poisoning incident?",
    expectedTopics: ["food poisoning", "incident", "record"],
    category: "food_poisoning"
  },
  {
    id: 12,
    question: "What are the steps for handling accident reports?",
    expectedTopics: ["accident", "report", "procedure"],
    category: "accidents"
  },
  {
    id: 13,
    question: "How do I manage dog control cases?",
    expectedTopics: ["dogs", "animal control", "cases"],
    category: "dogs"
  },
  {
    id: 14,
    question: "How do I create and track grants?",
    expectedTopics: ["grants", "create", "track"],
    category: "grants"
  },
  {
    id: 15,
    question: "How do I use the GIS integration features?",
    expectedTopics: ["GIS", "mapping", "integration"],
    category: "gis"
  },
  
  // Contact and location management
  {
    id: 16,
    question: "How do I add new contacts to the system?",
    expectedTopics: ["contacts", "add", "create"],
    category: "contacts"
  },
  {
    id: 17,
    question: "How do I manage location records?",
    expectedTopics: ["locations", "manage", "records"],
    category: "locations"
  },
  {
    id: 18,
    question: "How do I link premises with license applications?",
    expectedTopics: ["premises", "license", "link", "application"],
    category: "licensing"
  },
  
  // Reporting and audit
  {
    id: 19,
    question: "How do I generate inspection reports?",
    expectedTopics: ["inspection", "reports", "generate"],
    category: "reporting"
  },
  {
    id: 20,
    question: "How do I access the audit trail?",
    expectedTopics: ["audit trail", "access", "tracking"],
    category: "audit"
  }
];

// Function to test a single question
async function testQuestion(question) {
  try {
    console.log(`\n🔍 Testing Question ${question.id}: ${question.question}`);
    
    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: question.question })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    // Analyze response quality
    const analysis = analyzeResponse(data, question);
    
    console.log(`   📊 Confidence: ${data.confidence.toUpperCase()}`);
    console.log(`   📄 Sources: ${data.sources.length}`);
    console.log(`   📝 Answer Length: ${data.answer.length} chars`);
    console.log(`   ⭐ Quality Score: ${analysis.qualityScore}/10`);
    
    if (analysis.qualityScore < 7) {
      console.log(`   ⚠️  Low quality response - needs improvement`);
      console.log(`   🔍 Issues: ${analysis.issues.join(', ')}`);
    }
    
    return {
      question,
      response: data,
      analysis
    };
    
  } catch (error) {
    console.error(`   ❌ Error testing question ${question.id}:`, error.message);
    return {
      question,
      error: error.message,
      analysis: { qualityScore: 0, issues: ['API Error'] }
    };
  }
}

// Function to analyze response quality
function analyzeResponse(response, question) {
  let qualityScore = 10;
  const issues = [];
  
  // Check if answer contains expected topics
  const answerLower = response.answer.toLowerCase();
  const topicsFound = question.expectedTopics.filter(topic => 
    answerLower.includes(topic.toLowerCase())
  ).length;
  
  if (topicsFound === 0) {
    qualityScore -= 4;
    issues.push('No expected topics found');
  } else if (topicsFound < question.expectedTopics.length / 2) {
    qualityScore -= 2;
    issues.push('Few expected topics found');
  }
  
  // Check confidence level
  if (response.confidence === 'low') {
    qualityScore -= 2;
    issues.push('Low confidence');
  } else if (response.confidence === 'medium') {
    qualityScore -= 1;
    issues.push('Medium confidence');
  }
  
  // Check number of sources
  if (response.sources.length === 0) {
    qualityScore -= 3;
    issues.push('No sources');
  } else if (response.sources.length < 3) {
    qualityScore -= 1;
    issues.push('Few sources');
  }
  
  // Check answer length (too short or too long)
  if (response.answer.length < 200) {
    qualityScore -= 2;
    issues.push('Answer too short');
  } else if (response.answer.length > 3000) {
    qualityScore -= 1;
    issues.push('Answer too long');
  }
  
  // Check for "not available" or similar phrases
  if (answerLower.includes('not available') || 
      answerLower.includes('don\'t contain') ||
      answerLower.includes('no information')) {
    qualityScore -= 3;
    issues.push('Contains "not available" phrases');
  }
  
  // Check for software-specific content
  if (!answerLower.includes('click') && 
      !answerLower.includes('navigate') && 
      !answerLower.includes('select') &&
      !answerLower.includes('module')) {
    qualityScore -= 2;
    issues.push('Lacks software-specific instructions');
  }
  
  return {
    qualityScore: Math.max(0, qualityScore),
    issues,
    topicsFound,
    expectedTopics: question.expectedTopics.length
  };
}

// Function to generate summary report
function generateSummaryReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 RAG SYSTEM QUALITY ASSESSMENT SUMMARY');
  console.log('='.repeat(80));
  
  const validResults = results.filter(r => !r.error);
  const avgQualityScore = validResults.reduce((sum, r) => sum + r.analysis.qualityScore, 0) / validResults.length;
  
  const confidenceCounts = {
    high: validResults.filter(r => r.response?.confidence === 'high').length,
    medium: validResults.filter(r => r.response?.confidence === 'medium').length,
    low: validResults.filter(r => r.response?.confidence === 'low').length
  };
  
  const avgSources = validResults.reduce((sum, r) => sum + (r.response?.sources?.length || 0), 0) / validResults.length;
  
  console.log(`\n📈 Overall Performance:`);
  console.log(`   Average Quality Score: ${avgQualityScore.toFixed(1)}/10`);
  console.log(`   Questions Tested: ${testQuestions.length}`);
  console.log(`   Successful Responses: ${validResults.length}`);
  console.log(`   Failed Responses: ${results.length - validResults.length}`);
  
  console.log(`\n🎯 Confidence Distribution:`);
  console.log(`   High Confidence: ${confidenceCounts.high} (${(confidenceCounts.high/validResults.length*100).toFixed(1)}%)`);
  console.log(`   Medium Confidence: ${confidenceCounts.medium} (${(confidenceCounts.medium/validResults.length*100).toFixed(1)}%)`);
  console.log(`   Low Confidence: ${confidenceCounts.low} (${(confidenceCounts.low/validResults.length*100).toFixed(1)}%)`);
  
  console.log(`\n📚 Source Analysis:`);
  console.log(`   Average Sources per Response: ${avgSources.toFixed(1)}`);
  
  console.log(`\n⚠️  Low Quality Responses (Score < 7):`);
  const lowQualityResponses = validResults.filter(r => r.analysis.qualityScore < 7);
  if (lowQualityResponses.length === 0) {
    console.log(`   None - All responses meet quality threshold! 🎉`);
  } else {
    lowQualityResponses.forEach(r => {
      console.log(`   Q${r.question.id}: "${r.question.question}" (Score: ${r.analysis.qualityScore})`);
      console.log(`      Issues: ${r.analysis.issues.join(', ')}`);
    });
  }
  
  console.log(`\n🏆 Best Performing Questions (Score >= 8):`);
  const highQualityResponses = validResults.filter(r => r.analysis.qualityScore >= 8);
  if (highQualityResponses.length === 0) {
    console.log(`   None - System needs significant improvement`);
  } else {
    highQualityResponses.forEach(r => {
      console.log(`   Q${r.question.id}: "${r.question.question}" (Score: ${r.analysis.qualityScore})`);
    });
  }
  
  console.log(`\n🔧 Recommendations:`);
  if (avgQualityScore < 6) {
    console.log(`   🚨 CRITICAL: System needs major improvements`);
    console.log(`   - Review embedding model parameters`);
    console.log(`   - Adjust similarity thresholds`);
    console.log(`   - Enhance prompt engineering`);
  } else if (avgQualityScore < 8) {
    console.log(`   ⚠️  MODERATE: System needs tuning`);
    console.log(`   - Fine-tune search parameters`);
    console.log(`   - Improve source ranking`);
  } else {
    console.log(`   ✅ GOOD: System performing well, minor optimizations possible`);
  }
  
  return {
    avgQualityScore,
    confidenceCounts,
    avgSources,
    lowQualityResponses,
    highQualityResponses,
    validResults
  };
}

// Main test runner
async function runQualityAssessment() {
  console.log('🚀 Starting RAG System Quality Assessment');
  console.log(`📋 Testing ${testQuestions.length} questions...`);
  
  const results = [];
  
  // Test each question with a small delay to avoid overwhelming the API
  for (const question of testQuestions) {
    const result = await testQuestion(question);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate comprehensive report
  const summary = generateSummaryReport(results);
  
  // Save detailed results to file
  const reportPath = path.join(__dirname, 'rag-quality-assessment.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary,
    results
  }, null, 2));
  
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);
  console.log('\n✅ Quality assessment completed!');
  
  return summary;
}

if (require.main === module) {
  runQualityAssessment().catch(console.error);
}

module.exports = { runQualityAssessment, testQuestions };