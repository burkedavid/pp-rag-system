# Adding Actions to Service Requests - Frequently Asked Questions

## What are the steps to add an action to a service request?

**Based on analysis of the Idox Public Protection System source code, actions can be added to service requests (complaints) through a specific navigation pathway within the service request management interface. The system provides a dedicated Actions menu option when viewing individual service requests.**

### Step-by-Step Procedure to Add Actions

**Step 1: Navigate to Service Request Details**
- Access the **Service Requests** section from the main navigation menu
- Locate the specific service request using **View Requests** or **Search Requests**
- Click on the service request number to open the individual service request record

**Step 2: Access the Actions Menu**
Within the service request details screen:
- Look for the **Request Details** menu section on the left-hand side navigation
- Click on **Actions** from the available menu options
- This menu item appears in the left navigation panel alongside other options like Inspections, Notices, Communications, etc.

**Step 3: Add New Action**
From the Actions area:
- Click the **Add Action** button to create a new action record
- This will open the action creation form linked to the current service request

### Navigation Path from Source Code

**Exact Menu Navigation Sequence**
The system navigation follows this path:
1. **Service Requests Menu** → View or search for requests
2. **Individual Service Request** → Click request number to open details
3. **Request Details Menu** → Left-hand navigation panel appears
4. **Actions Menu Item** → Click "Actions" to access action management
5. **Add Action Function** → Use Add Action button to create new actions

**Menu Integration**
The Actions menu option appears in the Request Details left-hand navigation when viewing an individual service request. It shows alongside other related functions like Inspections, Notices, Communications, and Prosecutions, providing integrated access to all enforcement and follow-up activities.

### Available Action Management Functions

**Action Fields and Options**
When creating actions, the system provides these data fields:
- **Action Number** - System-generated reference number
- **Planned Date** - When the action is scheduled to be completed
- **Officer Assignment** - Which officer is responsible for the action
- **Action Code** - Type of action being taken (from predefined action codes)
- **Outcome** - Result of the action once completed
- **Completed Date and Time** - When the action was finished
- **Communication Details** - Who should be contacted about the action
- **Action Reasons** - Why the action is being taken
- **Remarks** - Additional notes and details about the action

**Action Management Options**
The Actions area provides:
- **Add Action** - Create new actions linked to the service request
- **View All Actions** - See all actions associated with the service request
- **Edit Actions** - Modify existing action records
- **Action Scheduling** - Set planned and completion dates for actions

### System Integration Features

**Service Request Context**
Actions are automatically linked to:
- **Parent Service Request** - Actions inherit complaint ID and core function details
- **Officer Assignment** - Actions can use the investigating officer from the service request
- **Premises Connection** - Actions link to any premises associated with the service request
- **Regulatory Area** - Actions maintain connection to the complaint's regulatory function

**Related Function Access**
The Actions menu appears alongside other enforcement functions:
- **Inspections** - Schedule and manage inspection visits
- **Notices** - Issue enforcement notices and follow up on compliance
- **Communications** - Send letters, emails, and other communications
- **Prosecutions** - Initiate legal proceedings when necessary
- **Fees** - Manage any fees associated with enforcement activities

### User Interface Features

**Menu Visual Indicators**
The Actions menu includes visual indicators:
- **Tick Icons** - Show when actions have been added to the service request
- **Spacer Icons** - Indicate when no actions have been created yet
- **Menu Selection** - Highlights the currently selected area for easy navigation

**Permission-Based Access**
The Actions menu appears based on user permissions:
- **Read/Write Actions** - Full access to create and edit actions
- **Read-Only Actions** - View existing actions but cannot create new ones
- **No Access** - Actions menu hidden if user lacks appropriate permissions

### Benefits of Integrated Action Management

**Streamlined Workflow**
- **Contextual Access** - Actions accessed directly within service request management
- **Related Information** - All service request details available when creating actions
- **Integrated Planning** - Actions coordinate with inspections, communications, and enforcement
- **Officer Continuity** - Same officer can handle service request and related actions

**Complete Case Management**
- **Full Audit Trail** - All actions recorded and linked to original service request
- **Progress Tracking** - Action completion status visible within service request context
- **Coordinated Response** - Multiple enforcement tools accessible from single interface
- **Performance Monitoring** - Action effectiveness measurable against service request outcomes

### Conclusion

Adding actions to service requests follows a clear navigation pathway through the integrated service request management interface. The Actions menu, accessible from the Request Details navigation panel, provides direct access to action creation and management functions while maintaining full context and integration with the parent service request and related enforcement activities.

**This answer is based on analysis of the actual service request navigation menus and action management functionality in the system source code, specifically the complaints menu template and action management interfaces.**