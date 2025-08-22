# Online Request Premises Matching Process - Frequently Asked Questions

## How does an online request match to a premises in the system?

When someone submits an online food business registration through the Idox Public Protection System, the system follows a sophisticated multi-step process to automatically find and match their submission to existing premises records. This matching process combines intelligent algorithms with human oversight to ensure accuracy while handling the natural variations in how people describe addresses and business information.

### Overview of the Complete Matching Process

**Automated Initial Processing**
The matching begins immediately when an online submission is received:

1. **Data Reception** - The system receives the complete online submission with all address, business, and contact details
2. **Field Extraction** - Key matching fields are identified and prepared for comparison
3. **Hierarchical Matching** - The system tries multiple matching strategies in order of reliability
4. **Confidence Assessment** - Each potential match is scored based on how closely fields align
5. **Officer Presentation** - The best matches are presented to council officers for validation

**Human Validation and Decision**
The process then moves to trained council officers who:
- Review the automatic matching suggestions
- Verify the accuracy of potential matches
- Make final decisions on premise connections
- Handle complex cases that require manual intervention

### Step-by-Step Automatic Matching Process

**Step 1: Exact Address Matching**
The system first looks for premises with identical address information:

- **Perfect Address Match** - Building number, street name, and postcode all match exactly
- **Database Comparison** - Compares submitted details against all existing premises records
- **Immediate Success** - If found, this becomes the primary suggested match
- **High Confidence** - Exact matches typically have very high confidence scores

**Step 2: Flexible Address Matching**
When exact matching doesn't work, the system tries variations:

- **Spelling Tolerance** - Allows for minor spelling differences in street names
- **Format Variations** - Handles different ways of writing the same address
- **Abbreviation Handling** - Matches "Street" with "St", "Road" with "Rd", etc.
- **Case Insensitive** - Ignores differences in capitalization

**Step 3: Postcode Area Matching**
If specific address matching fails, the system searches by area:

- **Postcode Search** - Finds all premises within the same postcode
- **Street Filtering** - Looks for similar street names within that postcode area
- **Number Proximity** - Considers nearby building numbers on the same street
- **Multiple Results** - May return several possible matches for officer review

**Step 4: Business Name Cross-Reference**
The system also attempts matching using business information:

- **Name Comparison** - Compares submitted business names with existing premises
- **Trading Name Variations** - Handles different versions of the same business name
- **Partial Name Matching** - Finds businesses with similar but not identical names
- **Location Validation** - Verifies business name matches are in the expected area

**Step 5: Contact Information Verification**
Additional validation using owner and contact details:

- **Owner Name Matching** - Compares owner names with existing contact records
- **Phone Number Verification** - Checks if contact numbers match existing records
- **Email Address Comparison** - Looks for matching email addresses in the system
- **Address Cross-Check** - Compares owner addresses with business locations

### How the System Handles Address Variations

**Common Address Differences the System Recognizes**

**Street Name Variations**
- **Full vs Abbreviated** - "High Street" matches with "High St"
- **Alternative Spellings** - Handles historical or alternative street name spellings
- **Word Order** - Manages different ordering of street name components
- **Punctuation Differences** - Ignores apostrophes, hyphens, and other punctuation variations

**Building Identification Flexibility**
- **Number Formats** - "12A" matches with "12a" or "12 A"
- **Name Variations** - "The Old Mill" matches with "Old Mill"
- **Unit Descriptions** - "Shop 3" matches with "Unit 3" or "3"
- **Flat Designations** - Various ways of describing apartments or flats

**Postcode Handling**
- **Full Postcode Priority** - Uses complete postcodes when available
- **Partial Matching** - Falls back to area codes when full codes don't match
- **Format Tolerance** - Handles postcodes with or without spaces
- **Invalid Code Recovery** - Uses alternative matching when postcodes are incorrect

### Confidence Scoring and Match Quality Assessment

**How Match Confidence is Calculated**

**High Confidence Matches (85-100%)**
- All core address fields match exactly
- Business name aligns with premises records
- Contact information supports the match
- No conflicting information found

**Medium Confidence Matches (60-85%)**
- Core address fields match with minor variations
- Some supporting information aligns
- No major contradictions in the data
- Reasonable certainty but requires officer verification

**Low Confidence Matches (30-60%)**
- Partial address matching only
- Limited supporting information
- Some conflicting details present
- Requires careful officer review and investigation

**Very Low Confidence (Below 30%)**
- Minimal field alignment
- Significant contradictions or missing information
- Likely requires manual search or new premises creation

### What Happens When Multiple Matches Are Found?

**Ranking and Presentation System**
When the matching process finds several possible premises:

