# Running the Idox Navigation Documentation Script

## Prerequisites

You need a system with proper browser dependencies. This can be:
1. Your local Windows/Mac machine
2. A Linux system with GUI capabilities
3. A Docker container with browser support

## Installation Steps

### Option 1: Local Machine (Recommended)

1. **Clone the repository** (if not already):
   ```bash
   git clone [your-repo-url]
   cd pp-rag-system
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install playwright @playwright/test
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

4. **Install system dependencies** (Linux only):
   ```bash
   sudo npx playwright install-deps
   ```

5. **Run the documentation script**:
   ```bash
   node scripts/document-idox-navigation.js
   ```

### Option 2: Docker Container

1. **Create a Dockerfile**:
   ```dockerfile
   FROM mcr.microsoft.com/playwright:v1.40.0-focal
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   
   COPY scripts/ ./scripts/
   COPY . .
   
   CMD ["node", "scripts/document-idox-navigation.js"]
   ```

2. **Build and run**:
   ```bash
   docker build -t idox-documenter .
   docker run -v $(pwd)/RAG\ Data:/app/RAG\ Data -v $(pwd)/screenshots:/app/screenshots idox-documenter
   ```

### Option 3: GitHub Actions (Automated)

Create `.github/workflows/document-navigation.yml`:

```yaml
name: Document Idox Navigation
on:
  workflow_dispatch: # Manual trigger
  schedule:
    - cron: '0 6 * * 1' # Weekly on Monday

jobs:
  document:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          npm install playwright @playwright/test
          npx playwright install --with-deps
          
      - name: Run documentation script
        run: node scripts/document-idox-navigation.js
        
      - name: Upload documentation
        uses: actions/upload-artifact@v4
        with:
          name: idox-navigation-docs
          path: |
            RAG Data/Generated-Navigation/
            screenshots/
            
      - name: Commit updated documentation
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add RAG\ Data/Generated-Navigation/
          git commit -m "Update Idox navigation documentation" || exit 0
          git push
```

## Expected Output

When the script runs successfully, it will generate:

### 1. Navigation Data Files
- `RAG Data/Generated-Navigation/navigation-data.json` - Raw JSON data
- `RAG Data/Generated-Navigation/Idox-Navigation-Verified.md` - Formatted RAG documentation

### 2. Screenshots
- `screenshots/01-logged-in.png` - Main dashboard after login
- `screenshots/module-[name].png` - Each module interface
- `screenshots/workflow-[action].png` - Create workflow screens

### 3. Console Output
```
🚀 Initializing browser...
🔐 Logging into Idox system...
📍 Current URL after login: https://pp-idoxqa-automation.staging.idoxcloud.com/dashboard
📊 Documenting top navigation modules...
✅ Found 8 elements with selector: .navbar .nav-item
📋 Top modules found: ['Home', 'Licensing', 'Contacts', 'Premises', 'Inspections', 'Reports', 'Admin', 'Help']
🔍 Documenting module structure for: Licensing
📋 Licensing left menu items: ['Create Application', 'Search Applications', 'Manage Templates', 'Reports']
[Continue for each module...]
🛠️ Documenting common create workflows...
📝 Documenting workflow for: Create Contact
📄 Generating comprehensive navigation documentation...
✅ Documentation generated successfully!
📁 Files saved to: RAG Data/Generated-Navigation/
🎉 Navigation documentation completed successfully!
📊 Summary:
   - Top Modules: 8
   - Module Structures: 8
   - Workflows: 10
```

## Troubleshooting

### Common Issues

**Browser Launch Failed**:
```bash
# Install missing dependencies
sudo npx playwright install-deps

# Or install specific packages
sudo apt-get install libnspr4 libnss3 libasound2
```

**Login Failed**:
- Check if the credentials are still valid
- Verify the URL is accessible
- Check for CAPTCHA or additional security measures

**Network Issues**:
- Ensure the system can access the Idox URL
- Check firewall settings
- Verify VPN/proxy configuration if needed

## Next Steps After Running

Once the script completes successfully:

1. **Review the generated documentation**:
   - Check `RAG Data/Generated-Navigation/Idox-Navigation-Verified.md`
   - Verify the navigation paths look accurate
   - Review the screenshots for visual confirmation

2. **Integrate with RAG system**:
   ```bash
   # Process the new documentation into embeddings
   node scripts/ingest-verified-navigation.js
   
   # Update the Claude prompt with verified patterns
   node scripts/update-claude-prompt.js
   
   # Test the improved navigation responses
   node scripts/test-navigation-responses.js
   ```

3. **Validate the improvements**:
   - Test queries about navigation in your RAG interface
   - Verify responses now include exact UI element names
   - Confirm navigation paths use the standardized format

The generated documentation will provide 100% accurate navigation guidance for your RAG system!