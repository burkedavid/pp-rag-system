# Licences Guide

## Processing Online Applications

### New Applications

When a licensing application is submitted via the Council Direct portal, it will appear on the public protection system, under Licensing > Online Applications > New Applications.

These applications will appear here in order of most recently received and at initial glance will provide a summary of the information submitted such as the basic licence information and verification on whether the application has been paid for.

Any applications which have not automatically matched both the proposed licence holder and the proposed licensable area with existing records on the system, will show as "unmatched" under the licence location column (for more details on matching see below).

### Search Submissions

Online Applications that have been processed will automatically be removed from the New Applications area. The search submissions area can be used to search for such applications.

When a result is clicked on, users will be able to review details of the online application as it appeared immediately prior to being processed. If the online application was accepted a visual queue will display at the bottom of the screen.

### Online Activity

The online activity area has been designed to keep users abreast of any updates made by council direct users to previously submitted online applications. Please note that online applications can only be updated whilst the online application is pending a decision.

In addition to the details of the online application that it relates to, users will note that the activity and content columns provide a summary of the activity that has occurred. Clicking on the entry will navigate the user to the online application record. Clicking the read checkbox will remove the adjacent activity from the list.

### Processing Online Applications - Basic Overview

The following section will provide users with a list of considerations, alongside a basic workflow for processing online applications.

#### 1. Payments

Prior to processing an online application, users should ensure that they review the payment status of the application, verifying that the amount and payment status is as expected.

#### 2. Matching Proposed Licence Holder and Proposed Licence Area

The public protection system will automatically attempt to match the proposed licence holder and the proposed licence area (contact/location etc) automatically upon receipt of the online application.

The data provided at submission, will be compared against appropriate records stored in the database, and if an acceptable match is found, this will be populated against the online record in the adjacent matched column.

If a match has not been found, or if the match suggested by the system is not suitable, the search button should be used in order to query the appropriate record in the system.

**Note:** The matching logic is not infallible. Users should always take care to verify ALL system matches, to ensure that the correct details are being processed.

#### 3. Linking Online Applications to Existing Licences

If the user identifies that an online application relates to an existing licence record it should be linked accordingly.

Clicking the search button will direct users to a licence search form, where the appropriate licence can be located and selected.

The user will be immediately prompted to save the record in order to pull through the existing licence details.

#### 4. Processing the New Application

With all of the above in hand, we can now start processing the rest of the information in order to process our new application record.

**Section 1 - Application Details**

- **Licence Area Description** - Free text field to record the Licence Area Description
- **Manual Reference** - Free text field to record the Manual Reference (if appropriate)
- **Licence Reference** - Free text field to record the Licence Reference
- **Received By** - Drop down to select the officer receiving the application
- **Received Date** - Date selection field to record the application received date
- **Officer** - Drop down to select the officer responsible for the application

**Section 2 - Additional Licence Data and Licence Specific Tab**

- All new online applications will provide a summary of the details submitted by the council direct user as part of their online application. This information will be displayed in read only format and should be reviewed as appropriate to ensure that all necessary detail, attachments etc have been provided.
- If an application has been linked to an existing licence per "Step 3", then users will also be required to review and compare the submitted information against the information on the existing licence record.

Users will see information submitted by the council direct user on the left, and information that exists on the linked record on the right. The radio buttons should be used as appropriate, to select the required information that should appear on the new application.

#### 5. Saving and Selecting a Status

Once the online application is ready, the user should select a online application status. The status dropdown is populated via Admin > Licensing > Online Submission Status.

- If a status with the "submission accepted" checkbox against it is saved, then a new Application record will be created and the council direct user will be notified accordingly.
- If a status with the "submission declined" checkbox against it is saved, then the Online Application will be rejected, removed from the list and the council direct user will be notified accordingly.

## Full Application Records

### Link to the Online Application

Any online application that is accepted will generate a brand new "full application" record within the Licensing Module.

The online reference will be located at the top of the main licence tab on the new record. Clicking this will navigate the user to the online application as it appeared immediately prior to acceptance.

### View Parent Data Left Hand Menu

In such instances where a user has linked an online application to an existing licence record, an additional left hand menu item will be available. This left hand menu, provides (similar to step 4 above) a comparison between details recorded on the application and the parent record.

Here users can review and compare data between the application and the parent licence record. Also if necessary, the user can select conditions from the parent licence, to copy across to the new application.

Similar to before, the existing content can be selected and saved so that they can be transferred to the application record.

## Status History

The Status History left hand menu against Licence Applications/Records will automatically record changes to the application/licence status throughout its life-cycle.

| Field | Description |
|-------|-------------|
| Start Date | Automatically populated with the date the status was set |
| End Date | Empty until such time as that status is changed to another |
| Issue Date | If present at the time of the status change, taken from the record at the time of the status change |
| Status | Description of the status being referenced |
| Officer | Officer who made the status change |
| Comments | Comment is automatically taken from the recorded change (if provided) |

The above fields are all read only UNLESS the user has been granted the "can edit licence status history" privilege in which case these can be edited and/or removed completely as appropriate.

## Licence Committees

### Introduction

We are pleased to confirm the addition of a new Licence Committees area (found within the Licence Module). This new functionality will allow users to mark and prepare Licence Applications for Committee Hearings and document these records along with their associated data as part of a Committee Report.

### Initial Setup and User Profiles

In order to access the Licence Committee area within the Licencing Module, users will need to have the necessary permissions applied to their user profile. Simply navigate to the user profile (or user group if applicable) and set the privilege for "Licence Committees". Similar to other privileges, this can be set to Read/Write, Read Only or No Access at all.

In addition, a system Admin user should ensure that both Licence Committee Agenda Templates and Licence Committee Outcome Types are defined prior to the use of the Licence Committee area. These can be found in Admin > Licensing and are explained below in this article. Additionally licence statuses will need to be updated and or/created as necessary.

### Licence Committee Left Hand Menu

Users with relevant permissions will find a new licence committee left hand menu, with the Licence module area.

Here users can view a list of most recently added committees in addition to performing specific searches for Licence Committees.