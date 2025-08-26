# Trading Standards CACS and Citizens Advice Imports - Frequently Asked Questions

## How do Trading Standards imports from CACS and Citizens Advice come into our system?

**Based on analysis of the Idox Public Protection System source code, both CACS (Citizens Advice Consumer Service) and Citizens Advice data import through the same Trading Standards Import function. CACS is the technical name for the Citizens Advice Consumer Service system, so they are actually the same data source providing consumer complaints and referrals to Trading Standards teams.**

### What the Source Code Analysis Revealed

**Single Import System for Both Sources**
The system has one unified import process that handles:
- **CACS Data** - Citizens Advice Consumer Service complaint records
- **Citizens Advice Data** - Consumer referrals and notifications from Citizens Advice Bureaux
- **Import Format** - XML files containing structured complaint and case information

**Import Process Overview**
Officers can access the Trading Standards Importer through the Management section to upload XML files containing consumer complaint data from Citizens Advice systems.

### How Trading Standards Imports Work

**Step-by-Step Import Process**

**1. Access the Import Function**
- Navigate to Management Information in your system
- Select "Trading Standards Importer"
- This opens the file upload interface for XML imports

**2. Upload Consumer Data Files**
- **File Format** - XML files provided by Citizens Advice Consumer Service
- **File Content** - Consumer complaints, trader details, case information
- **Custodian Code** - Select your local authority code or use "Auto Detect"

**3. Automatic Data Processing**
- **Consumer Details** - Names, addresses, contact information extracted
- **Trader Information** - Business names, addresses, trading details processed  
- **Case Details** - Purchase dates, amounts, product/service information imported
- **Complaint Codes** - CACS complaint classification codes mapped to system

**4. Service Request Creation**
- **New Cases** - Each complaint becomes a Trading Standards service request
- **Duplicate Detection** - System checks for existing cases to avoid duplicates
- **Contact Matching** - Attempts to match consumers and traders with existing contacts
- **Premise Linking** - Links trader information to known business premises where possible

### Types of Data Imported from Citizens Advice

**Consumer Complaint Information**
- **Trader Complaints** - Issues with businesses (no breach, civil breach, criminal breach)
- **Consumer Enquiries** - Requests for advice about consumer law and rights
- **Pre-shopping Advice** - Guidance on choosing traders and making purchases
- **Agency Referrals** - Cases referred to or from other agencies

**Case Classification Types**
The system processes various CACS codes including:
- Trader complaint categories (no breach, civil breach, criminal breach)
- Consumer law enquiries and advice requests  
- Leaflet requests and information provision
- Third party organisation referrals
- Feedback on Consumer Direct services

**Referral and Notification Types**
- **Notifications** - Information sharing about traders or issues
- **Referrals** - Cases transferred to Trading Standards for investigation
- **Signposting** - Direction to appropriate agencies or services

### What Happens After Import

**Automatic System Integration**
- **Service Requests Created** - Each case becomes a trackable service request
- **Officer Assignment** - Cases assigned to appropriate Trading Standards officers
- **Contact Records** - Consumer and trader contact details added to system
- **File Attachments** - Original XML files attached as evidence
- **Action Planning** - Initial actions created based on case type and advice given

**Case Management Features**
- **Progress Tracking** - Cases move through standard Trading Standards workflows
- **Evidence Management** - All imported information becomes part of case evidence
- **Communication Records** - Advice given and actions taken recorded in case history
- **Reporting Integration** - Imported cases included in Trading Standards performance statistics

### Benefits of Automated Import System

**Efficiency Improvements**
- **No Manual Entry** - Consumer complaint details automatically imported
- **Reduced Errors** - Eliminates manual transcription mistakes
- **Faster Response** - Cases available immediately for officer action
- **Complete Records** - All Citizens Advice interaction history preserved

**Better Case Management**
- **Consistent Data** - Standardized information format across all imported cases
- **Duplicate Prevention** - System checks prevent duplicate case creation
- **Contact Integration** - Links with existing consumer and trader records
- **Evidence Preservation** - Original complaint files maintained as case evidence

**Topic Area:** trading_standards_cacs_imports

**Last Updated:** 2025-08-26