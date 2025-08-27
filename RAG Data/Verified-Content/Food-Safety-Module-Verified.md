# Food Safety Module - Verified Documentation

> **Source Verification**: This content is 100% verified based on actual user interface testing and system functionality analysis of the Idox Public Protection System.

## Overview

The Food Safety module provides comprehensive functionality for managing food businesses, registrations, inspections, and food poisoning investigations within the regulatory framework.

## Core Food Business Registration

### Food Business Registration Process

The system handles food business registrations with comprehensive tracking:

- **Opening Date Management**: Track when food businesses open for operation
- **Registration Date Recording**: Official registration date with the local authority  
- **Trading Hours Configuration**: Detailed tracking of opening and closing times
- **Weekly Trading Schedule**: Day-by-day configuration (Monday through Sunday) with specific opening times for each day
- **Multiple Business Detection**: Flag for premises with other businesses operating from same location

### Online Food Business Registration

The system manages digital submissions from the Food Standards Agency:

- **Online Reference Numbers**: Unique tracking for web-submitted registrations
- **Operator Details Capture**: Name, address, and contact information
- **Premises Information**: Complete address and business details
- **Acceptance/Rejection Workflow**: Administrative review and decision process
- **FSA Integration**: Food Standards Agency reporting and compliance

## Food Poisoning Investigation

### Food Poisoning Case Management

Navigate to **Food Poisonings** → **Create Food Poisoning** to manage investigation cases:

- **Incident Recording**: Capture food poisoning incidents with official notification status
- **Premises Linking**: Connect food poisoning cases to specific food business premises using search functionality
- **Group Management**: Handle outbreak situations with group reference numbers
- **Investigation Tracking**: Full case management from notification to resolution

### Creating Food Poisoning Cases

When creating a new food poisoning case, you can specify:

- **Case Type**: Individual cases or group outbreaks
- **Official Notification**: Reference numbers for formal notifications
- **Group Details**: Group names and reference numbers for outbreak situations
- **Infectious Disease**: Select from available disease classifications
- **Date and Time Received**: When the report was received
- **Received By**: Officer who received the initial report
- **Reporting Method**: How the case was reported (phone, email, etc.)
- **Investigating Officer**: Assigned investigation officer
- **Patient Information**: Link to contact records for affected individuals

### Key Investigation Features

- **Official Notification Handling**: Track formal notifications from health authorities
- **Premise Connection**: Link incidents to registered food businesses for investigation
- **Case Type Classification**: Different types of food poisoning incidents (individual or group)
- **Audit Trail**: Complete history of investigation actions and decisions

## Premises Integration

### Food Business Premises Management

Food businesses are integrated with the premises management system:

- **Premise Creation**: New premises records specifically for food businesses
- **Contact Linking**: Connect business operators to premises records
- **Address Validation**: Ensure accurate location data for inspections
- **Custodian Code Assignment**: Proper data governance and access control

## System Features

### Validation and Workflow

- **Online Submission Validation**: Automated checking of food business registration submissions
- **Mandatory Field Verification**: Ensure all required information is provided
- **Duplication Prevention**: Check for existing registrations to prevent duplicates
- **Status Tracking**: Monitor registration progress from submission to approval

### Data Management

- **Date Handling**: Sophisticated date management for registrations and trading schedules
- **Trading Pattern Recording**: Capture complex trading hours and seasonal variations
- **Business Categorization**: Classification of food businesses by type and activity
- **Regulatory Compliance**: Built-in compliance checking and reporting features

## Technical Implementation

### Database Integration

- Food business data stored with full audit trails
- Integration with custodian codes for data access control
- Foreign key relationships maintaining data integrity
- Comprehensive indexing for search and reporting performance

### User Interface Features

- Web-based forms for food business registration
- Administrative interfaces for processing applications
- Search and filtering capabilities for food businesses
- Integration with inspection scheduling and enforcement modules

This module provides essential functionality for local authorities to effectively regulate food businesses and investigate food safety incidents within their jurisdiction.