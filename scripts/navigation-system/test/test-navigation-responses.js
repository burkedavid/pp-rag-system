const { hybridSearch } = require('../src/lib/database');
const { generateRAGResponse } = require('../src/lib/claude');
const { generateEmbedding } = require('../src/lib/embeddings');

/**
 * Test script to validate improved navigation responses
 */

const NAVIGATION_TEST_QUERIES = [
  // Basic navigation queries
  'How do I access the Licensing module?',
  'Where do I find the Create Contact button?',
  'How do I navigate to create a new license application?',
  
  // Specific workflow queries
  'How do I create a new contact record?',
  'What are the steps to create a license application?',
  'How do I add a new premises record?',
  
  // UI element queries
  'What buttons are available in the Licensing module?',
  'What menu options are in the left navigation?',
  'How do I save a new record?',
  
  // Form and field queries
  'What fields are required when creating a contact?',
  'What information do I need for a license application?',
  'How do I complete the application form?'
];

class NavigationResponseTester {
  constructor() {
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🧪 Testing improved navigation responses...');
    console.log(`📋 Running ${NAVIGATION_TEST_QUERIES.length} test queries`);
    console.log('');

    for (let i = 0; i < NAVIGATION_TEST_QUERIES.length; i++) {
      const query = NAVIGATION_TEST_QUERIES[i];
      console.log(`🔍 Test ${i + 1}/${NAVIGATION_TEST_QUERIES.length}: "${query}"`);
      
      try {
        const result = await this.testNavigationQuery(query);
        this.testResults.push(result);
        
        this.displayTestResult(result);
        console.log(''); // Add spacing between tests
        
      } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        this.testResults.push({
          query,
          success: false,
          error: error.message
        });
      }
    }

