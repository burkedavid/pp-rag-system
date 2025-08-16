# Accidents and RIDDOR Management 

## What This Module Does for You

**Your workplace accident management system:** The Accidents module handles the complete recording, investigation, and management of workplace accidents and incidents. It includes comprehensive RIDDOR (Reporting of Injuries, Diseases and Dangerous Occurrences Regulations) assessment and scoring functionality to determine investigation priorities.

**Why it matters to your regulatory work:** Workplace accidents require proper documentation, investigation, and often statutory reporting. This module ensures legal compliance with RIDDOR requirements, supports investigation decisions through scoring matrices, and maintains comprehensive records for enforcement and improvement purposes.

**Key benefits:**
- **Complete accident lifecycle management** - From initial report to investigation closure
- **RIDDOR scoring system** - Structured assessment to prioritize investigations
- **Investigation tracking** - Monitor investigation progress and outcomes
- **Premises linking** - Accidents automatically linked to premises records
- **Contact management** - Track injured persons and witness details

## Quick Start Guide

### Your First Day with Accidents
1. **Access the module**: Click "Accidents" from the main navigation menu
2. **Understand accident types**: Review employee vs public accident categories
3. **Learn RIDDOR scoring**: Understand the investigation priority scoring system
4. **Practice accident creation**: Create test accident records to learn the interface
5. **Review search functionality**: Learn to search for existing accident records

### Essential Daily Tasks Checklist
- [ ] Review new accident reports requiring processing
- [ ] Complete RIDDOR assessments for new accidents
- [ ] Follow up on ongoing accident investigations
- [ ] Update investigation status and findings
- [ ] Check for accidents requiring management escalation based on scores

## Common Workflows

### Workflow 1: Recording a New Accident

#### Step-by-Step Process:

##### Step 1: Access Accident Creation
- **Navigate to**: Accidents module → "Create Accident" or from premises record
- **Premises linking**: Search and select premises where accident occurred (if not pre-selected)
- **System setup**: Custodian Code automatically selected if data access control enabled

##### Step 2: Basic Accident Information
- **Officer**: Select responsible officer from dropdown
- **Accident Date**: Enter date accident occurred (calendar picker available)
- **Accident Time**: Enter time as hours:minutes (e.g., 14:30)
- **Date Reported**: Enter date accident was reported to authority
- **Reporting Method**: Select how accident was reported (phone, email, etc.)
- **Manual Reference**: Enter any manual reference number

##### Step 3: Injured Person Details
- **Name of Injured**: Search for and select injured person from contacts
  - Use search button to find existing contact
  - Can create new contact if not found
- **Person Type**: Select either:
  - **Employee**: For workplace accidents to employees
  - **Public**: For accidents involving members of public
- **Injury Category**: Select appropriate category (options change based on Employee/Public selection)

##### Step 4: Accident Classification
- **Accident Type**: Select from configured accident types dropdown
- **Reportable**: Check if accident is RIDDOR reportable
- **Response Method**: Select method of response
- **Corporate**: Check if corporate involvement required
- **Response Date**: Date response was provided
- **Completed Date**: Date when accident handling completed

##### Step 5: Detailed Information
- **Injury Description**: Enter detailed description of injuries sustained (large text area)
- **Remarks**: Additional comments and observations
- **Investigated**: Check if accident has been investigated
- **Investigation Details**: Enter investigation findings (appears when "Investigated" checked)

##### Step 6: Save and Follow-up
- **Save**: Click save button to create accident record
- **Print Forms**: Option to print accident forms for offline use
- **Next steps**: Proceed to RIDDOR assessment if required

### Workflow 2: RIDDOR Assessment and Scoring

#### Step-by-Step Process:

##### Step 1: Access RIDDOR Assessment
- **From accident record**: Navigate to RIDDOR assessment functionality
- **Assessment form**: Comprehensive scoring matrix loads
- **Premises information**: Shows premises name, UPRN, and accident number

##### Step 2: About the Incident Scoring
Complete scoring for each criterion (0 or specified points):
- **Fatalities**: 0 or 20 points
- **Specified Injury**: 0 or 15 points (links to HSE guidance)
- **Public Concern**: 1, 2, or 3 points
- **Serious Breach**: 0 or 5 points
- **Vulnerable Workers**: 0 or 5 points
- **Children**: 0 or 5 points
- **Multiple Injuries**: 0 or 2 points
- **Dangerous Occurrence**: 0 or 2 points
- **Asbestos (ACM)**: 0 or 20 points
- **Reportable Disease**: 0 or 20 points

##### Step 3: Premises History Assessment
- **Good Complaint History**: 0 points
- **Varied History/New Premises**: 0 or 5 points
- **Poor History**: 0 or 10 points

##### Step 4: Priority Topics Scoring
- **Workplace Transport**: 0 or 10 points
- **Catering**: 0 or 5 points
- **Slip/Trip**: 0 or 5 points
- **Fall from Height**: 0 or 10 points
- **Manual Handling**: 0 or 5 points
- **Violence at Work**: 0 or 5 points

##### Step 5: Assessment Completion
- **Total Score**: System automatically calculates total
- **Remarks**: Enter assessment comments
- **Reason for Deviation**: If not following score guidelines
- **Line Manager Agreement**: Select approving manager
- **Date**: Enter approval date
- **Save/Lock**: Saving with manager approval locks the form

### Workflow 3: Accident Investigation Management

#### Step-by-Step Process:

##### Step 1: Investigation Decision
- **Score Review**: Use RIDDOR score to determine investigation requirement:
  - **20+ points**: Must be investigated
  - **15-19 points**: Officer discretion with manager discussion
  - **Under 15 points**: Generally not investigated unless linked to project
- **Resource Assessment**: Consider available investigation resources

