# Online Request Premises Matching Fields - Frequently Asked Questions

## What fields are checked when the system tries to match an online request to a premises?

When someone submits an online food business registration, the Idox Public Protection System automatically checks multiple fields to find the best match with existing premises in the database. The system uses a sophisticated approach that examines different combinations of information to ensure accurate matching while handling variations in how people enter address details.

### Primary Fields the System Checks First

**Core Address Information**
The system prioritizes these essential address fields that are most reliable for identifying premises:

- **Building Number** - The street number that identifies the specific property
- **Street Name** - The full street name where the premises is located
- **Postcode** - The postal code which provides precise geographic location
- **Building Name** - Named buildings, houses, or commercial properties (when provided)

**Business Identification Details**
Beyond addresses, the system also checks:
- **Premises Name** - The business name or trading name associated with the location
- **Business Type Indicators** - Whether other businesses operate from the same premises

### How the System Checks These Fields in Different Combinations

**Exact Match Process (Highest Confidence)**
The system first tries to find premises where:
- Building number exactly matches an existing premises
- Street name exactly matches (accounting for minor spelling differences)
- Postcode exactly matches
- All three core fields align perfectly with a single premises record

**Flexible Matching Process (High Confidence)**
When exact matching doesn't work, the system tries:
- Building number and street name with postcode variations
- Same core address fields but allowing for minor spelling differences
- Different formatting of the same address (e.g., "High Street" vs "High St")

**Area-Based Matching (Medium Confidence)**
For broader matching when specific addresses don't align:
- Postcode-only matching to find premises in the same postal area
- Street name matching within the same general location
- Business name matching for known premises with address variations

**Partial Address Matching (Lower Confidence)**
When other methods don't work, the system tries:
- Building number and street name without postcode verification
- Street name matching with different building numbers (for address ranges)
- Business name matching across different address formats

### Additional Verification Fields the System Considers

**Contact Information Cross-Checking**
To help validate potential matches, the system also examines:

- **Owner/Operator Names** - First name and surname of the person responsible for the business
- **Contact Address** - The home or business address of the owner/operator
- **Phone Numbers** - Both landline and mobile numbers for verification
- **Email Addresses** - Contact email for the business or owner

**Business Operation Details**
The system may also check:
- **Trading Hours** - Days and times of operation
- **Seasonal Information** - Whether the business operates seasonally
- **Premises Type** - Whether it's domestic, commercial, mobile, etc.
- **Other Business Activity** - Whether multiple businesses operate from the same location

### What Happens During the Matching Check Process?

**Step-by-Step System Process**

1. **Initial Exact Search**
   - System looks for premises with identical building number, street name, and postcode
   - If found, presents this as the primary match for officer review

2. **Flexible Address Search**
   - If exact match fails, system searches with variations in spelling and formatting
   - Accounts for common abbreviations and alternative street name formats

3. **Postcode Area Search**
   - System searches all premises within the same postcode area
   - Looks for similar building numbers and street names in that area

4. **Business Name Validation**
   - Cross-references business names with any potential address matches
   - Helps distinguish between different businesses at similar addresses

5. **Contact Detail Verification**
   - Compares owner/operator information with existing records
   - Helps validate whether it's the same business with updated details or a new business

### How Address Variations Are Handled

**Common Address Format Differences**
The system is designed to handle typical variations such as:

- **Street Name Abbreviations** - "Street" vs "St", "Road" vs "Rd", "Avenue" vs "Ave"
- **Building Name Variations** - "The Red Lion" vs "Red Lion", "McDonald's" vs "McDonalds"
- **Number Formats** - "12A" vs "12a", "Unit 5" vs "5", "Flat 2" vs "2"
- **Spelling Variations** - Minor misspellings or alternative spellings of street names

**Postcode Flexibility**
- **Full Postcodes** - Matches using complete postcodes when available
- **Partial Postcodes** - Uses area codes when full postcodes don't match
- **Invalid Postcodes** - Falls back to street and area matching when postcodes are wrong

