# Idox Navigation Standards - Based on RAG Analysis

> **Analysis Source**: This content is based on comprehensive analysis of existing RAG documentation patterns and identified best practices.

## Current Navigation Pattern Analysis

### Verified Content Pattern (GOOD)
```
Navigate to **Licensing** → **Create Application**
Navigate to **Contacts** → **Create Contact**  
Navigate to **Food Poisonings** → **Create Food Poisoning**
```

### How-To Guide Pattern (NEEDS IMPROVEMENT)
```
From the main navigation bar, click **'Licensing'**
In the left-hand menu, click **'Create Application'**
```

## Standardized Navigation Format

**Recommended Format**: **Module** → **Sub-section** → **Action**

### Examples of Improved Navigation
```
❌ AVOID: "From the main navigation bar, click 'Grants', then in the left-hand menu, click 'Create Grant'"
✅ USE: "Navigate to **Grants** → **Create Grant**"

❌ AVOID: "Select appropriate premises from search results"  
✅ USE: "Select premises matching the business name and address details provided"

❌ AVOID: "In the left-hand navigation menu within the case"
✅ USE: "Within the case record → **Communications** tab"
```

## Enhanced Navigation Guidance Requirements

### 1. Consistent Arrow Notation
- Use `→` to show navigation paths
- Bold format for UI elements: `**Module Name**`
- Consistent terminology across all documentation

### 2. Context-Aware Navigation
```
❌ BASIC: "Navigate to Licensing"
✅ ENHANCED: "Navigate to **Licensing** → **Create Application** to begin the license application process"
```

### 3. Selection Criteria
```
❌ VAGUE: "Select appropriate contact"
✅ SPECIFIC: "Select contact matching the applicant's name and address details"
```

### 4. Form Structure Previews
```
❌ INCOMPLETE: "Complete the form"
✅ COMPLETE: "This opens a form with sections: **Applicant Details**, **Property Information**, **Grant Specifications**"
```

### 5. Breadcrumb Context
```
❌ NO CONTEXT: "Click Add Communication"
✅ WITH CONTEXT: "Within Application #LA-2024-001 → **Communications** tab → Click **Add Communication**"
```

## Module-Specific Navigation Patterns

Based on RAG analysis, here are the documented navigation patterns:

### Contacts Module
```
Navigate to **Contacts** → **Create Contact** to add new contact records
```

### Licensing Module  
```
Navigate to **Licensing** → **Create Application** to begin license applications
```

### Food Safety Module
```
Navigate to **Food Poisonings** → **Create Food Poisoning** to manage investigation cases
```

### Enforcement Actions
```
Navigate to any case record → **Actions** tab → **Add Action** to create enforcement actions
```

## Field and Form Documentation Standards

### Field Naming
- Use exact field names from system: **License Description**, **Manual Reference**
- Include field types where relevant: **Area** (dropdown), **Received Date** (date picker)

### Form Sections
- Document tab structure: **Applicant Details** tab, **Property Details** tab
- Include required vs optional field indicators
- Note validation requirements where applicable

### Button Naming
- Use exact button text: **Create Grant**, **Save**, **Update**, **Add Communication**
- Include button context: Click **Save** to create the grant record

## Workflow Documentation Standards

### Step-by-Step Format
```
## How to Create [Record Type]

### Step 1: Navigate to Creation Screen
1. Navigate to **[Module]** → **[Sub-section]**
2. Click **[Button Name]** button

### Step 2: Complete Form Sections
1. **[Tab Name]** tab:
   - **[Field Name]**: [Purpose/instructions]
   - **[Field Name]**: [Purpose/instructions]
2. **[Tab Name]** tab:
   - [Continue with fields...]

### Step 3: Save and Complete
1. Click **[Save Button Name]** to create the record
2. System will [expected behavior]
```

## Integration with RAG System

### Claude Prompt Enhancements Needed
1. Enforce arrow notation: `Module → Section → Action`
2. Require breadcrumb context for multi-step processes
3. Mandate specific selection criteria (not vague terms)
4. Include form structure previews when available
5. Use consistent UI element formatting

### Response Quality Requirements
- Every navigation instruction must use standardized format
- Include context about current location/screen
- Provide specific selection criteria for searches
- Show form structure overview when documenting create processes
- Use exact UI element names from documentation

This standards document will guide the creation of 100% accurate navigation documentation and immediate improvements to the RAG response quality.