    this.displaySummary();
  }

  async testNavigationQuery(query) {
    const startTime = Date.now();
    
    // Generate embedding and search
    const queryEmbedding = await generateEmbedding(query);
    const searchResults = await hybridSearch(queryEmbedding, query, 5);
    
    // Generate RAG response
    const ragResponse = await generateRAGResponse(query, searchResults);
    
    const duration = Date.now() - startTime;
    
    // Analyze the response quality
    const analysis = this.analyzeNavigationResponse(query, ragResponse, searchResults);
    
    return {
      query,
      response: ragResponse.answer,
      confidence: ragResponse.confidence,
      sourceCount: ragResponse.sources.length,
      verifiedSourceCount: searchResults.filter(s => 
        s.source_file.includes('Verified') || 
        s.metadata?.document_type === 'verified_navigation'
      ).length,
      duration,
      analysis,
      success: true,
      sources: ragResponse.sources
    };
  }

  analyzeNavigationResponse(query, ragResponse, searchResults) {
    const response = ragResponse.answer;
    const analysis = {
      score: 0,
      feedback: [],
      hasNavigationPath: false,
      hasSpecificUIElements: false,
      hasStandardizedFormat: false,
      hasVerifiedSources: false
    };

    // Check for navigation path format (Module → Section)
    if (response.includes('→') || response.includes('Navigate to')) {
      analysis.hasNavigationPath = true;
      analysis.score += 25;
      analysis.feedback.push('✅ Contains navigation path');
    } else {
      analysis.feedback.push('❌ Missing navigation path format');
    }

    // Check for specific UI elements (bold formatting)
    const boldElements = (response.match(/\*\*[^*]+\*\*/g) || []).length;
    if (boldElements >= 2) {
      analysis.hasSpecificUIElements = true;
      analysis.score += 25;
      analysis.feedback.push(`✅ Contains ${boldElements} specific UI elements`);
    } else {
      analysis.feedback.push('❌ Insufficient specific UI elements');
    }

    // Check for standardized format
    const hasStandardFormat = response.includes('Navigate to **') && 
                             (response.includes('** → **') || response.includes('**→**'));
    if (hasStandardFormat) {
      analysis.hasStandardizedFormat = true;
      analysis.score += 25;
      analysis.feedback.push('✅ Uses standardized navigation format');
    } else {
      analysis.feedback.push('❌ Does not use standardized format');
    }

    // Check for verified sources
    const verifiedSources = searchResults.filter(s => 
      s.source_file.includes('Verified') || 
      s.metadata?.document_type === 'verified_navigation'
    ).length;
    
    if (verifiedSources > 0) {
      analysis.hasVerifiedSources = true;
      analysis.score += 25;
      analysis.feedback.push(`✅ Uses ${verifiedSources} verified navigation sources`);
    } else {
      analysis.feedback.push('❌ No verified navigation sources used');
    }

    return analysis;
  }

  displayTestResult(result) {
    if (!result.success) {
      console.log(`❌ Test failed: ${result.error}`);
      return;
    }

    console.log(`📊 Confidence: ${result.confidence} | Sources: ${result.sourceCount} | Verified: ${result.verifiedSourceCount} | Duration: ${result.duration}ms`);
    console.log(`🎯 Quality Score: ${result.analysis.score}/100`);
    
    // Display analysis feedback
    result.analysis.feedback.forEach(feedback => {
      console.log(`   ${feedback}`);
    });

    // Show navigation excerpts if good score
    if (result.analysis.score >= 75) {
      const navPaths = result.response.match(/Navigate to \*\*[^*]+\*\*.*?\*\*[^*]+\*\*/g);
      if (navPaths) {
        console.log(`📍 Navigation: ${navPaths[0]}`);
      }
    }

    // Show top sources
    if (result.sources.length > 0) {
      const topSource = result.sources[0];
      console.log(`📚 Top Source: ${topSource.source_file} (${(topSource.similarity * 100).toFixed(1)}%)`);
    }
  }

  displaySummary() {
    console.log('🎉 Navigation Response Testing Complete!');
    console.log('');
    
    const successful = this.testResults.filter(r => r.success);
    const failed = this.testResults.filter(r => !r.success);
    
    console.log(`📊 Overall Results:`);
    console.log(`   ✅ Successful: ${successful.length}/${this.testResults.length}`);
    console.log(`   ❌ Failed: ${failed.length}/${this.testResults.length}`);
    
    if (successful.length > 0) {
      const avgScore = successful.reduce((sum, r) => sum + r.analysis.score, 0) / successful.length;
      const avgConfidence = successful.filter(r => r.confidence).length;
      const avgVerifiedSources = successful.reduce((sum, r) => sum + r.verifiedSourceCount, 0) / successful.length;
      
      console.log(`\n📊 Summary Results:`);
      console.log(`📈 Quality Metrics:`);
      console.log(`   🎯 Average Quality Score: ${avgScore.toFixed(1)}/100`);
      console.log(`   🎯 High Confidence Responses: ${avgConfidence}/${successful.length}`);
      console.log(`   📚 Average Verified Sources: ${avgVerifiedSources.toFixed(1)}`);
      
      // Quality breakdown
      const qualityCategories = {
        hasNavigationPath: 'Navigation Path Format',
        hasSpecificUIElements: 'Specific UI Elements', 
        hasStandardizedFormat: 'Standardized Format',
        hasVerifiedSources: 'Verified Sources'
      };
      
      console.log(`');
      console.log(`🔍 Quality Breakdown:`);
      Object.entries(qualityCategories).forEach(([key, label]) => {
        const count = successful.filter(r => r.analysis[key]).length;
        const percentage = ((count / successful.length) * 100).toFixed(1);
        console.log(`   ${count >= successful.length * 0.8 ? '✅' : '⚠️'} ${label}: ${count}/${successful.length} (${percentage}%)`);
      });
    }

    if (failed.length > 0) {
      console.log(`');
      console.log(`❌ Failed Tests:`);
      failed.forEach((result, i) => {
        console.log(`   ${i + 1}. "${result.query}" - ${result.error}`);
      });
    }

    // Recommendations
    console.log(`');
    console.log(`💡 Recommendations:`);
    
    const lowNavPath = successful.filter(r => !r.analysis.hasNavigationPath).length;
    const lowUIElements = successful.filter(r => !r.analysis.hasSpecificUIElements).length;
    const lowStandardFormat = successful.filter(r => !r.analysis.hasStandardizedFormat).length;
    const lowVerifiedSources = successful.filter(r => !r.analysis.hasVerifiedSources).length;
    
    if (lowNavPath > 0) {
      console.log(`   📍 Add more navigation path examples to RAG data`);
    }
    if (lowUIElements > 0) {
      console.log(`   🔘 Include more specific UI element names in documentation`);
    }
    if (lowStandardFormat > 0) {
      console.log(`   📏 Enforce standardized navigation format in Claude prompt`);
    }
    if (lowVerifiedSources > 0) {
      console.log(`   ✅ Increase priority of verified navigation sources`);
    }
    
    if (avgScore >= 80) {
      console.log(`   🎉 Navigation guidance is performing well!`);
    } else if (avgScore >= 60) {
      console.log(`   ⚠️ Navigation guidance needs improvement`);
    } else {
      console.log(`   🚨 Navigation guidance requires significant work`);
    }
  }
}

// Run the tests
async function main() {
  const tester = new NavigationResponseTester();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { NavigationResponseTester };