### What Field Combinations Produce the Most Reliable Matches?

**Highest Reliability Combinations**
These field combinations typically produce the most accurate matches:

1. **Building Number + Street Name + Postcode** - Most reliable for unique identification
2. **Business Name + Postcode** - Good for distinctively named businesses
3. **Full Address + Owner Name** - Excellent for verification of existing businesses

**Moderate Reliability Combinations**
These combinations require officer verification but are still useful:

1. **Street Name + Postcode** - Useful for short streets with few premises
2. **Building Number + Street Name** - Good when postcode is unavailable or incorrect
3. **Business Name + Street Name** - Helpful for well-known local businesses

**Lower Reliability Combinations**
These combinations typically need manual review and validation:

1. **Postcode Only** - May return multiple possible matches
2. **Business Name Only** - Could match businesses with multiple locations
3. **Street Name Only** - Too broad for reliable automated matching

### How Officers Review the Matching Results

**What Officers See During Validation**
When reviewing potential matches, officers can see:

- **Side-by-Side Comparison** - Submitted information next to the potential match
- **Confidence Level** - How closely the submitted details match existing records
- **Alternative Matches** - Other possible premises if the primary match is uncertain
- **Missing Information** - Fields where submitted data doesn't match existing records

**Officer Decision Options**
Based on the field matching results, officers can:

- **Accept the Match** - Confirm the automatic match is correct
- **Select Different Match** - Choose a different premises from the alternatives
- **Manual Search** - Search using different field combinations
- **Create New Premises** - Register entirely new premises if no match is suitable

### What Causes Matching Difficulties?

**Common Field-Related Issues**

**Address Data Problems**
- **Incomplete Addresses** - Missing building numbers, street names, or postcodes
- **Incorrect Information** - Wrong postcodes or misspelled street names
- **Changed Addresses** - Street names or numbering that has changed since premises was registered
- **Unofficial Addresses** - Addresses that don't match official postal records

**Business Information Issues**
- **Multiple Business Names** - Businesses operating under different names than registered
- **New Ownership** - Same premises but different owner information
- **Franchise Operations** - Local business names vs corporate registered names

**Data Entry Variations**
- **Formatting Differences** - Different ways of writing the same address
- **Abbreviation Use** - Mixing full names and shortened versions
- **Case Sensitivity** - Upper case, lower case, and mixed case variations

### How to Improve Matching Success Rates

**For Online Applicants**
To help ensure accurate matching, applicants should:

- **Use Official Addresses** - Enter addresses exactly as they appear on official documents
- **Include Full Postcodes** - Always provide complete, accurate postcodes
- **Check Spelling Carefully** - Verify street names and building names are correct
- **Use Registered Business Names** - Enter the official business name, not informal trading names

**For System Administrators**
To improve overall matching performance:

- **Maintain Data Quality** - Regularly review and update existing premises address information
- **Standardize Formats** - Ensure consistent address formatting across all premises records
- **Update Changed Addresses** - Keep premises records current when street names or numbers change
- **Monitor Matching Patterns** - Review frequently unmatched submissions for common issues

### What Information Gets Stored After Matching?

**Matched Record Information**
When a successful match is made, the system stores:
- **Link to Existing Premises** - Connection between the online submission and premises record
- **Matching Fields Used** - Which combination of fields produced the successful match
- **Validation History** - Officer decisions and any manual adjustments made
- **Contact Updates** - Any new or corrected contact information from the submission

**Quality Assurance Data**
The system also maintains:
- **Match Confidence Scores** - How closely the submitted fields matched existing data
- **Alternative Matches Considered** - Other possible premises that were evaluated
- **Officer Notes** - Any comments or observations made during the validation process
- **Data Source Information** - Whether the match came from automatic processing or manual selection

This comprehensive field-checking process ensures that online food business registrations are accurately linked to the correct premises while providing flexibility to handle the natural variations in how people describe addresses and business information.