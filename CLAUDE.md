# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains comprehensive documentation for the **Idox Public Protection System** - a web-based regulatory case management system for UK Local Authority Public Protection teams. The system integrates Environmental Health, Trading Standards, Licensing, Housing, and related regulatory services into a unified platform.

## Repository Structure

The codebase consists entirely of documentation organized in the `User Guide/` directory:

```
User Guide/
├── 00-System-Overview.md          # Complete system architecture and introduction
├── 01-Premises-Management-User-Guide.md        # Central premises database
├── 02-Inspections-Management-User-Guide.md     # Inspection planning and execution
├── 03-Complaints-Management-User-Guide.md      # Complaint lifecycle management
├── 04-Licensing-Management-User-Guide.md       # License administration
├── 05-Enforcement-Management-User-Guide.md     # Formal enforcement powers
├── 06-Mobile-Working-User-Guide.md             # Field working capabilities
├── 07-User-Management-Security-User-Guide.md   # Security and access controls
├── 08-System-Configuration-User-Guide.md       # System setup and configuration
├── 09-System-Integrations-User-Guide.md        # External system connections
├── 10-Reports-Analytics-User-Guide.md          # Performance monitoring and reporting
├── 14-Samples-Management-User-Guide.md         # Laboratory sample management
├── 15-Accidents-RIDDOR-User-Guide.md           # Workplace accident reporting
├── 16-Food-Poisoning-Management-User-Guide.md  # Food safety incident management
├── 17-Prosecutions-Management-User-Guide.md    # Legal prosecution cases
├── 18-Dogs-Management-User-Guide.md            # Animal control services
├── 19-Planning-Management-User-Guide.md        # Planning applications
├── 20-Grants-Management-User-Guide.md          # Grant administration
├── 21-Bookings-Management-User-Guide.md        # Facility and resource booking
├── 22-Initiatives-Management-User-Guide.md     # Public health initiatives
├── 23-Notices-Management-User-Guide.md         # Legal notice management
├── 24-GIS-Mapping-User-Guide.md               # Geographic information systems
├── 25-Communications-Admin-User-Guide.md       # Communication tools
├── 26-Audit-Trail-User-Guide.md               # System audit capabilities
├── 27-End-to-End-Regulatory-Processes.md      # Complete workflow scenarios
├── 28-Daily-Operations-Guide.md               # Day-to-day operational procedures
└── 29-Role-Based-Handbooks.md                 # User role-specific guidance
```

## System Architecture

The Idox Public Protection System is a **comprehensive web-based regulatory management platform** with the following key characteristics:

### Core Service Areas
- **Environmental Health**: Food safety, health & safety, environmental protection, infectious disease, port health
- **Trading Standards**: Consumer protection, weights & measures, age-restricted sales, product safety
- **Licensing**: Alcohol, entertainment, taxi, animal, gambling, street trading licenses
- **Housing & Property**: Housing standards, HMO licensing, mobile homes, vacant properties

### Key System Modules
1. **Premises Management** - Central database for all regulated locations
2. **Inspections Management** - Risk-based inspection scheduling and execution
3. **Complaints Management** - Complete complaint lifecycle from receipt to resolution
4. **Licensing Management** - End-to-end license administration with statutory compliance
5. **Enforcement Management** - Formal enforcement powers with legal compliance
6. **Reports & Analytics** - Performance monitoring and statutory reporting

### Technical Architecture
- **Web-based platform** accessible via modern browsers (Chrome, Firefox, Safari, Edge)
- **Multi-user environment** with role-based permissions and geographic restrictions
- **Integration capabilities** with government systems (FSA, HSE, DVLA) and council systems
- **Mobile working** with offline capability and GPS integration
- **Document management** with secure file attachments and evidence storage

## Documentation Standards

### Content Organization
- Each guide focuses on a specific functional area of the system
- Guides follow consistent structure: Overview → Quick Start → Workflows → Best Practices
- Step-by-step procedures with clear action items and checklists
- Real-world scenarios demonstrating module integration

### Writing Conventions
- User-focused language explaining "what this does for you" and "why it matters"
- Numbered steps and bulleted lists for procedures
- **Bold text** for important concepts and UI elements
- Consistent terminology across all documents
- Practical examples and common use cases

### File Management
- All documentation files use `.md` extension
- Files numbered sequentially (00-29) for logical reading order
- Descriptive filenames indicating content focus
- No technical configuration files (this is documentation-only repository)

## Common Development Tasks

Since this is a documentation repository with no code files, typical development tasks involve:

### Content Updates
- Editing existing user guide markdown files
- Adding new sections to existing guides
- Creating supplementary documentation files
- Updating workflow examples and screenshots

### Quality Assurance
- Ensuring consistency across all documentation files
- Verifying accuracy of system feature descriptions
- Maintaining up-to-date procedural guidance
- Cross-referencing between related modules

### Content Structure
- Following established documentation patterns
- Using consistent heading hierarchy (##, ###, ####)
- Maintaining numbered file sequence for reading order
- Including practical examples and use cases

## Important Notes

- This repository contains **documentation only** - no source code, configuration files, or development tooling
- The documentation describes a proprietary web-based system (Idox Public Protection System)
- Content focuses on regulatory compliance for UK Local Authorities
- All guides are written for end-users of the system, not developers
- No build processes, testing frameworks, or deployment procedures are applicable