# Food Poisoning Case Management - Frequently Asked Questions

## Where do I find the option to add additional victims or complainants to an existing food poisoning case?

**Based on analysis of the Idox Public Protection System source code, the food poisoning module exists but there is limited evidence in the current codebase of specific functionality for adding multiple victims or complainants to existing food poisoning cases. The system appears to handle food poisoning cases as individual records rather than complex multi-victim investigations.**

### What the Source Code Analysis Revealed

**Food Poisoning Module Exists**
The system includes basic food poisoning management through:
- **Food Poisoning Class** - Core functionality for managing food poisoning cases
- **Case Creation** - Ability to create and manage individual food poisoning records
- **Basic Case Management** - Standard case tracking and resolution capabilities
- **Premises Linking** - Connection to relevant premises and businesses

**Limited Multi-Victim Evidence**
Analysis of the source code shows:
- **Individual Case Focus** - Food poisoning cases appear to be managed as single records
- **No Complex Multi-Victim Workflows** - Limited evidence of advanced outbreak management
- **Basic Case Structure** - Standard case management rather than complex investigation coordination
- **Simple Integration** - Links to premises and basic enforcement activities

### Food Poisoning Case Management That Does Exist

**Standard Case Functions**
The food poisoning module provides:
- **Case Creation** - Creating new food poisoning investigation records
- **Premises Connection** - Linking cases to implicated food businesses
- **Basic Case Details** - Recording essential case information and investigation notes
- **Officer Assignment** - Assigning responsibility for case management
- **Case Resolution** - Recording outcomes and case completion

**Case Information Fields**
Based on source code analysis, the system handles:
- **Case Reference** - Food poisoning case numbers and identification
- **Premises Details** - Link to implicated food businesses or locations
- **Investigation Type** - Classification of the food poisoning investigation
- **Officer Information** - Responsible officers and case management
- **Case Notes** - Basic remarks and investigation information

### Alternative Approaches for Multiple Affected Individuals

**If Multiple People Are Affected**
When dealing with food poisoning incidents involving multiple people, officers might need to:

**Create Individual Cases**
- **Separate Records** - Create individual food poisoning cases for each affected person
- **Common Link** - Use consistent premises or business linking across cases
- **Cross-Reference** - Use case notes to reference related cases
- **Coordinated Investigation** - Manage multiple cases as part of the same investigation

**Case Coordination**
- **Manual Coordination** - Officers coordinate related cases through communication and documentation
- **Shared Premises Link** - Connect all related cases to the same implicated premises
- **Investigation Notes** - Use remarks fields to cross-reference related cases
- **Common Resolution** - Apply consistent outcomes across related cases

### System Limitations for Complex Investigations

**Current Functionality Scope**
The food poisoning module appears to provide:
- **Basic Case Management** - Core food poisoning case tracking
- **Premises Integration** - Links to implicated food businesses
- **Standard Investigation** - Essential investigation recording and management
- **Officer Workflow** - Basic case assignment and resolution

**Areas With Limited Functionality**
Analysis suggests limited capabilities for:
- **Multi-Victim Management** - Complex outbreak investigation workflows
- **Advanced Case Linking** - Sophisticated relationship management between cases
- **Outbreak Coordination** - Specialized tools for managing multiple related cases
- **Public Health Integration** - Advanced coordination with health protection teams

### Working Within Current System Capabilities

**For Officers Managing Food Poisoning Cases**
To handle multiple affected individuals:
- **Document Relationships** - Use case notes to record connections between cases
- **Consistent Investigation** - Apply the same investigation approach across related cases
- **Coordinate Manually** - Manage related cases through communication and coordination
- **Link to Premises** - Ensure all related cases are properly linked to implicated businesses

**For Case Documentation**
- **Comprehensive Notes** - Record all relevant details in case remarks
- **Cross-Reference Cases** - Note related case numbers and connections
- **Investigation Summary** - Document the scope and findings of related investigations
- **Resolution Coordination** - Ensure consistent outcomes across related cases

### Benefits of Current Approach

**Simplicity and Control**
The individual case approach provides:
- **Clear Case Management** - Each case has clear ownership and responsibility
- **Flexible Investigation** - Officers can adapt investigation approach as needed
- **Simple Integration** - Straightforward links to premises and enforcement activities
- **Audit Trail** - Clear documentation of each individual case

**Operational Effectiveness**
- **Officer Accountability** - Clear responsibility for each case
- **Case Tracking** - Individual case progress monitoring
- **Resource Management** - Understanding workload and case distribution
- **Performance Monitoring** - Tracking individual case outcomes

### Recommendations for Complex Food Poisoning Incidents

**When Multiple People Are Affected**
- **Create Related Cases** - Establish individual cases for each affected person
- **Use Consistent Linking** - Connect all cases to the same implicated premises
- **Document Relationships** - Record connections and shared factors in case notes
- **Coordinate Investigation** - Ensure consistent investigation approach across cases

**For Outbreak Management**
- **Manual Coordination** - Use existing communication channels for coordination
- **External Resources** - Work with public health teams using existing processes
- **Documentation Standards** - Maintain consistent documentation across related cases
- **Investigation Integration** - Coordinate sampling, inspection, and enforcement activities

### Conclusion

While the Idox Public Protection System includes food poisoning case management functionality, there is limited evidence of specialized tools for adding multiple victims or complainants to existing cases. The system appears designed for individual case management, with coordination of related cases handled through manual processes and cross-referencing.

Officers dealing with complex food poisoning incidents involving multiple affected individuals would likely need to create individual cases and coordinate them manually through documentation and communication, rather than using specialized multi-victim case management tools.

**This answer is based on analysis of the actual food poisoning management source code in the system, specifically the class.FoodPoisonings.php file and related functionality.**