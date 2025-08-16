# Premises Module

## Overview
The Premises module is the central hub for managing business and property registrations across multiple regulatory domains. It handles the registration, inspection, and ongoing compliance monitoring of premises for Food Safety, Health & Safety, Environmental Protection, Consumer Protection, Smoke Free, Animal Feed, Animal Health, Port Health, Private Water Supply, Contaminated Land, HMO (Houses in Multiple Occupation), and Vacant Homes.

## Key Functionality
Based on analysis of the core class methods and database interactions:

- **Multi-domain registration**: Single premises can be registered across up to 15 different regulatory areas
- **Premises creation and updates**: Complete lifecycle management from initial registration to closure
- **Owner and occupier management**: Track property ownership changes and contact details
- **Location integration**: Full GIS mapping and address management
- **Risk assessment tracking**: Domain-specific risk categorization
- **Compliance monitoring**: Integration with inspections, samples, and enforcement actions
- **Historical tracking**: Comprehensive audit trail of all changes
- **Batch operations**: Mass updates and data export capabilities

## Complete Workflow

### Starting a New Premises Registration

#### 1. Access Registration Form
Users access the premises registration through the main navigation menu. The system presents a tabbed interface with 15 different registration areas, allowing officers to register premises for multiple regulatory domains simultaneously.

#### 2. Location Selection and Validation
- Officers must first select or create a location using the DTF (Digital Terrain Framework) location system
- The system validates addresses against Ordnance Survey data
- GIS coordinates (X/Y) are automatically populated for mapping integration
- UPRN (Unique Property Reference Number) is captured for government reporting

#### 3. Main Details Collection (Tab 1)
- **Premises Name**: Business trading name with validation for special characters
- **Alternative Names**: Track multiple trading names over time
- **Contact Information**: Primary phone, secondary phone, email, website
- **Registration Type**: Classification for reporting purposes
- **Tags**: Categorization system for custom groupings

### Data Collection and Validation

The system collects domain-specific information across multiple tabs:

#### Food Safety Registration (Tab 3)
- **Registration Status**: Boolean flag for food business registration
- **Registration Date**: When the business was first registered
- **Risk Category**: A-E rating based on food safety risk assessment
- **Sales Activities**: Multiple selection from predefined list (retail, catering, etc.)
- **Food Handling Activities**: Processing, preparation, serving activities
- **Methods of Processing**: Cooking, chilling, freezing, etc.
- **Food Types Handled**: Meat, dairy, ready-to-eat foods, etc.
- **Main Usage Codes**: Primary business activity classification
- **Opening/Closing Dates**: Seasonal business tracking
- **EC Approval**: Required for certain high-risk operations
- **FHRS Scope**: Food Hygiene Rating Scheme inclusion/exclusion

#### Health & Safety Registration (Tab 4)
- **Registration Status**: Boolean flag for workplace registration
- **Employer Details**: Link to employer contact record
- **Employee Numbers**: Full-time and part-time staff counts
- **Risk Category**: H/M/L based on workplace hazards
- **Machinery Types**: Dangerous machinery inventory
- **Industry Classification**: SIC code alignment

#### Consumer Protection (Tab 5)
- **Registration Status**: Trading standards oversight
- **Legislation Tracking**: Specific regulations applicable
- **Equipment Inventory**: Weighing and measuring equipment
- **Business Category**: Retail, service, manufacturing classification

#### Environmental Protection (Tab 6)
- **Registration Status**: Environmental permit requirements
- **Permit Types**: Multiple environmental permits per premises
- **Activity Codes**: IPPC/PPC activity classifications
- **Guidance Notes**: Specific regulatory requirements
- **Monitoring Requirements**: Sampling and reporting obligations

#### Additional Domains (Tabs 7-15)
- **Smoke Free**: Public place designations and exemptions
- **Animal Feed**: Feed business operator registration
- **Animal Health**: Livestock holding registrations
- **Port Health**: Import/export facility controls
- **Private Water Supply**: Well and borehole registrations
- **Contaminated Land**: Pollution and remediation tracking
- **HMO**: Houses in Multiple Occupation licensing
- **Vacant Homes**: Empty property management

### Processing and Business Logic

#### Registration Validation
The system performs comprehensive validation:
- **Location Verification**: Ensures valid address and coordinates
- **Contact Validation**: Verifies owner/occupier contact details
- **Domain-Specific Rules**: Each regulatory area has specific validation requirements
- **Duplicate Detection**: Prevents duplicate registrations at same location
- **Permission Checks**: Validates user access rights for each domain

#### Database Operations
The system executes multiple database operations:
- **Premises Table**: Core premises information
- **Domain Tables**: Separate tables for each regulatory area (food_details, hs_details, etc.)
- **Contact Linking**: Establishes relationships with owner/occupier contacts
- **Location Linking**: Connects to DTF location records
- **Audit Logging**: Records all changes for compliance tracking

#### Risk Assessment Assignment
- **Automatic Categorization**: Based on business type and activities
- **Manual Override**: Officers can adjust risk ratings with justification
- **Historical Tracking**: Maintains history of risk assessment changes
- **Inspection Frequency**: Risk level determines inspection schedules

### Outcomes and Next Steps

#### Successful Registration
Upon successful registration, the system:
- **Generates Premise ID**: Unique identifier for all future references
- **Creates Inspection Schedule**: Based on risk category and regulatory requirements
- **Sends Notifications**: Email confirmations if configured
- **Updates Dashboards**: Adds to officer workload and management reports
- **Triggers Integrations**: Updates external systems (FHRS, government portals)

