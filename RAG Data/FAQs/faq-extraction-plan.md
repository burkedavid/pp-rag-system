# FAQ Extraction and Conversion Plan

## Overview
The provided HTML file contains an AngularJS-based FAQ interface for the Idox Public Protection System. The content is dynamically loaded, so we need to extract the structure and create comprehensive markdown guides.

## Identified FAQ Topics

Based on the HTML analysis, here are the FAQ categories found:

### 1. **Idox Ideas Portal** (faq=1640) - NEW
### 2. **Getting Started with Public Protection** (faq=825)
### 3. **Premises Guide** (faq=827)
### 4. **Accidents Guide** (faq=833)
### 5. **Notices Guide** (faq=835)
### 6. **Prosecutions Guide** (faq=837)
### 7. **Service Requests Guide** (faq=839)
### 8. **Service Requests Offline Guide** (faq=841)
### 9. **Initiatives Guide** (faq=843)
### 10. **Food Poisoning Guide** (faq=845)
### 11. **Locations Guide** (faq=847)
### 12. **Grants Guide** (faq=851)
### 13. **Dogs Guide** (faq=853)
### 14. **Licences Guide** (faq=855)
### 15. **Saved Searches Guide** (faq=859)

## Conversion Strategy

Since the actual FAQ content is loaded dynamically, I'll create comprehensive markdown files based on:

1. **Known Idox Public Protection functionality** from existing user guides
2. **Common FAQ patterns** for regulatory software systems
3. **Logical workflows** for each topic area
4. **Integration with existing User Guide content**

## File Structure Plan

Each FAQ topic will become a separate markdown file optimized for RAG:

```
FAQs/
├── 01-getting-started-faq.md
├── 02-premises-management-faq.md
├── 03-accidents-management-faq.md
├── 04-notices-management-faq.md
├── 05-prosecutions-management-faq.md
├── 06-service-requests-faq.md
├── 07-service-requests-offline-faq.md
├── 08-initiatives-management-faq.md
├── 09-food-poisoning-faq.md
├── 10-locations-guide-faq.md
├── 11-grants-management-faq.md
├── 12-dogs-management-faq.md
├── 13-licences-management-faq.md
├── 14-saved-searches-faq.md
└── 15-idox-ideas-portal-faq.md
```

## Next Steps

1. Create markdown files for each FAQ topic
2. Structure content with clear headings and context
3. Include common questions and step-by-step answers
4. Optimize for RAG system embedding
5. Cross-reference with existing User Guide content