##### Step 2: Investigation Planning
- **Investigation Officer**: Assign investigating officer
- **Investigation Scope**: Determine what needs investigating
- **Timeline**: Set investigation completion targets
- **Evidence Requirements**: Identify evidence to be gathered

##### Step 3: Investigation Execution
- **Site Investigation**: Visit accident location
- **Witness Interviews**: Interview witnesses and injured person
- **Evidence Collection**: Gather physical evidence and documentation
- **Cause Analysis**: Identify immediate and underlying causes

##### Step 4: Investigation Completion
- **Investigation Details**: Record findings in accident record
- **Recommendations**: Document improvement recommendations
- **Follow-up Actions**: Create any required enforcement actions
- **Case Closure**: Mark investigation as complete

## Real-World Scenarios

### Scenario 1: "Workplace Fall Accident"

**Situation**: Employee falls from ladder at construction site, sustaining broken arm. Accident reported by site manager.

**Your process:**
1. **Create accident record**: Enter all basic details including injured person details
2. **RIDDOR assessment**: Complete scoring matrix - likely scores points for specified injury, fall from height
3. **Investigation decision**: Score probably 25+ points, requiring full investigation
4. **Investigation**: Site visit, ladder inspection, witness interviews, safety procedure review
5. **Follow-up**: Improvement notice if safety failures identified

### Scenario 2: "Public Slip Accident"

**Situation**: Member of public slips on wet floor in council building, minor injury.

**Your process:**
1. **Accident recording**: Create record with "Public" person type selected
2. **Contact management**: Create contact record for injured person if needed
3. **RIDDOR assessment**: Lower score likely - slip/trip points but no specified injury
4. **Investigation**: Brief investigation of cleaning procedures and warning signage
5. **Prevention**: Review and improve floor maintenance procedures

## Integration with Other Modules

### Premises Management Connection
- **Accident location**: All accidents linked to specific premises
- **History tracking**: Accident history visible in premises records
- **Risk assessment**: Accident patterns may influence premises risk ratings
- **RIDDOR scoring**: Premises history affects RIDDOR investigation scores

### Contacts Integration
- **Injured persons**: Accident victims recorded in contacts database
- **Contact search**: Search existing contacts for injured person selection
- **Contact creation**: Create new contacts directly from accident forms
- **Contact linking**: Injured person details automatically populate from contact records

### Inspections Module Integration
- **Follow-up inspections**: Accidents may trigger inspection requirements
- **Investigation evidence**: Inspection findings may relate to accident causes
- **Premises assessment**: Accident history informs inspection planning
- **Enforcement links**: Accident investigations may lead to enforcement action

### Enforcement Connection
- **Evidence base**: Accident investigations provide evidence for enforcement
- **Improvement notices**: Systematic failures may result in formal notices
- **Prosecution support**: Serious accidents may lead to prosecution
- **Compliance monitoring**: Monitor implementation of safety improvements

## System Features and Navigation

### Accident Record Management
- **Premises search**: Search and link accidents to premises
- **Contact integration**: Search and select injured persons from contacts
- **Calendar controls**: Date picker functionality for all date fields
- **Dynamic forms**: Injury categories change based on Employee/Public selection
- **Text areas**: Large text fields for detailed descriptions

### RIDDOR Assessment System
- **Scoring matrix**: Comprehensive assessment with automatic totaling
- **HSE guidance links**: Direct links to relevant HSE guidance
- **Approval workflow**: Line manager approval and form locking
- **Score guidelines**: Built-in investigation decision guidelines
- **Deviation tracking**: Record reasons for not following score guidelines

### Search and Reporting
- **Multi-criteria search**: Search by premises, officer, dates, accident types
- **Status filtering**: Filter by investigation status, reportable status
- **Export functionality**: Export search results to Excel/Word
- **Print forms**: Print accident forms for offline use

## Tips and Best Practices

### Efficient Accident Management
- **Prompt recording**: Record accidents as soon as reported
- **Complete information**: Gather all relevant details at initial recording
- **Proper classification**: Ensure correct Employee/Public classification
- **Contact management**: Maintain accurate injured person contact details
- **Status tracking**: Keep investigation status updated

### RIDDOR Assessment Excellence
- **Objective scoring**: Score based on facts, not assumptions
- **HSE guidance**: Use HSE links for specified injury determination
- **Consistent application**: Apply scoring criteria consistently
- **Manager consultation**: Discuss borderline cases with line managers
- **Documentation**: Record reasoning for scoring decisions

### Investigation Quality
- **Timely investigation**: Begin investigations promptly while evidence fresh
- **Systematic approach**: Use structured investigation methodology
- **Evidence preservation**: Document and preserve all relevant evidence
- **Root cause analysis**: Look beyond immediate causes to underlying factors
- **Follow-up discipline**: Ensure recommendations are implemented

## FAQ

### Q: How do I determine if an accident is RIDDOR reportable?
**A**: Use the RIDDOR assessment scoring system. The system guides you through HSE criteria including fatalities, specified injuries, and dangerous occurrences.

### Q: What's the difference between Employee and Public accidents?
**A**: Employee accidents involve workplace injuries to employees/contractors. Public accidents involve members of the public. This affects available injury categories and RIDDOR assessment.

### Q: Can I modify a RIDDOR assessment after it's been approved?
**A**: No, once a RIDDOR assessment is signed by a line manager, the form becomes locked. You would need to delete and recreate if changes are essential.

### Q: How do I link an accident to a premises?
**A**: Use the premises search button when creating the accident record. You can search by name and select the appropriate premises from results.

### Q: What happens if the RIDDOR score is borderline for investigation?
**A**: Scores 15-19 are at officer discretion with manager discussion. Document your decision and reasoning in the "Reason for Deviation" field.

---