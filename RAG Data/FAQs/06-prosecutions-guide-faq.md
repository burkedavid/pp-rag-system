# Prosecutions Guide

## Introduction

The following section will introduce users to the new Prosecution Module. The module functions just like any other, offering a dedicated space for these records to live, along with associated search, view, create and saved search areas.

## View Prosecutions

The View Prosecutions left hand menu, allows users to view all prosecution records available in the system. These are ordered by creation date and will display various detail related to the record.

In addition, we have added an add button at bottom of the screen, if users wish to add a new prosecution record.

## Search Prosecutions

The Search Prosecutions left hand menu allows users to search prosecution records based on custom criteria.

Following a search, results will be displayed accordingly. Records can be opened by clicking on the returned row. Users can also export their results to Word or Excel as appropriate.

### Save Search

If a user regularly runs a specific query they can save the search criteria. Simply populate the search fields as appropriate and click the save search button.

Once a Name and Description has been defined, the search will be added to the Saved Searches left hand menu for future use.

## Saved Searches

Here, users will find any previously saved searches. The saved searches are unique to the individual user and as such can be added and deleted by the user as appropriate.

## Create Prosecution Record

By clicking the Create Prosecution left hand menu option, users can add a new prosecution record to the system. From here, the record can be linked to a parent record as appropriate. This is essentially doing the reverse of what users are perhaps used to, when adding a prosecution from the prosecution left hand menu on a licence or premises record for example.

Please note, this screen can also be accessed via the "Add" button found on the "View Prosecutions" left hand menu.

### Main Form

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Prosecution Against | Dropdown List and Related Search Area | This field allows users to select which parent record the prosecution should be linked to. The drop down list of options is predefined by Idox. Once an option is selected, the associated search button will allow users to search for the record. Once the prosecution is created, it will appear in the prosecutions left hand menu of the parent record. |
| Officer | Dropdown List | This field allows the user to record the responsible officer. |
| Core Function | Dropdown List | This field allows the user to record the core function. |
| Prosecution Type | Dropdown List | This field allows the user to record the prosecution type. Prosecution Types can be managed via Admin > Prosecution > Type of Prosecution. |
| Last Visit Date | Date Field | This field allows the user to record the last visit date. |
| Committed Date | Date Field | This field allows the user to record the committed date. |
| Prosecution Date | Date Field | This field allows the user to record the prosecution date. |
| Court Hearing Date | Date Field | This field allows the user to record the court hearing date. |
| Date Conviction Spent | Date Field | This field allows the user to record the date the conviction is spent. |
| Period of Offence Start | Date Field | This field allows the user to record the date the period of the offence starts. |
| Period of Offence End | Date Field | This field allows the user to record the date the period of the offence ends. |
| Appeal Date | Date Field | This field allows the user to record the appeal date. |
| Prosecution Location | Dropdown List | This field allows users to record the location of the prosecution. Prosecution Locations can be managed via Admin > Prosecutions > Prosecution Location. |
| Prosecution Plea | Dropdown List | This field allows users to record the prosecution plea. Prosecution Pleas can be managed via Admin > Prosecutions > Prosecution Plea. |
| Prosecution Result | Dropdown List | This field allows users to record the prosecution result. Prosecution Results can be managed via Admin > Prosecutions > Prosecution Results. |
| Cost Incurred (£) | Numeric Field | This field allows users to record the cost incurred in pounds and pennies. |
| Cost Awarded (£) | Numeric Field | This field allows users to record the cost awarded in pounds and pennies. |
| Fines Imposed (£) | Numeric Field | This field allows users to record the fine imposed in pounds and pennies. |
| Victim Surcharge | Numeric Field | This field allows users to record the victim surcharge in pounds and pennies. |
| Remarks | Rich Text Editor Field | This field allows users to record additional written remarks relevant to the prosecution. |
| Custodian Code | Dropdown List | This field will only appear for multi council sites where the user has more than one council area defined against their profile AND they have the view custodian code admin privilege. |

### Regulations

Users can also record regulations relevant to the prosecution via the multi row add button.

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Legislation Breached | Dropdown List | This field allows users to record the legislation breached. Options can be configured via Admin > Prosecutions > Legislation Breached. |
| Date of Breach | Date Field | This field allows users to record the date the legislation was breached. |
| Prosecution Result | Dropdown List | This field allows users to record the prosecution result specific to the piece of legislation breached. Prosecution Results can be managed via Admin > Prosecutions > Prosecution Results. |
| Regulation | Free Text Field | This field allows users to record the regulation details. |
| Section/Regulation Number | Free Text Field | This field allows users to record the regulation number. |
| Regulation Remarks | Free Text Field | This field allows users to record remarks concerning the regulation. |

Users can define as many regulation rows as is required. Additionally a row may be removed simply be clicking the Remove button adjacent to that row.

### Offences

Similar to the previous section, users can also record offences relevant to the prosecution via the multi row add button.

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Offence | Free Text Field | This field allows users to record the offence committed. |
| Fine (£) | Numeric Field | This field allows users to record the fine relating to the offence committed. |

Users can define as many offence rows as is required. Additionally a row may be removed simply be clicking the Remove button adjacent to that row.

### Save Record

Once the form has been completed, users should click Save, at which point the record will be created and linked to the appropriate parent record. Please note a unique prosecution number will be assigned to the record at this time.