#### Follow-up Actions
- **Inspection Scheduling**: Automatic creation of due inspections
- **Sample Planning**: Links to sampling programmes where required
- **Compliance Monitoring**: Ongoing tracking of regulatory obligations
- **Renewal Reminders**: For time-limited registrations
- **Enforcement Actions**: If non-compliance identified

## Data Management

### Storage Structure
- **Master Premises Table**: Core business information
- **Domain-Specific Tables**: Detailed registration data for each regulatory area
- **Contact Relationships**: Owner and occupier tracking with change history
- **Location Integration**: Links to comprehensive address and mapping data
- **Document Management**: File attachments and communications

### Data Validation and Integrity
- **Referential Integrity**: Ensures valid relationships between tables
- **Business Rule Validation**: Domain-specific rules enforced at database level
- **Audit Trail**: Complete history of all changes with user and timestamp
- **Data Access Control**: Role-based permissions for sensitive information

### Search and Reporting
- **Advanced Search**: Multi-criteria search across all domains
- **Export Capabilities**: Data export for government returns and analysis
- **Management Reports**: Dashboard and statistical reporting
- **Integration Data**: Feeds to external systems and portals

## Integration Points

### Core System Modules
- **Inspections**: Premises trigger inspection schedules and requirements
- **Complaints**: Link complaints to specific premises for investigation
- **Samples**: Sample collection programmes tied to premises
- **Enforcement**: Actions and notices served on premises
- **Licensing**: Premises may require additional licenses

### External Systems
- **FHRS (Food Hygiene Rating Scheme)**: Automatic publication of food ratings
- **FSA Returns**: Government food safety statistics
- **HSE RIDDOR**: Health and safety incident reporting
- **LAEMS**: Local Authority Enforcement Monitoring System
- **Companies House**: Business registration verification

### Geographic Information Systems
- **Mapping Integration**: Visual representation of premises locations
- **Spatial Queries**: Distance-based searches and analysis
- **Ward and Area Assignment**: Automatic geographic classification
- **Coordinate Validation**: Ensures accurate positioning

## User Roles and Permissions

### Access Control Levels
Based on code analysis, the system implements role-based access:

- **VIEW**: Read-only access to premises information
- **EDIT**: Ability to update premises details
- **CREATE**: Permission to register new premises
- **DELETE**: Ability to remove premises (restricted to senior users)
- **ADMIN**: Full administrative access including sensitive operations

### Domain-Specific Permissions
- **Food Officers**: Access to food safety tabs and related functionality
- **Health & Safety Officers**: H&S registration and inspection access
- **Trading Standards**: Consumer protection and weights/measures access
- **Environmental Health**: Environmental permits and monitoring
- **Generic Officers**: Multi-domain access for smaller authorities

### Data Protection Controls
- **GDPR Compliance**: Built-in data protection and deletion capabilities
- **Audit Logging**: All access and changes recorded
- **Scheduled Deletion**: Automatic removal of data per retention policies
- **Access Monitoring**: Tracking of who accessed what information

## Reports and Outputs

### Statutory Returns
- **FSA Food Returns**: Annual submission of food safety statistics
- **HSE RIDDOR Reports**: Health and safety incident statistics
- **LAEMS Returns**: Enforcement activity monitoring
- **Government Dashboards**: Real-time data feeds to central systems

### Management Information
- **Premises Inventories**: Complete lists by domain and area
- **Risk Analysis**: Distribution of premises by risk category
- **Officer Workloads**: Premises allocation and inspection due dates
- **Performance Indicators**: Registration and compliance metrics

### Public Information
- **FHRS Publications**: Food hygiene ratings for public website
- **Business Directories**: Public lists of registered businesses
- **Compliance Status**: Public registers where legally required

## Common Scenarios

### New Business Registration
1. Officer receives notification of new business
2. Creates location record if not existing
3. Registers premises across relevant domains
4. Sets initial risk assessments
5. Schedules initial inspections
6. Notifies business of obligations

### Change of Ownership
1. Officer updates contact details
2. System tracks ownership history
3. Risk assessments reviewed
4. New owner notifications sent
5. Inspection schedules adjusted if required

### Business Closure
1. Officer updates closure date
2. Outstanding inspections cancelled
3. Final compliance checks completed
4. Records archived per retention policy
5. External systems notified

### Seasonal Business Management
1. Opening and closing dates recorded
2. Inspection schedules adjusted
3. Risk categories may change
4. Temporary registrations handled

## Error Handling and Edge Cases

### Data Validation Errors
- **Location Conflicts**: Multiple businesses at same address
- **Contact Validation**: Invalid or missing contact information
- **Domain Conflicts**: Incompatible registration combinations
- **Duplicate Prevention**: Checking for existing registrations

### System Recovery
- **Database Rollback**: Failed registration transactions
- **Audit Trail Recovery**: Reconstruction of lost changes
- **Integration Failures**: Handling external system outages
- **File Corruption**: Recovery of attached documents

### Business Rule Exceptions
- **Risk Override**: Manual adjustment of automatic risk assessments
- **Registration Exemptions**: Handling special cases and exemptions
- **Historical Data**: Managing legacy records and data migrations
- **Seasonal Variations**: Complex opening/closing patterns