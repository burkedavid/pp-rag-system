const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Simple HTTP-based navigation extractor as fallback
 * This can work in WSL without browser dependencies
 */

const IDOX_URL = 'https://pp-idoxqa-automation.staging.idoxcloud.com/';

class SimpleNavigationExtractor {
  constructor() {
    this.cookies = [];
  }

  async extractNavigation() {
    console.log('🔍 Simple navigation extraction (HTTP-based fallback)');
    console.log('⚠️  Note: This method has limitations compared to browser automation');
    
    try {
      // First, fetch the login page
      console.log('📄 Fetching login page...');
      const loginPageHtml = await this.fetchPage(IDOX_URL);
      
      // Save for debugging
      fs.writeFileSync('screenshots/login-page-source.html', loginPageHtml);
      console.log('💾 Login page HTML saved to screenshots/login-page-source.html');
      
      // Try to extract form details and any visible navigation
      const navigationElements = this.extractNavigationFromHtml(loginPageHtml);
      
      // Generate basic documentation based on what we can extract
      const documentation = this.generateDocumentation(navigationElements, loginPageHtml);
      
      // Save the documentation
      const outputPath = path.join(__dirname, '../RAG Data/Generated-Navigation');
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
      
      fs.writeFileSync(
        path.join(outputPath, 'Simple-Navigation-Analysis.md'),
        documentation
      );
      
      console.log('✅ Simple navigation analysis completed');
      console.log('📁 Check RAG Data/Generated-Navigation/Simple-Navigation-Analysis.md');
      
      return navigationElements;
      
    } catch (error) {
      console.error('❌ Simple extraction failed:', error.message);
      throw error;
    }
  }

  fetchPage(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      };
      
      if (this.cookies.length > 0) {
        options.headers.Cookie = this.cookies.join('; ');
      }
      
      const req = client.get(url, options, (res) => {
        let data = '';
        
        // Handle cookies
        if (res.headers['set-cookie']) {
          this.cookies = this.cookies.concat(res.headers['set-cookie'].map(cookie => cookie.split(';')[0]));
        }
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve(data);
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  extractNavigationFromHtml(html) {
    const elements = {
      links: [],
      forms: [],
      scripts: [],
      navigation: []
    };
    
    console.log('🔍 Analyzing HTML structure...');
    
    // Extract links
    const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      const href = linkMatch[1];
      const text = linkMatch[2].trim();
      
      if (text && text.length > 0 && !text.includes('<')) {
        elements.links.push({
          href: href,
          text: text
        });
      }
    }
    
    // Extract form fields
    const inputRegex = /<input[^>]*name=["']([^"']*)["'][^>]*>/gi;
    let inputMatch;
    while ((inputMatch = inputRegex.exec(html)) !== null) {
      elements.forms.push({
        name: inputMatch[1],
        type: 'input'
      });
    }
    
    // Look for navigation patterns
    const navPatterns = [
      /<nav[^>]*>(.*?)<\/nav>/gis,
      /<div[^>]*class="[^"]*nav[^"]*"[^>]*>(.*?)<\/div>/gis,
      /<ul[^>]*class="[^"]*nav[^"]*"[^>]*>(.*?)<\/ul>/gis
    ];
    
    navPatterns.forEach(pattern => {
      let navMatch;
      while ((navMatch = pattern.exec(html)) !== null) {
        const navContent = navMatch[1];
        
        // Extract links within navigation
        let navLinkMatch;
        while ((navLinkMatch = linkRegex.exec(navContent)) !== null) {
          const href = navLinkMatch[1];
          const text = navLinkMatch[2].trim();
          
          if (text && !elements.navigation.some(n => n.text === text)) {
            elements.navigation.push({
              href: href,
              text: text,
              context: 'navigation'
            });
          }
        }
      }
    });
    
    console.log(`📊 Extracted: ${elements.links.length} links, ${elements.forms.length} form fields, ${elements.navigation.length} nav items`);
    
    return elements;
  }

  generateDocumentation(elements, html) {
    const doc = `# Simple Idox Navigation Analysis

> **Note**: This analysis is based on HTTP requests only and has limitations compared to full browser automation.

## Generated: ${new Date().toLocaleString()}

## System Information
- **URL**: ${IDOX_URL}
- **Method**: HTTP-based HTML analysis
- **Limitations**: Cannot interact with JavaScript, may miss dynamic content

## Analysis Results

### Form Fields Found
${elements.forms.length > 0 
  ? elements.forms.map(field => `- **${field.name}**: ${field.type} field`).join('\n')
  : '- No form fields found'
}

### Navigation Elements
${elements.navigation.length > 0
  ? elements.navigation.map(nav => `- **${nav.text}**${nav.href ? ` (${nav.href})` : ''}`).join('\n')
  : '- No navigation elements found'
}

### All Links Found
${elements.links.slice(0, 20).map(link => `- **${link.text}**${link.href ? ` (${link.href})` : ''}`).join('\n')}
${elements.links.length > 20 ? `\n... and ${elements.links.length - 20} more links` : ''}

## Recommendations

### For Full Navigation Documentation:
1. **Use Browser Automation**: Run the full Playwright script on a system with browser support
2. **Manual Documentation**: Use the manual template provided
3. **Hybrid Approach**: Combine this analysis with manual exploration

### Possible Navigation Patterns:
Based on typical web applications and the links found, the Idox system likely has:
- Top-level modules accessible after login
- Left navigation menus within each module
- Create/Edit forms for different record types
- Search and reporting functionality

### Next Steps:
1. Run the full Playwright script: \`node scripts/document-idox-navigation.js\`
2. Or use Docker: \`./scripts/run-with-docker.sh\`
3. Or document manually using the template

## Technical Analysis

### HTML Structure Indicators
${html.includes('bootstrap') ? '- Uses Bootstrap CSS framework' : ''}
${html.includes('jquery') ? '- Uses jQuery JavaScript library' : ''}
${html.includes('angular') ? '- Uses Angular framework' : ''}
${html.includes('react') ? '- Uses React framework' : ''}
${html.includes('vue') ? '- Uses Vue.js framework' : ''}
${html.includes('nav') ? '- Contains navigation elements' : ''}
${html.includes('menu') ? '- Contains menu elements' : ''}
${html.includes('dashboard') ? '- Has dashboard functionality' : ''}

### Security Features
${html.includes('csrf') ? '- Uses CSRF protection' : ''}
${html.includes('token') ? '- Uses token-based authentication' : ''}
${html.includes('captcha') ? '- May include CAPTCHA' : ''}

---

*This is a basic analysis. For complete navigation documentation, use browser automation tools.*
`;

    return doc;
  }
}

// Run the simple extraction
async function main() {
  const extractor = new SimpleNavigationExtractor();
  await extractor.extractNavigation();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SimpleNavigationExtractor };