**Primary Match Selection**
- **Highest Confidence** - The best scoring match is presented first
- **Supporting Evidence** - Additional matching fields that support this choice
- **Risk Assessment** - Evaluation of potential issues with this match

**Alternative Matches Display**
- **Ranked List** - Other possible matches shown in order of confidence
- **Key Differences** - What differs between the primary and alternative matches
- **Decision Support** - Information to help officers choose the correct match

**Officer Decision Tools**
- **Side-by-Side Comparison** - Visual comparison of submitted vs matched information
- **Detail Verification** - Ability to examine all matching and non-matching fields
- **Search Override** - Option to perform manual searches with different criteria

### How Officers Validate and Confirm Matches

**Officer Review Process**

**Information Verification**
Council officers examine:
- **Address Accuracy** - Confirming submitted addresses are correct and current
- **Business Details** - Verifying business names and operational information
- **Contact Validation** - Ensuring owner and contact information is accurate
- **Historical Context** - Reviewing premises history for relevant changes

**Decision Making Options**
Officers can choose to:

**Accept Automatic Match**
- Confirm the system's suggested match is correct
- Proceed with linking the online submission to the identified premises
- Update any minor information discrepancies
- Complete the registration process

**Select Alternative Match**
- Choose a different premises from the system's suggestions
- Override the primary match when alternatives are more suitable
- Document reasons for selecting a different option
- Ensure all information aligns with the chosen premises

**Perform Manual Search**
- Search using different field combinations or criteria
- Look for premises that weren't identified by automatic matching
- Use local knowledge to find premises with address variations
- Access external resources for address verification

**Create New Premises**
- Register completely new premises when no suitable match exists
- Use submitted information to create fresh premises records
- Link to existing address databases where appropriate
- Establish new inspection schedules and risk assessments

### What Triggers Manual Intervention?

**Automatic Escalation Scenarios**

**No Suitable Matches Found**
- System cannot find any premises meeting minimum confidence thresholds
- Submitted address information doesn't match existing records
- Business appears to be completely new to the area

**Conflicting Information**
- Multiple high-confidence matches with contradictory details
- Business name matches one premises but address matches another
- Contact information suggests different premises than address data

**Data Quality Issues**
- Submitted information is incomplete or obviously incorrect
- Existing premises records need updating based on submission details
- Address changes or business relocations since last registration

**Complex Business Arrangements**
- Multiple businesses operating from the same premises
- Franchise or chain operations with complex ownership structures
- Seasonal or temporary business operations requiring special handling

### How the System Learns and Improves

**Feedback Integration**
The matching process benefits from officer decisions:

**Decision Tracking**
- **Match Acceptance Rates** - Monitoring how often automatic suggestions are accepted
- **Override Patterns** - Understanding when and why officers choose different matches
- **Search Behaviors** - Learning from manual search strategies used by officers

**Data Quality Enhancement**
- **Address Standardization** - Improving address formatting based on successful matches
- **Business Name Normalization** - Learning common variations in business names
- **Contact Information Updates** - Keeping contact details current through submissions

### What Information Gets Updated After Matching?

**Premises Record Updates**
When a match is confirmed, the system may update:

**Address Information**
- **Current Address Details** - Updating any changed address information
- **Contact Information** - Adding or updating phone numbers and email addresses
- **Business Names** - Recording new trading names or business name changes

**Operational Details**
- **Opening Hours** - Updating trading days and hours from the submission
- **Business Activities** - Recording changes in food handling activities or business type
- **Ownership Information** - Updating owner or operator contact details

**Regulatory Information**
- **Registration Dates** - Recording new registration or renewal dates
- **Risk Assessments** - Triggering risk assessment reviews based on changes
- **Inspection Scheduling** - Planning appropriate inspection schedules for changes

### Benefits of the Automated Matching Process

**For Council Efficiency**
- **Time Saving** - Reduces manual work required to process online submissions
- **Consistency** - Ensures all submissions are processed using the same criteria
- **Accuracy** - Minimizes human error in identifying correct premises
- **Resource Optimization** - Allows officers to focus on complex cases requiring judgment

**For Business Operators**
- **Faster Processing** - Reduces time from submission to registration completion
- **Reduced Contact** - Minimizes need for follow-up calls or correspondence
- **Accurate Records** - Ensures business information is properly linked and maintained
- **Continuity** - Maintains connection with existing inspection and compliance history

**For Data Quality**
- **Duplicate Prevention** - Reduces creation of duplicate premises records
- **Information Updates** - Keeps premises information current through regular submissions
- **Quality Assurance** - Validates and corrects address and contact information
- **Audit Trail** - Maintains clear records of how submissions were processed

This comprehensive matching process balances automation for efficiency with human oversight for accuracy, ensuring that online food business registrations are properly connected to the correct premises while maintaining high data quality standards throughout the system.