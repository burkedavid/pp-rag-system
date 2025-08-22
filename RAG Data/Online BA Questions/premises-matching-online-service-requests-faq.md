# Premises Matching for Online Service Requests - Frequently Asked Questions

## What fields are used for premises matching when someone submits an online service request?

When someone submits an online food business registration (the main type of online service request in the system), the Idox Public Protection System automatically attempts to match their submission to existing premises using comprehensive field matching based on address and business details.

### Primary Matching Fields Used

The system uses these key fields to identify and match premises:

**Address Fields (Most Important for Matching)**
- **Building Number** - The street number or building identifier
- **Street Name** - Full street name for location matching
- **Postcode** - Critical for accurate location identification
- **Building Name** - Additional building identifier when present

**Additional Location Details**
- **Locality** - Local area or district name
- **Town** - Town or city name  
- **County** - County information for regional matching

**Business Information**
- **Premises Name** - Business trading name or premises identifier
- **Any Other Business** - Flag indicating if other businesses operate from the same location

### How Does the Automatic Matching Work?

The system uses a smart hierarchical matching approach with these priority levels:

**1. Exact Match (Highest Priority)**
- Building number + street name + postcode match exactly
- Used when all three core address fields match precisely with existing premises

**2. Close Match (High Priority)**
- Building number + street name + postcode with minor variations
- Allows for small differences in spelling or formatting

**3. Postcode Match (Medium Priority)**
- Postcode-only matching when specific address details don't align
- Useful for finding premises in the same general area

**4. Street Match (Lower Priority)**
- Building number + street name matching
- Used when postcode information is unavailable or doesn't match

### What Additional Information is Captured for Verification?

Beyond the core matching fields, the system also captures these details for validation:

**Contact Information**
- Owner or operator first name and surname
- Owner address details (house number, street, locality, town, county, postcode)
- Contact phone numbers (both landline and mobile)
- Email address

**Business Operating Details**
- Trading days and hours of operation
- Seasonal trading information
- Whether it's a domestic or commercial premises
- Mobile premises indicators (for food vans, etc.)

### What Happens After Someone Submits an Online Request?

**Automatic Processing**
1. System runs through the hierarchical matching algorithm
2. Attempts to find existing premises using the field combinations described above
3. Presents the best match or matches to council officers for validation

**Officer Review Process**
Council officers can then:
- **Review Matches** - See side-by-side comparison of what was submitted versus what the system found
- **Accept Match** - Confirm the automatic match is correct and proceed with the registration
- **Search Override** - Manually search using any combination of the matching fields if the automatic match isn't suitable
- **Create New Premises** - Create a completely new premises record if no suitable match exists

### How Can Applicants Improve Matching Accuracy?

**For People Submitting Online Requests:**
- Provide complete and accurate address information
- Use official street names and building numbers as they appear on post
- Include the correct full postcode
- Enter business name exactly as it appears on official records or signage
- Double-check spelling of all address fields before submitting

**Common Issues That Affect Matching:**
- Using abbreviations instead of full street names (e.g., "St" instead of "Street")
- Missing or incorrect postcode information
- Using informal business names instead of registered trading names
- Incomplete address details for multi-unit buildings

### What Tools Do Council Officers Have for Complex Cases?

**When Automatic Matching Isn't Clear:**
- Manual search functionality using any combination of address fields
- Ability to search by business name, owner name, or contact details
- Side-by-side comparison tools to verify submitted information against existing records
- Options to update existing premises information if details have changed

**For New Businesses:**
- Tools to create new premises records using the submitted information
- Ability to link new premises to existing locations in the address database
- Options to create new contact records for business owners/operators
- Workflow to generate initial inspection schedules for new food businesses

### Why Is Accurate Premises Matching Important?

**For Food Safety:**
- Ensures inspection history is properly maintained
- Links food safety ratings to the correct premises
- Maintains accurate records for enforcement actions
- Supports proper risk assessment and inspection scheduling

**For Business Operators:**
- Prevents duplicate registrations for the same premises
- Ensures existing compliance history is recognized
- Maintains continuity of food safety ratings
- Reduces administrative burden on businesses

**For Council Officers:**
- Provides complete operational history for each premises
- Supports efficient inspection planning and resource allocation
- Ensures regulatory compliance reporting is accurate
- Maintains data quality across the entire system

### What Types of Online Service Requests Use This Matching?

The premises matching system is primarily used for:
- **Food Business Registrations** - New food businesses registering with the local authority
- **Changes to Existing Registrations** - Updates to business details, ownership, or operations
- **Seasonal Business Notifications** - Temporary or seasonal food operations

The system ensures that whether someone is starting a new business, taking over an existing one, or making changes to their operations, their online submission is accurately linked to the right premises record in the council's database.

This comprehensive matching system balances automation for efficiency with human oversight for accuracy, ensuring that online service requests are processed correctly while maintaining the integrity of the council's premises and food safety databases.