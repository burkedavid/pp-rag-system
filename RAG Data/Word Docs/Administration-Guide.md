# Idox Cloud Public Protection Administration Guide

# Idox Cloud Public Protection

# Administration Guide

Idox





Copyright notice

All rights reserved. The material contained within this publication is the copyright of Idox plc, or has been reproduced with the permission of the third party to whom the copyright belongs. Except in the manner and to the degree permitted by any overriding United Kingdom legislation or by an express provision within this publication, the material may not be reproduced or exploited in any manner, in whole or in part, without the prior written approval of the copyright owner concerned.

The material, which is subject to change at any time without notice, may, within the limitations imposed herein, be used for the sole purpose for which it has been prepared by parties acquiring it legitimately, but only on the understanding that no liability shall attach to Idox plc from such use.

No warranty is given, or is intended to be implied, by Idox plc as to accuracy of the information contained within this publication.

Ownership of the following trademarks (™) is claimed by Idox plc: Idox Cloud™

All referenced third-party trademarks are hereby acknowledged to their rightful owners by Idox plc.

©2025 Idox plc, Unit 5, 8 Forsyth Road, Woking GU21 5SB

This guide was last updated on 01 May 2025.





Contents

About this guide	7

Common administration tasks	9

Working with administration records	9

Adding secondary records	11

Setting up lists	12

Maintaining fee types	14

General system-wide administration	17

General administration options	17

Maintaining activity codes	20

Maintaining note severities	22

Maintaining payment methods	23

Maintaining cost codes and fund codes	24

Maintaining online inspection forms using Form Builder	25

Maintaining email branding	41

Defining "reply to" email addresses	43

Maintaining SMS templates	43

General case-related administration	45

Configuring communication templates	45

Creating a communication type record	46

Setting up a communication template in Word	47

Setting up a communication template using the internal editor	48

Using smarty codes to output case details	50

Inspections administration options	54

Maintaining inspection forms	56

Transferring inspections between officers in bulk	57

Maintaining inspection activities	58

Maintaining standard phrase paragraph codes	59

Maintaining standard phrases	60

Mapping cost codes for inspection activities	61

Assessments administration options	62

Setting up risk assessments	62

Maintaining risk categories	66

Samples administration options	68

Maintaining sample results	69

Maintaining sample result types	70

Actions administration options	71

Maintaining action codes	71

Setting up action schedules	73

Configuring action workflows	75

Notices administration options	80

Maintaining notice groups	81

Maintaining notice types	82

Maintaining identification types	84

Mapping cost codes for notices	85

Prosecutions administration options	86

Maintaining prosecution types	87

Initiatives administration options	88

Maintaining initiative types	88

Maintaining initiative templates	89

Bookings administration options	90

Maintaining booking types	91

Maintaining booking frequencies	94

Maintaining block bookings	94

Contact, property, spatial, and location administration	103

DTF/GIS Settings administration options	103

Managing the importing of DTF gazetteer data	104

Maintaining layer groups	106

Defining layer rendering styles	106

Maintaining map layers	109

Configuring the global spatial settings	113

Locations/LLPG administration options	115

Configuring map options	115

Contact Settings administration options	116

Maintaining contact types	117

Specifying the contact type for builders in the Grants module	118

Maintaining conviction types	119

Module-specific administration	121

Licensing administration options	121

Configuring licence types	126

Configuring licence-specific tabs	154

Configuring application types	156

Configuring licence statuses	158

Mapping cost codes for Licensing	159

Maintaining invoice types	160

Maintaining licence references	161

Maintaining licence bands	162

Configuring licence conditions	163

Maintaining vehicle models	164

Maintaining premises types	164

Maintaining recorded change types	165

Maintaining online submission statuses	166

Configuring an online licence menu	167

Configuring committee agenda templates	174

Maintaining committee meeting outcomes	175

Configuring the online licence register	176





# About this guide

This guide provides information on the administration of Idox Cloud Public Protection. It's intended for system administration users of the system, who have appropriate security permissions to configure and maintain user accounts, the content of drop-down code lists, document templates, and other configuration settings.

This guide doesn't include general details on using Idox Cloud Public Protection. For information on these, see one of the Idox Cloud Public Protection User Guides.

Note:	Please be aware that making changes in the Admin area (beyond the user profile) will impact all other users.

# How this guide is structured

This guide contains the following chapters:

## Chapter 1	Common administration tasks

Provides useful information about tasks you'll need to perform throughout the administration area of Idox Cloud Public Protection. This includes tips on working with administration records, and creating values to populate lists.

## Chapter 2	General system-wide administration

Details the administration functionality affecting the running of the system.

This covers functionality under the General and Users options in the Admin Areas menu.

## Chapter 3	General case-related administration

Details the general administration functionality relating to case records in all modules.

This covers functionality under the Communications, Inspections, Assessments, Samples, Actions, Notices, Bookings, Prosecutions, and Initiatives options in the Admin Areas menu.

## Chapter 4	Contact, spatial, and location administration

Details the administration of contact, spatial (GIS), and location functionality.

This covers functionality under the Contacts, DTF/GIS Settings, and Locations/LLPG options in the Admin Areas menu.

## Chapter 5	Module-specific administration

Provides details of the administration options specific to the individual modules in Idox Cloud Public Protection.

This covers functionality under the Licensing option in the Admin Areas menu.









## Chapter 1

# Common administration tasks

This chapter provides useful information about tasks you'll need to perform throughout the administration area of Idox Cloud Public Protection. This includes tips on working with administration records, and creating values to populate lists.

Tip:	For information about general common functionality in Idox Cloud Public Protection, please see one of the Idox Cloud Public Protection User Guides.



## Working with administration records

## Navigating the admin areas

The functionality covered by this guide is available under the Admin item  in the top menu. On selecting this, the Admin Areas menu is displayed down the left of the page. This contains headings for each administration area.

Clicking the + button next to a heading expands the menu for that area.



In each administration area, there are several standard tasks you can normally perform.

## Working in an admin area

When working in an admin area - for example Users Admin - a context-sensitive Admin menu is displayed on the left side of the page, giving you options to create and view records. This is displayed above the general Admin Areas menu.



This menu will provide options to perform tasks relevant to the area.

## Creating a record

Select the Create... option in the Admin menu to create a record.

## Viewing records

To display a list of the records available, select the List...option in the Admin menu.

## Opening and editing a record

To open and edit a record, display the list of records, and then click on the record in the list.

## Enabling or disabling records

You can enable or disable administration records, to specify whether they'll be available for use in the system.

Tip:	When records are no longer required, you should disable them rather than delete them. This ensures that, while users will no longer be able to select the record against current cases, it will still be related to historical records.

To enable or disable a record:

From the context-sensitive Admin menu, select List... to view the records.

To change whether disabled records are listed, do one of the following depending on the record type:

From the Admin menu, select Show Disabled.

Above the list, select or deselect the Show Disabled option as appropriate.



Select or deselect the Enabled checkbox next to the listed records as required.

## Changing the order of list items

[TBC whether this is just for map layers - move this info it that section if so] For some record types, you can specify the order in which the records will be displayed. To do this, on the summary page for the record type, use the up and down arrows at the end of the row to change the position of the record. The value in the Load Order field is updated automatically. Click Save to confirm.





### Adding secondary records

## About secondary records

Some records in the Admin area require secondary records against them. For example, in Licence Type Admin, you can add secondary records defining the default consultees, prerequisites and so.

The way that you do this is the same throughout.

## Adding records

To add secondary records to an administration record:

Click the down arrow  in the subsection to display more details.



Click the Edit button to open the Edit window.

Click Add. A blank row is added.



Record details in the fields provided.

To add further secondary records, repeat steps 3 and 4.

Click Save. The secondary records are listed against the administration record.





## Setting up lists

## About simple lists and activating/dependent ["dependent" suggested as a term by Darren Page in Planning doc] lists

In the Admin area, you can specify the values which will be displayed in lists throughout the system. There are two types of lists:

Simple lists: these lists simply contain values that users can select. Selecting a value doesn't impact any other part of the system.

Activating lists: when users select a value from one of these lists, this impacts something else in the system. For example:

Selecting a record type from a list may display more fields on the page for users to fill in, specific to the record type.

Or selecting a value may progress the case to the next stage.

Sometimes, you can set a list value as the default which will be selected if users don't physically select anything else.

The way that you add or edit values for each list type is similar.

## Creating or editing a list value

To create or edit a value for a list:

In the Admin Areas menu, select the List... item for the relevant area, as described in Working with administration records on page 9.

The context-sensitive menu is displayed, and the existing values for the list are displayed, as in the following example.



Do one of the following:

To create a new value, from the context-sensitive menu on the left, select the Create... option.

The relevant "add" page is displayed.



To edit an existing value, click on it in the list. The relevant "edit" page is displayed.



For new list values, in the Code field, type a unique code to represent the list value.

In the Description field, type a description of the list value as it'll appear in the list.

For activating list values, specify the additional details as described in the relevant section in this guide.

If you want the list value to be available for selection now, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.

## Specifying the default value for a list

If a list page contains an Is Default column, this means that you can specify the value which will be selected by default.

To do this, on the list page,

From the top menu, select System, then the relevant option.



In the Is Default column, click the Select button on the value you want to be the default.

Text stating "Selected" is displayed for the value.



## Maintaining fee types

## About fee types

For several modules in Idox Cloud Public Protection, you can maintain the fee types available for adding to a case. These specify how fees are calculated for cases.

In the fee type record, you define how the fee type will be calculated by setting up fee conditions. For each fee condition:

You can specify whether it relates to a flat fee or a charge per unit.

If charging per unit, you can add several factors such as an initial fee, and a maximum fee amount.

You can add a "range" of numbers of units that the fee condition will apply for.

For example, you could specify that the fee condition would apply when there are more than two units, and fewer than ten.

## Setting up a fee type

To set up a fee type:

In the Admin Areas left menu, select the option relating to the module you want to set up the fee type for, for example Inspection.

Under this menu option, select the Fee Types option (or Fee/Fine Types in the Dog module). The existing fee types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If creating a new fee type, type a unique Code and a Description of the fee, as they'll be displayed in the system.

To create a new fee condition, click the Add button. A blank row is added.



Record details in the Fee/Rate section as follows:

If the condition relates to a flat fee: select the Flat Fee checkbox and then record the following:



If the condition doesn't relate to a flat fee: record the following:



To specify the range of unit numbers that this fee condition will apply for, record details in the following fields:

If the fee should be rounded when part units are recorded in the case, from the Round Remainder Units list, select whether the number of units should be rounded up, down, or to the nearest unit.

If the total for this fee type must not exceed the maximum for this fee condition, select the Maximum Fee Ceiling checkbox.

To add further fee conditions, repeat steps 5 to 9.

If you want the fee type to be available for use on the system straight away, in the Details section, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.





## Chapter 2

# General system-wide administration

This chapter details the administration functionality affecting the running of the system.

This covers functionality under the General and Users options in the Admin Areas menu.



## General administration options

The General option in the left hand Admin Areas menu provides the following options: [maybe break these down a bit to make navigation easier]





### Maintaining activity codes

## About activity codes

When an inspection record is created, this must include an activity code for the inspection. The activity code determines the details displayed for the inspection.

When setting up an activity code, you can specify:

Basic details such as the core function and inspection group it's available under.

Whether other details will be required, such as risk assessments and samples.

Whether other tabs will be displayed.

The inspection form that will be available.

Tip:	If you don't specify a form, the default inspection form will be used. This contains basic fields to add time spent, actions, and comments.

The action workflow which will be used by default.

Note:	Before setting up an activity code, make sure you've set up the associated inspection type, inspection group, and form, and optionally the sample code and action workflow.

## Setting up an activity code

To create or amend an activity code:

In the Admin Areas left menu, from the General option, select Activity Codes. The existing activity codes are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new activity code, type a unique Activity Code for the activity.

Record the following details:



Note:	The Is Inspection Pro Formas Required option is no longer used.

If the activity code relates to a visit where samples will be taken [is this what "sample code" means?]:

Select Is this a Sample code. Further fields are displayed.

Select the Type of Sample that'll be taken.

Select whether this will be an Official or Informal [visit?].

To specify the inspection form(s) which will be available:

From the Use Forms From options, select Form Builder. New fields are displayed, labelled differently depending on the option you selected.

Note:	The Survey Forms option relates to legacy functionality, and should not be used for new activity codes.

Select the Default Form Builder Form to use.

To specify forms that users will be able to use as an alternative, select as many as required from the Available Form Builder Forms field.

To add an action workflow to be displayed for inspections using this activity code, select the Default Action Workflow from the list.

If this activity code relates to inspections for permits for gambling, and so should be included in the Gambling Return [is this right?], select Is Permit.

By default, the activity code will be available for use as soon as you save it. If you won't want it to be used yet, deselect the Enable Activity Code checkbox.

Click Submit.



### Maintaining note severities

## About note severity

When users add notes against a record, they specify the severity of the note. For each note severity, you can specify the background colour that will be used for the notes.

## Adding or amending a note severity

To add or amend a note severity:

In the Admin Areas left menu, from the General option, select Note Severity. The existing note severities are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new note severity, type a unique Code for the severity.

From the Display Type list, select the type of note this severity is for, determining the background colour to use.

This table shows examples.

If you want the note severity to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save. You're returned to the Note Severity page.

To [what's the Additional Contact option for?], select Additional Contact against the severity in the list.



### Maintaining payment methods

## About payment methods

The Payment Methods functionality determines the list of payment methods users can select when recording payments against fees.

For each payment method, you can select whether it relates to card payments. [how is this information used?]

You can also specify which payment method will be selected by default.

## Setting up a payment method

To create or amend a payment method:

In the Admin Areas left menu, from the General option, select Payment Methods. The existing methods are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new payment method, type a unique code in the Code field.

In the Description field, type a description of the payment method as it'll be displayed in the system.

If this payment method relates to card payments, select Card Payment.

If you want the note severity to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining cost codes and fund codes

## About cost codes and fund codes

Cost codes and fund codes are used to ensure that payments made using a third party payment provider get directed to the appropriate place in your authority's finance system. Each payment must include a cost code and a fund code.

Using the Cost Codes and Fund Codes options, you can set up the cost and fund codes available. Shared service authorities can also specify which authority each code will be available for.

Users can then select the relevant cost and fund codes when recording a payment.

Additionally, you can map cost and fund codes to:

Licence types and licence application types - see Mapping cost codes for Licensing on page 159.

Activity codes - see Mapping cost codes for inspection activities on page 61.

Notice types and classifications - see Mapping cost codes for notices on page 85.

[others to follow]

The way that you set up cost codes and fund codes is the same.

## Setting up cost codes or fund codes

To add or amend a cost code or fund code:

In the Admin Areas left menu, from the General option, select Cost Codes or Fund Codes as appropriate. The existing codes are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new cost or fund code, type a unique code in the Code field.

In the Description field, type a description of the cost or fund code as it'll be displayed in the system.

For shared service authorities: from the Council list, select the authority that this cost or fund code will be displayed for.

Tip:	If you don't select an authority, the code will be available for all authorities.

If you want the code to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining online inspection forms using Form Builder

## About Form Builder

Using Form Builder, you can create online inspection forms to your authority's exact specifications. You do this by adding sections to the form, and including questions of different types within each section.

You can either create unique sections and questions for a form, or you can create standard sections and questions for inclusion in multiple forms. This saves you having to create the same details several times.

Once the form is set up, you can link it to the relevant activity code(s), to make it available from inspections using the activity code - see Maintaining activity codes on page 20.

Users can then fill the form in, either on Idox Cloud Public Protection, or using the Public Protection Inspections app on their mobile device.

Note:	For information about setting up printable forms, see Maintaining inspection forms on page 56.

## Section types

When creating a form, you can specify whether the top-level sections will be displayed:

As normal sections, one below the other.

As separate tabs.

As "accordion-style" sections - when you open one section, the other sections will be collapsed.

As separate steps [not working in system].

## Question types

When setting up a standard or unique question, you can specify the type of fields that will need populating to provide the answer. These can be:

Text fields.

Numeric fields.

Dropdown lists.

Radio buttons.

Tables. These can be:

Multi row tables, where the user can add extra rows.

Static tables, where the number of rows is predefined.

Calculated values, for example the sum of two other answers.

Fields populated automatically by the system.



#### Setting up a form using Form Builder

## About using Form Builder

When setting up a form, you can select standard sections and standard questions, or you can create unique sections and questions. The way you set up a question depends on the type of answer it will require.

## Setting up a form

To set up a form using Form Builder:

In the Admin Areas left menu, from the General option, select Form Builder Standard Section. The existing standard sections are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new form, in the Name field, type the name as it'll be displayed in lists.

Add a more detailed description in the Description field. This may be useful when you want to reopen and amend the form.

From the Form Type list, select one of the following:

To add a standard section to the form, select the section from the Standard Sections list. Then click + to add it.

To add a unique section to the form:

Click the Add Section button.

In the Section Name field, type the name of the section as it'll appear on the form.

If required, add a more detailed description in the Section Description field. This will be displayed alongside the Section Name in a smaller font.

Select the following for the section as appropriate:

To add a standard question to a section, select the question from the Standard Questions list. Then click + to add it.

To add a unique question to a section:

Click Add Question. A new question section is added.



Follow the steps for the type of answer the question will require. See:

Setting up a question requiring a text, date, time, or numeric answer on page 29.

Setting up a question requiring a selected answer on page 30.

Setting up a question requiring a calculated value answer on page 32.

Setting up a question requiring answers in a table on page 34.

Setting up a question requiring an answer from system details on page 36.

Adding a signature field on page 38.

Adding a label on page 38.

To add further questions, repeat step 9 or 10. To add further sections, repeat step 6 or 7.

To reorder the sections and/or questions within the sections, use the up and down arrows in the section or question heading as required.

Or to remove a section or question, click the X in the heading.

If you want the form to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save. You're returned to the Form Builder Form Config page.

## Previewing a form

To preview the form, reopen the Form Builder record and click the Preview button.

Note:	Make sure you've saved any changes, or these won't be shown in the preview.



##### Setting up a question requiring a text, date, time, or numeric answer

To set up a question requiring a text, date, time, or numeric answer, either within a form or as a standard question:

In the Label field, type the question text.

From the Input Type field, select the type of answer required for the question:

Add details in the following fields:

If you selected an Input Type of Text, in the Placeholder field, type a placeholder which will be displayed if you didn't specify a Default Value.

This will be removed as soon as users start typing in the field.



##### Setting up a question requiring a selected answer

## About input types for selectable answers

If you'll need users to provide a specific answer, you can set up the question so they can select:

A checkbox.

From a set of radio buttons.

A single item from a list.

Multiple items from a list.

## List options

When setting up lists, you can:

Manually create entries for selection. When doing this, you can add a value to the list item.

This is particularly useful if you want to use the answer in a calculated value question - see Setting up a question requiring a calculated value answer on page 32.

Select a type of system record, for example activity codes. The records for that type of record will be populated into the list as entries.

## Question behaviours

For radio buttons and single item selection lists, you can specify a set of behaviours, determining when other questions or subsections will be hidden based on the answer to the question.

Tip:	These are limited to questions and subsections in the same section as the question you're setting up.

For example, you may have a question of "Does the food business provide takeaways?" Only if the user selected "Yes" would you want to display a follow up question of "What type of food is delivered?", otherwise this would remain hidden.

## Setting up a question

To set up a question with selectable answers, either within a form or as a standard question:

In the Label field, type the question text.

From the Input Type field, select the type of answer required for the question:



Depending on the Input Type you selected, Options and/or Question Behaviour tabs may be displayed.

Add details in the following fields:

If an Options tab is displayed:

Select the tab.

To populate the list with values from a system record, select the type of record from the Or list.

Alternatively, to manually populate the list with entries, follow the rest of these steps.

Click the Add Option button. A new row is displayed.



In the Display Text field, type the text to show for the option.

If you want to attach a numerical value to the option, add this to the Weighted Value field.

Tip:	The weighted value won't be displayed on screen.

Repeat steps c to e to add further options.

If a Question Behaviour tab is displayed: [I can only get this to work when setting up a dropdown list question to show/hide another dropdown list, multiple dropdown question, or subsection. Any idea why?]

Select the tab.

Click the Add Behaviour button. A new row is displayed.



From the Behaviour Type list, select whether to show or hide a question or section based on the behaviour you're about to specify.

From the Behaviour Target Type list displayed, select Question to show/hide a question in this section, or Section to show/hide a subsection of the current section.

From the Behaviour Target list displayed, select the question or section which will be shown or hidden.

Note:	If you selected a Behaviour Type of Show, make sure the question or section you select has the Display On Load checkbox deselected.

From the Behaviour Trigger list displayed, select whether the behaviour will take effect when a specific option is selected for this question, when any option is selected, or when no option is selected.

If you chose When Option Selected, from the Behaviour Trigger Value list displayed, select the option which must be selected for the behaviour you've defined to be enacted.

To add further behaviours, repeat steps b to g.

To define a default answer for the question, select the Attributes tab if it isn't already, and then in the Default Value field, select the default answer. Users will be able to override this as required.

Tip:	For Checkbox questions, select or deselect the checkbox as required.



##### Setting up a question requiring a calculated value answer

## About calculated values

You can set up a question to be automatically answered with a value calculated from one or more other answers in a section.

When specifying the questions to use, these can either be ones requiring numeric answers - including other "calculated value" questions - or they can be ones with values you've assigned in the background to radio button or list options.

Tip:	These questions must be in the same section as the "calculated value" question you're setting up.

You can then specify how the values for the answers will be used to reach the calculated value. This could be a simple calculation, average, minimum or maximum value, or based on several conditions.

## Setting up a question

To set up a calculated value question, either within a form or as a standard question:

In the Label field, type the question text.

From the Input Type field, select Calculated Value.

From the Calculation Type list, select how the values of the answers to the relevant questions will be used:

If you want the question and answer to appear every time this inspection form is selected, select Display On Load. [this option doesn't seem to work for Calculated Value answers - it's always displayed. Any idea why?]

On selecting a Calculation Type, a Calculation tab is displayed for the question. Select this.

The details on the Calculation tab differ depending on the Calculation Type you selected.

If you selected a Calculation Type of Total, Average, Maximum Value, or Minimum Value:

Click the Add Row button. A new row is displayed.



From the Field list, select the first question to use in the calculation.

If the value of the answer to the question should be multiplied when performing the calculation, amend the value in the Multiplier field as appropriate.

Repeat these steps to add further questions to the calculation.

If you selected a Calculation Type of Conditional:

Click the Add Row button. A new row is displayed.



From the Condition Type list, select how the score for the answer must relate to the condition for the condition to be applied. For example, whether it needs to equal the value.

The option you select determines the fields displayed.

From the Field list, select the question to use in the calculation.

If a Field Value field is displayed, type the value that must (or mustn't) be provided as the answer to the question for this condition to apply.

If Range From and Range To fields are displayed, type the minimum and maximum values that must (or mustn't) be provided as the answer to the question for this condition to apply.

In the Conditional Value field, type the numeric value which will be applied if this condition is met.



##### Setting up a question requiring answers in a table

## About static and multi-row tables

If you need users to provide answers to a question in a table, you can create a "static table" or "multi-row table" question.

For static tables, you set up the columns and a set number of rows. You can set different attributes for each table cell in each row, and users will be unable to add further rows.

For multi-row tables, you set up the columns and the attributes to use for each table cell in all rows. Users will be able to add further rows as required.

When setting up either type of table, you specify the type of fields to include. These can be any of the field types used for creating questions in Form Builder.

The method for setting up each type of table is slightly different.

## Setting up a question requiring answers in a static table

To set up a static table question, either within a form or as a standard question:

Add the following details:

To set up the columns for the table:

Select the Static Table Columns tab.

Click Add Static Table Column. A new subsection is displayed.



In the Display Text field, type the column heading.

If required, in the Helper Text field, type any extra text advising how to fill in the column. This will be displayed when the user hovers over a question mark icon displayed next to the column heading.

To add further columns, repeat steps b to d.

To set up the rows for the table:

Select the Static Table Row tab. Sub-tabs are displayed for each column you created.



In the sub-tab for the first column, from the Input Type list, select the type of field to include in this table cell.

Add details for the field type, as described in the relevant "Setting up a question..." topic in this section.

To set up the rest of the cells in the first table row, select the relevant sub-tab and repeat steps b and c.

To add further rows, click the Add Static Table Row button and repeat steps b to d.

## Setting up a question requiring answers in a multi-row table

To set up a multi-row table question, either within a form or as a standard question:

Add the following details:

Select the Multi Row Table Settings tab.

Click Add Multi Row Column. A new section is displayed.



In the Label field, type the column heading.

From the Input Type list, select the type of field to include in this table cell.

Add details for the field type, as described in the relevant "Setting up a question..." topic in this section.

To add further columns, repeat steps 3 to 6.



##### Setting up a question requiring an answer from system details

## About system input and system field answers

If a question needs to be answered using data recorded already on the system, you can create a "system input" or "system field" question:

For "system input" questions, you can specify whether users need to record details for a contact, location, or standard phrase. ["Standard phrase" inputs link to the standard phrase lists, but the contact/location ones don't seem to. It looks like it just displays the fields for the record type, but when you populate them it doesn't create or link to a contact or location]

For "system field" questions, you can specify the system field from which details will automatically be pulled through for the related record.

## Setting up a question

To set up a "system input" or "system field" question, either within a form or as a standard question:

Add the following details:

If you selected an Input Type of System Input, record the following details:

If you selected an Input Type of System Field:

From the System Area list, select the area that the field is contained within.

From the System Field list displayed, select the field in the system area that will be used to provide the answer.



##### Adding a signature field

To add a field in which users can add a signature, either within a form or as a standard question, add the following details:





##### Adding a label

## About labels

As well as adding sections and subsections to a form, you can add extra labels between questions. This will just appear as text, and not require any input from users.

Note:	The label will be displayed in the space where a question would be included, so it's a good idea to add the label an "even" numbered question in the section.

## Adding the label

To add a label, either within a form or as a standard question, add the following details:





#### Setting up a standard question

## About standard questions

When creating standard questions, you can set up questions with various different answer types, as you would when creating unique questions in a form. Once you've set up a standard question, you can then:

Include it in a standard section - see Setting up a standard section on page 40.

Add it to a form - see Setting up a form using Form Builder on page 26.

## Setting up a question

To set up a standard question:

In the Admin Areas left menu, from the General option, select Form Builder Standard Question. The existing questions are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new question, type a name for the question in the Name field.

In the Description field, type a description of the question as it'll be displayed in the system.

To add the question details, follow the steps for the type of answer the question will require. See:

Setting up a question requiring a text, date, time, or numeric answer on page 29.

Setting up a question requiring a selected answer on page 30.

Setting up a question requiring a calculated value answer on page 32.

Setting up a question requiring answers in a table on page 34.

Setting up a question requiring an answer from system details on page 36.

Adding a signature field on page 38.

Adding a label on page 38.

If you want the question to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



#### Setting up a standard section

## About standard sections

When creating a standard section, you can add unique [or standard? No access to this functionality at present] questions to it, and can add subsections if required.

You can then add the standard section to a form - see Setting up a form using Form Builder on page 26.

## Setting up a section

To set up a standard section for use in Form Builder:

In the Admin Areas left menu, from the General option, select Form Builder Standard Section. The existing standard sections are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new section, type a name for the section in the Name field.

In the Description field, type a description of the section as it'll be displayed in the system.

In the Section Name field, type the name of the section as it'll appear on the form.

If required, add a more detailed description in the Section Description field. This will be displayed alongside the Section Name in a smaller font.

If you want the section to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining email branding

## About branding

When users generate an email from within the system, they can select an Email Brand to use. You set these up under the Branding option.

The branding defines the general detail for the email, including:

The colours used.

The global information to include, in different sections of the email. This can include details such as the council address, logo, and contact details.

## Setting up a branding record

To create or amend a branding record:

In the Admin Areas left menu, from the General option, select Branding. The branding records are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



From the Council list, select the authority that this branding will be displayed for.

If you're creating a new branding record, type a unique code in the Code field.

In the ...Hex fields, specify the background colour for the following areas of the email:



To do this, you can do the following:

Type the hexadecimal value in the field.

Click in the field and select a colour from the pallet.



To add an image to the top of the logo, click Choose file and then browse for and select the image.

In the Header field, type and format the text to display in the header section of the email. If you selected an image, the header text will be displayed below that.

In the Footer field, type and format the text to display in the footer section of the email. This will be displayed below the contact details you'll record in the next fields.

In the Contact Number, Contact Email, and Contact Fax fields, type the contact numbers and address for the authority. These will be displayed below the body of the email.

Note:	The Contact Number must be populated - you won't be able to save the record without this.

In the Address field, type and format the address of the authority. This will be displayed above the contact details you just recorded.

To send a test email to your email account to see how the branding will look, select the Test email? checkbox.

Tip:	The email will be sent after you click Save.

If you want the branding to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.

If you selected "Test email?", a test email is sent to your email account.



### Defining "reply to" email addresses

## About "reply to" email addresses

When users generate an email from within the system, they can select a "reply to" email address from a list. The email will be addressed from this address, and so any replies will be sent there.

You can specify the email addresses listed, and which authority they'll be available for.

## Defining a "reply to" address

To define a "reply to" email address:

In the Admin Areas left menu, from the General option, select Reply To Emails. The "reply to" records are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Select the Council the email address will be available for.

Type the address in the Email field.

If you want the address to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining SMS templates

## About SMS templates

Using the SMS Template functionality, you can create templates for text messages which can be sent from Idox Cloud Public Protection. These could be texts sent in bulk from an initiative record, or sent individually to a contact.

When creating a template, you can:

Specify which core function(s) the template will be available from.

Add standard text as required.

Use "smarty" codes to include case details where appropriate.

Note:	The length of the message text you can specify in a template is not limited. Because of this, sending an SMS text message using an SMS template may involve the sending of multiple texts. Please check the character limit of a single SMS text message with your SMS provider.

## Setting up a template

To set up an SMS template:

In the Admin Areas left menu, from the General option, select SMS Templates. The existing template records are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new template, type a unique Code for the template.

In the Description field, type a description for the template as it'll be displayed in the system.

Optionally, select the Core Function the template will be available under.

In the Template field, type the standard text you want to include in the message.

To insert smarty codes which will be replaced with case details in the generated message:

In the Template field, place the cursor where you want to insert the code.

Scroll down the list of codes below the Template field until you find the one you want. Then click the Insert button next to it.

The code is added to the Template field.

Repeat this steps for each code you want to add.

If you want the template to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.





## Chapter 3

# General case-related administration

This chapter details the general administration functionality relating to case records in all modules. This includes administration of secondary module records such as inspections and notices.

This covers functionality under the Communications, Inspections, Assessments, Samples, Actions, Notices, Bookings, and Prosecutions options in the Admin Areas menu. [TS imports. GDPR?]



## Configuring communication templates

## About communication templates

Communication templates are used when communications are generated throughout the system. These could be in relation to any aspect of processing a case through the system, and may follow a specific action or activity.

Communication templates can either be created in Microsoft Word or using the internal editor.

Note:	It's recommended that only users with HTML knowledge set up templates in the internal editor.

If the communication is generated automatically by the system, the correct template will be selected automatically. Otherwise, users will need to select the communication template when generating the communication.

## Communication templates and communication type records

Each communication template is contained in a communication type record.

The first step is to set up the communication type record - see Creating a communication type record on page 46.

When doing this, you can:

Specify whether to use a Word template or one using the internal editor.

If using a Word template, select an existing file that's already been created in Word to use as the template.

Once you've saved the record, you can set up the template.

If you're setting up a Word template, you do this as described in Setting up a communication template in Word on page 47.

If you're using the internal editor, you do this as described in Setting up a communication template using the internal editor on page 48.

You can format the template, and use "smarty" codes to include case details where appropriate.

For details about using smarty codes, see Using smarty codes to output case details on page 50.



### Creating a communication type record

To create a communication type record:

Do one of the following:

If you have access to the Admin top menu, select this. Then in the Admin Areas left menu, from the Communications option, select Communications.

If you just have access to the Comms Admin top menu, select this. Then expand the Communications left menu, and select Communications.

The existing communication type records are listed.

In the Communications left menu, select Create Communications. The Create Communication Type page opens.



Record the following details:

If you'll be using a Word document for this template:

Select the Word Template checkbox. A new Upload Existing File field is displayed.

If you have an existing file you want to use as the basis for the template, click Choose file, and then browse for and select the file.

Otherwise, a blank document will be created automatically.

Unless you uploaded a Word document that's ready for use, deselect the Enable Communication checkbox until you've finished creating the template.

Click Save. You're returned to the list of communication types.

You can now set up the template.



### Setting up a communication template in Word

## About setting up communication templates

Once you've created a communication type record, an Edit button will be displayed against the record on the Communication Type Records page.

If you selected the Word Template checkbox against the communication type, clicking the button opens the template for editing in Word.

## Setting up a template in Word

When a communication template is opened in Word, you:

Add and format regular content as you normally would in Word.

Add smarty codes to include case information - see Using smarty codes to output case details on page 50.

Save your changes in Word, and then close the Word document.

Return to Idox Cloud Public Protection. The Document Saved page is displayed.



Click the Confirm Save button at the bottom of the page. The document is saved back into the system.

Once you're happy with the template, select the Enabled checkbox to make it available on the system.

## Changing the template version used

For documents created in Word, the version history is displayed in the communication record details.



From here, you can select the Active option against a different version of the template to make that the version that'll be used.

Note:	You can't undo this.



### Setting up a communication template using the internal editor

## About setting up communication templates

Once you've created a communication type record, a button will be displayed against the record on the Communication Type Records page.

If a template hasn't been set up for a communication type record, the button will be labelled Create.

Otherwise, it'll be labelled Edit.

If you didn't select the Word Template checkbox against the communication type, clicking the button opens the template for editing in the internal editor.

## Setting up a template using the internal editor

When a communication template is opened in the internal editor, a new Communication Codes page is displayed showing the template.



To set up this template, you just need to:

Add and format regular content, using the tips for guidance outlined in Internal editor tips on page 49.

Add smarty codes to include case information - see Using smarty codes to output case details on page 50.

Click Save below the template. You're returned to the list of communication types.

Once you're happy with the template, select the Enabled checkbox to make it available on the system.



#### Internal editor tips

These tips may be useful when using the internal editor:

If you find you can't type in the template when you first open it, click the Source button once, and then click it again.

To make it easier to work with the template, you can click the maximise button . This will make the editor take up the whole of the browser window.

Clicking it again will return you to the initial view.

As the editor is contained in a browser, you can't use the Tab key to indent text. This will just move to the next field in the window. Instead, use the increase indent  and decrease indent  buttons.

The editor doesn't have:

A way of including headers and footer areas. If you need these, it's recommended you set the template up in Word.

Rulers. Instead, either use the indent keys to format text, or add the text in a table. This may also be useful for defining headers and footers.

When pasting information from other sources, such as Word:

It's recommended you use the option to paste as plain text, to ensure hidden formatting elements aren't brought across.

Some complex tables may need reformatting to display correctly within the editor.

By default, a carriage return creates a large space (paragraph break) between lines. To create a smaller single-line space, use Ctrl+Enter keys together.

To add an image to a template:

It's recommended you add a URL linking to the image, for example so you use the authority logo image on the authority website. This will ensure the image is updated in line with the authority website.

Alternatively, you can add images into the template itself, but these will have to be added to the editor folder on the server.

You can use the page break button  to add a page break, which will be used when printing the document.



### Using smarty codes to output case details

[Please check all the examples in this section, and also add anything you think would be useful]

## About smarty codes

You can use smarty codes to pull information from a case record into a communication generated for that record.

If you add a smarty code to a communication template, then when the communication is generated, the code is replaced with the value for the field from the case.

Note:	When inserting these codes, make sure the opening and closing curly brackets {} aren't removed by mistake. This will make the codes invalid and cause problems when the documents are created.

## Adding smarty codes to a template

The way that you add smarty codes differs depending on the type of template you're setting up:

If you're setting a template up in Word:

When you open the document from within the system, the Document Opened page is displayed in your browser. This includes a </> Codes button at the bottom.



Click the </> Codes button. The Communication Codes page opens.



To filter the codes, either type the text you want to find in the Search for descriptions... or Search for codes... field, or select the area from the dropdown list.

Once you've found the code you want, copy and paste the code from the Code field into the Word document.

If you're setting up a template using the internal editor, when editing the template:

Place the cursor where you want to insert the code in the template.

Scroll down below the template. The codes are listed.



To filter the codes, either type the text you want to find in the Search for descriptions... or Search for codes... field, or select the area from the dropdown list.

Once you've found the code you want, click the Insert button. The code is pasted in wherever the cursor was position.

Note:	You can only view the smarty codes available from the Admin Areas > Communications > Comm Codes option.

## Including details from multiple child records

For multiple occurrence records, you can add a foreach repeat statement to add details from all instances of the record.

For example, the following would add the start and end times for each day of a Temporary Event Notice:

{foreach from=$Licence->TENOperatingSchedules item=ten_operating_schedules} Day: {$ten_operating_schedules->day}

Start Time: {$ten_operating_schedules->start_time}

End Time: {$ten_operating_schedules->end_time}

{/foreach}

## Optionally including details

To include information in a document dependent on something else, you can include an if statement

For example, this sentence would only be included in a consultation letter when the licence application type description was "Temporary Event Notice":

{if $Licence->LicenceApplicationType->description == "Temporary Event Notice"}Representations must specify in detail the grounds of opposition and must relate to the promotion of the licensing objectives.{/if}

And if you want to include either one set of details or another, you can add an elseif statement. In this example:

If the DTF location field is not empty, the licence trading name and location will be displayed.

If the DTF location is empty, then if the licence premises ID is not empty, the premises name and location will be displayed.

{if !empty($Licence->dtf_location_id) }{$Licence->trading_name} {$Licence->Location->formatted_display_address}

{elseif !empty($Licence->premise_id)} {$Licence->Premises[0]->name} {$Licence->Premises[0]->Location->formatted_display_address} {/if}

## Adding a table of items

You may want to include details from multiple child records in a table. To do this, you need to add:

The opening part of the "foreach" statement at the end of the last column heading.

The end part of the "foreach" statement at the end of the last cell.

This table shows an example. This table will populate with a row for each schedule of work item.

## Specifying data formats

You can also specify the format that some types of data will be displayed in:

Date formatting: by adding |dateformat details before the closing bracket.

To specify the date in dd/mm/yyyy format, you'd use %d/%m/%Y, for example {$Licence->PersonalLicence->date_of_birth |date_format:"%d/%m/%Y"} would be 27/02/2024.

To specify the date with the month spelt out, you'd use %B for the month value, for example {$Licence->PersonalLicence->date_of_birth |date_format:"%d %B %Y"} would be this format: 27 February 2024.

Upper and lower case:

For upper case, you can add |upper before the closing bracket, for example {$Licence->LicenceDescription->description|upper}.

For lower case, you can add |lower before the closing bracket, for example {$Licence->LicenceDescription->description|lower}.

Decimal places: you can specify the number of decimal places for number fields by adding |string_format details before the closing bracket. For example, {$Licence->fee|string_format:"%.2f"} would include values to two decimal places.

## Adding calculated dates

You may want to add a date which is a certain number of days beyond the date specified in a field in a case, for example. To do this, you need to create a variable for the "field date plus number of days" value, and then create another variable to format the date. You can then reference the second variable to insert it.

This shows an example where 14 days are added to the application valid date:

{assign var="date" value= $Application->valid_date|@strtotime + (60*60*24*14)}
{assign var="date2" value=$date|date_format:"%d %B %Y"}
{$date2}

## Finding out more about smarty codes

There's plenty more information about smarty codes available online, such as the Smarty Documentation available here:

https://smarty-php.github.io/smarty/stable/designers/language-basic-syntax/



## Inspections administration options

The Inspections option in the left hand Admin Areas menu provides the following options:





### Maintaining inspection forms

## About inspection forms

[NOTE: this is how I feel it should work, but I can't get it working. There doesn't seem to be any way of adding content to the Word doc and saving it back to the system. Has anyone got this to work?]

To enable users to print forms for use during inspections, you can create inspection form records, and set up Word documents as form templates for each record.

You can set up several form records for each core function, and then when users click the Print Form button on the inspection record [how is it determined which one is used?].

## Creating an inspection form record

To create an inspection form:

In the Admin Areas left menu, from the Inspections option, select Inspection Forms. The existing form records are listed.

In the Inspection Forms left menu, select Create Form. The Create New Inspection Form page opens.



Record the following details:

Click Save. Your new form record is listed on the Inspection Form Records page.

You can now set up the form in Word.

## Setting up a form in Word

To set up an inspection form in Word, from the Inspection Form Records page:

Click on the inspection form record to open it.

Click the Open button, and save the form to a suitable location.

Edit the document in Word.

Tip:	To add inspection data to the form, use the "smarty" codes listed under Admin Areas > Communications > Comm Codes.

For more about smarty codes, see Using smarty codes to output case details on page 50

Save your changes and close the Word document.

Return to the inspection form record in Idox Cloud Public Protection, and click Submit.



### Transferring inspections between officers in bulk

## About inspection transfer

Using the Transfer Inspections option, you can transfer the allocation of inspection records from one officer to another, based on criteria you specify. You can also transfer associated premises records [is this only the premises records associated with the inspections being transferred, or is it all premises records assigned to the Officer From officer?].

You can specify the date range for inspections which will be transferred.

You can either transfer inspections from all core functions, or from one core function at a time as required.

Note:	Please take care when using this functionality, as changes to large volumes of records can be made in a single batch update.

## Transferring inspections

To transfer inspections between officers in bulk:

In the Admin Areas left menu, from the Inspections option, select Transfer Inspections. The Transfer Inspections page is displayed.



From the Officer From and Officer To lists, select the officers that inspections will be transferred from and to.

To specify the range of inspections to copy across:

Select the Inspection Schedule checkbox. Date fields are displayed.

In the From Date and To Date fields, specify the earliest and latest planned dates for inspections that will be copied across.

For information on recording dates, see Populating date fields.

To also change the responsible officer for the associated premises records, select the Premises Responsible Officer checkbox.

From the Core Function list, either select the core function that inspection records must be recorded under to be transferred, or select All.

Tip:	If you want to transfer inspections for multiple - but not all - core functions, you'll need to perform this task individually for each required core function.

Click the Submit button. A message is displayed stating that the transfer was successful.



### Maintaining inspection activities

## About inspection activities

For inspections which use the Activities tab [where is it defined which inspections this tab is displayed for? I set up an activity for Licensing, and while the Activities tab is displayed on initial creation of the inspection, when you first click Save it disappears], you can set up the activities which users can select. You specify the activities by core function.

For each activity, you can select which section it will be displayed in on the Activities tab.

## Setting up an activity

To create or amend an inspection activity:

In the Admin Areas left menu, from the Inspections option, select Inspection Activities. The existing activities are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Record the following details:

Select the checkbox(es) for the sections the activity will be available under.

If you want the activity to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Submit.



### Maintaining standard phrase paragraph codes

## About standard phrase paragraph codes

Where users can add standard phrases throughout the system, these are associated with standard phrase paragraph codes. When they select a paragraph code, the standard phrases associated with the paragraph code are then made available for selection.

When setting up paragraph codes, you associate the code with a classification code [what does this do? All paragraph codes are available for selection in licence/inspection records regardless of classification]. Then, when you set up a standard paragraph, you associate it with the paragraph code - see Maintaining standard phrases on page 60.

## Setting up a standard phrase paragraph code

To create or amend a standard phrase paragraph code:

In the Admin Areas left menu, from the Inspections option, select Standard Phrase Paragraph Codes. The existing paragraph codes are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Record the following details:

If the paragraph code should only be available for specific core functions, select these from the Core Function(s) list.

If you want the paragraph code to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining standard phrases

## About standard phrases

When setting up the standard phrases users can select throughout the system, you first associate the phrase with a paragraph code - the phrase will only be available for selection once the user has selected this code.

You can then add and format text for the standard phrase as required.

## Setting up a standard phrase

To set up a standard phrase:

In the Admin Areas left menu, from the Inspections option, select Standard Phrases. The existing phrases are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Record the following details:

In the Description field, add a format the text to use as the standard paragraph.

This field expands as you add more text.

If you want the phrase to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.

## Change the load order of standard phrases

On the Standard Phrase page, you can change the order of the phrases in the standard phrase list. To do this:

Find the section for the paragraph code that the phrases are associated with.

To change the position of a phrase, hold the mouse button down over the phrase and drag it to the new position.



The Load Order values are updated automatically.



### Mapping cost codes for inspection activities

## About cost code mappings

Each financial transaction related to inspections in Idox Cloud Public Protection must have a fund code and a cost code.

To ensure payments get directed to the appropriate place in your finance system, for each combination of core function and activity code which has the Allow Fees option selected, you need to map each relevant cost code and fund code.

For information about setting up cost and fund codes, see Maintaining cost codes and fund codes on page 24.

For information about setting up activity codes, see Maintaining activity codes on page 20.

## Mapping a cost code and fund code

To map a cost code and fund code to a combination of core function and activity code:

In the Admin Areas left menu, from the Inspections option, select Activity Code Cost Code Map. The existing mappings are listed.

Check through these to determine whether a cost code and fund code is already mapped to the combination of core function and activity code you want to configure.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page..



Record details in the following fields as appropriate:

If you want the mapping to apply straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



## Assessments administration options

The Assessments option in the left hand Admin Areas menu provides the following options:





### Setting up risk assessments

## About risk assessments

When set up for an activity code, users will need to record scores against a risk assessment in the inspection record.

When setting up a risk assessment, you can specify:

Risk areas for the assessment. You can create:

General risk areas. These act as section headings in the risk assessment configuration, but are not displayed to end users. You can use these so it's easier to manage the questions in the risk assessment.

Specific risk areas. These act as questions for the assessment, and will be displayed to end users.

The scores available to provide as answers for each specific risk area.

How the overall score for the assessment will be calculated.

When the risk assessment will start being used.

Note:	There can only be one active risk assessment for each core function. When you set a start date for a risk assessment, once that date is reached, the previous assessment for the core function will no longer be used.

Once you've set up a risk assessment, you can then use risk categories to define how far in the future the next inspection date should be, based on the score - see Maintaining risk categories on page 66.

## If a risk assessment needs changes

If a risk assessment requires any changes, it's strongly recommended that you create a new risk assessment record, rather than amending an existing one, and give it a future start date. This ensures that the integrity of any existing risk assessment data in inspection records is retained.

The options available when changing an existing risk assessment have been restricted to help support this.

## Setting up an assessment

To set up a new risk assessment:

In the Admin Areas left menu, from the Assessments option, select Risk Assessment. The existing assessment records are listed.

In the Risk Assessment left menu, select Create Risk Assessment. The Create New Risk Assessment page opens.



Add the following details for the assessment.



Tip:	To make the risk assessment available when setting up risk categories, leave the Enable Risk Assessment option selected.

Click Submit. A new Risk Areas section is displayed.



To add a general risk area:

Click the Add button above the Risk Area section. The Add General Risk Area window opens.



In the Title field, add the text to use for the general risk area, then click Save. A new row is added to the Risk Area section, ready for you to add specific risk areas.



Tip:	If there are any issues with the area you just created, click Delete and start again.

To add a specific risk area to a general risk area:

Click the Add button in the Specific Risk Areas column in the general risk area. The Add Specific Risk Area window opens.



Add the following details:



Click Save. Details of the specific risk area are shown under the general risk area.



To add the possible scores for a specific risk area:

Click the Add button in the Scores column. The Add Score window opens.



Add the Score and a Description.

Tip:	End users will see the Score in a list they can select from. After selecting it, the Description will be displayed alongside.

Click Save. The description and score are added under the specific risk area.



Tip:	To change the details of this score, click the Edit button. Or to remove it, click Delete.

To add further scores, repeat these steps.

To add further specific risk areas to a general risk area, repeat steps 6 and 7.

To add further general risk areas, repeat steps 5 to 8.

If you want the assessment to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Submit. The risk assessment is listed on the Risk Assessment Records page.

To make the assessment available for

You can now create risk categories to assign to the overall score.



### Maintaining risk categories

## About risk categories

After setting up a risk assessment, you then need to create a series of risk category records relating to the assessment. These will be used to determine the overall risk rating for an assessment.

You create individual records for each risk category, and in these you specify:

The core function and risk assessment the risk category relates to.

The scores between which the risk category applies.

If another inspection should be scheduled following completion of the risk assessment, and if so when and what this should be, including whether a target date should be set.

Note:	Before setting up a risk category, you must have set up and enabled the risk assessment you want to associate it with - see Setting up risk assessments on page 62.

## Creating a risk category record

To create a risk category record:

In the Admin Areas left menu, from the Assessments option, select Risk Categories. A list is shown of the risk assessments for which risk categories have been set up.

To check that the category hasn't already been set up, click on the relevant risk assessment to view its categories.



To create a new risk category, in the Risk Category left menu, select Create Category. The Create New Risk Category page opens.



Add the following details:

If another inspection should be scheduled following the completion of the risk assessment, do the following:

Select Scheduled Inspection Required. Further fields are displayed.

Add the following details:

If a target should be set for completing the scheduled inspection:

Select Target Required.

In the Target to complete scheduled inspections field displayed, type the number of days [from the Planned Date of the inspection?] by which the scheduled inspection should be completed. [where is this target used? I can't find anything in the inspection record for this]

Click Submit. The risk category is added to the list on the Risk Category Records page.

## Viewing and editing the risk categories for a risk assessment

Once risk categories have been associated with a risk assessment, they will be listed under the assessment on the Risk Category Records page, as shown after step 2 above. From there, you can:

Click on a risk category to open and edit it.

Deselect the Enable checkbox against a risk category to prevent it from being used in assessments.



## Samples administration options

The Samples option in the left hand Admin Areas menu provides the following options:





### Maintaining sample results

## About sample results

For each core function, you can maintain the list of results available from the ...Results list. This list is labelled different depending on sample result types set up for the sample type. For information on these, see Maintaining sample result types on page 70.

## Setting up a sample result

To create or edit a sample result:

In the Admin Areas left menu, from the Samples option, select Sample Results. The existing results are listed by core function.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new result, in the Sample Result Code field, type a unique code.

In the Sample Result Description field, type a description of the result as it'll be displayed in the system.

From the Core Function list, select the core function the result will be available from.

If you want the result to be available for use on the system straight away, select the Enable Sample Result checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Submit.



### Maintaining sample result types

## About sample result types

By setting up sample result types, you can determine the ...Result fields displayed for each sample type. You can set up multiple result types for each sample type, and these will be displayed as separate fields on the Edit Sample window:



Each result type field is populated with the sample results values set up for the core function - see Maintaining sample results on page 69.

## Setting up a sample result type

To create or edit a sample result type:

In the Admin Areas left menu, from the Samples option, select Sample Result Types. The existing results are listed by sample type.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



In the Types of Sample Result field, type the text to display next to the result type field.

From the Type of Sample list, select the sample type that this result type will be displayed for.

If you want the result type to be available for use on the system straight away, select the Enable Types of Sample Result checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Submit.



## Actions administration options

The Actions option in the left hand Admin Areas menu provides the following options:

Note:	The Type of Action functionality is no longer used.



### Maintaining action codes

## About action codes

Action codes are used to specify the behaviour of created actions. For each action code, you can specify details including:

Where it will be available.

Whether on completion a communication and/or action schedule will be generated automatically.

Whether a fee will be calculated for the action based on the minutes taken.

## Setting up an action code

To create or edit an action code:

In the Admin Areas left menu, from the Action option, select Action Codes. The Action Codes page is displayed.

To find the action code you want to edit, or to check whether an action code already exists:

From the list field, select the core function you want to search action codes for, then click Submit. The action codes are listed.

Scroll down and search for the action code.

If the action code exists, click on it to open it.

If the action code doesn't exist, to create a new record, from the Action Codes left menu, select Create Code.



Add the following details:







If you want the action code to be available for use on the system straight away, select the Enable Action Coded checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Submit.



### Setting up action schedules

## About action schedules

Using actions schedules, you can record sets of actions which can be added to a case as a package. This helps the user to follow a standard process when dealing with certain types of case.

For each action you add, you can specify the number of days from the action creation date by which it should be completed. This enables you to build up a schedule of work for the actions.

Tip:	The schedule is calculated excluding holiday dates. For more information about these, see [cross ref].

## Setting up a schedule

To set up an action schedule:

In the Admin Areas left menu, from the Action option, select Action Schedule. The existing schedules are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new action schedule:

Add the following details:

Click Save. You're returned to the Action Schedule page.

Click on the action schedule record to open it.

Tip:	If the action record hasn't been enabled yet, you'll need to select Show Disabled from the Action Schedules left menu to display it in the list.

A new Code field is displayed under the Core Function, which is now read-only.



If you're editing an action schedule, amend the Code or Description as required.

To add an action to the schedule:

Select the action from the Code list, and then click Add. A new row is added to the Schedule of Work section.



In the Days field, type the number of days from the action being created by which it should be completed, excluding holiday dates.

This will be used to populate the Planned Date for the action.

To add further actions, repeat step 5.

To change the order of the actions:

Click the Sort button.

Drag and drop each action to the relevant position as required.



Once you've finished changing the order, click the Stop button.

If you want the action schedule to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Configuring action workflows

## About action workflows

An action workflow acts as a wizard to guide users through a series of questions to work out which action or action schedule is required. They can then create the action or schedule from the workflow.

When configuring an action workflow, you:

Specify which module(s) the workflow will be available from.

Set up a question, then set up several answers to the question as options for the user to select.

For each answer, you can add further questions with answers as required. This creates "branches" in the tree view of questions and options. The end of each branch leads to a decision as to what action or action schedule is required.

Tip:	If you need to edit a question, answer or decision at a later date, you just need to click on it in the tree view to open the edit window.

This image shows an example of the configuration. This example has an initial question with answers of "Yes" and "No". A further question will be displayed if the user selects "Yes" as the first answer.



## Configuring a workflow

To configure an action workflow:

In the Admin Areas left menu, from the Action option, select Action Workflows. The existing workflows are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Add the initial details - see Adding initial action workflow details on page 77.

Tip:	When doing this, make sure you click Save to display further options.

Add a question - see Adding a question to an action workflow on page 77.

Add options for the question - see Adding an answer option to an action workflow on page 78.

Repeat steps 4 and 5 to create as appropriate.

Add a decision linked to an action or action schedule at the end of each "branch" of the tree view - see Adding a decision at the end of an action workflow question branch on page 79.

Click Save.



#### Adding initial action workflow details

To add the initial details for an action workflow, with the workflow record open:

Record details in the following fields:

Select the checkboxes for the modules you want the action workflow to be available from.

Select the Enabled checkbox.

Tip:	The action workflow will need to be enabled before you can add questions to it.

Click Save. You're returned to the Action Workflow page.

You can now configure the questions for the action workflow.



#### Adding a question to an action workflow

To add a question to an action workflow, from the Action Workflow page:

Click on the action workflow record to open it.

An (Add question) box is displayed at the bottom of the Action Workflow Edit page.



Click (Add question). The Add Question window opens.



In the Description field, type the question as it'll appear to users.

In the Additional Help Text field, type extra text to help clarify the question. This will be displayed below the Description.

Click Save. The window is closed, and your question is added to the Action Workflow Edit page. An (Add option) box is displayed below the question.



You can now add the possible answers to the question.



#### Adding an answer option to an action workflow

To add an answer to a question set up in an action workflow, with the action workflow record open:

Under the question you want to provide an answer for, click (Add option). The Add Option window opens.



In the Description field, type the option answer as it'll appear to users.

In the Additional Help Text field, type extra text to help clarify the answer. This will be displayed [TBC]:



Click Save. The window is closed, and your answer is added to the Action Workflow Edit page. A further question box and a decision box are displayed below the answer.



You can now:

Add another question that users will need to answer having selected this answer.

Add a "decision" stating the action or action schedule which is required.



#### Adding a decision at the end of an action workflow question branch

To add a decision at the end of the "branch" of questions, with the action workflow record open:

Under the relevant answer, click the (Add decision) box. The Add Decision window opens.



Record the following details for the decision:

Do one of the following:

If an action schedule is required, select it from the Action Schedule list.

If a single action is required, select it from the Action Code list.

When you select from either of these lists, the other list is hidden.

Click Save. The decision is displayed underneath the answer.



If you added the decision by mistake, after saving the workflow record, you can click the X at the end of the row to remove it.



## Notices administration options

The Notices option in the left hand Admin Areas menu provides the following options:





### Maintaining notice groups

To create or amend a notice group:

In the Admin Areas left menu, from the Notices option, select Notice Groups. The existing groups are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Add the following details:

If you want the group to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining notice types

## About notice types

When creating a notice record, users need to select the notice type. The selected notice type determines how various other details are populated.

When setting up a notice type, you can specify details including:

The communication templates to use for notices, reminders, and follow-ups.

The default offence details and action schedules.

The maximum penalty on conviction.

The time periods for appeals and payments.

## If notice payment can be made online

If recipients will be able to make payments for the notice type online, you may want to ensure that the communication template used will include a link to the online payment page. To do this, you can add a smarty code for:

The unique PIN generated when the case is created. The code to use is: 
{$Notice->generated_pin}

A QR code. The code to use is: 
<img src="/images/qr_codes/{$Communication->Notice->qr_code_filename}" />

For more about smarty codes, see Using smarty codes to output case details on page 50.

## Setting up a notice type

To create or edit a notice type:

In the Admin Areas left menu, from the Notices option, select Notice Types. The existing types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Add the following details:

If a fee is required for the notice:

Select the Fee Required checkbox. Further fields are displayed.

Add the following details:

Add the rest of these details as required:

If you want the notice type to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Submit.



### Maintaining identification types

## About identification types

Using the Identification Types functionality, you can maintain the types of identification users can select against notice records. For each identification type, you can specify how long the photo image associated with the identification type will be kept on the system before being deleted.

[may need amending once I've seen this in action]

## Setting up an identification type

To create or amend a notice group

In the Admin Areas left menu, from the Notices option, select Identification Types. The existing types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Add the following details:

If you want the identification type to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Mapping cost codes for notices

## About cost code mappings

Each financial transaction related to notices in Idox Cloud Public Protection must have a fund code and a cost code.

To ensure payments get directed to the appropriate place in your finance system, for each combination of notice type and notice classification where the notice type has the Fee Required option selected, you need to map each relevant cost code and fund code.

For information about setting up cost and fund codes, see Maintaining cost codes and fund codes on page 24.

For information about setting up activity codes, see Maintaining activity codes on page 20.

## Mapping a cost code and fund code

To map a cost code and fund code to a combination of core function and activity code:

In the Admin Areas left menu, from the Notices option, select Cost Code Map. The existing mappings are listed.

Check through these to determine whether a cost code and fund code is already mapped to the combination of notice type and notice classification you want to configure.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Record details in the following fields as appropriate:

If you want the mapping to apply straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



## Prosecutions administration options

The Prosecutions option in the left hand Admin Areas menu provides the following options:





### Maintaining prosecution types

To create or amend a prosecution type:

In the Admin Areas left menu, from the Prosecutions option, select Prosecution Types. The existing types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Add the following details:

If you want the prosecution type to be available for use on the system straight away, select the Enable Type of Prosecution checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Submit.



## Initiatives administration options

The Initiatives option in the left hand Admin Areas menu provides the following options:





### Maintaining initiative types

## About initiative types

When users create an initiate, they select an initiative type. The selected initiative type determines whether an option is displayed to create an inspection from the initiative record.

## Setting up an initiative type

To create or amend an initiative type:

In the Admin Areas left menu, from the Initiatives option, select Initiative Types. The existing types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Add the following details:

If you want the initiative type to be available for use on the system straight away, select the Enable Initiative Type checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Submit.



### Maintaining initiative templates

## About initiative templates

By setting up initiative templates, you can specify the communication template or SMS template to use when an initiative is created.

For information about setting up communication templates, see Configuring communication templates on page 45. For information about setting up SMS templates, see Maintaining SMS templates on page 43.

## Setting up an initiative template

To set up an initiative template:

In the Admin Areas left menu, from the Initiatives option, select Initiative Templates. The existing templates are listed, under the initiative types they're available from.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



In the Initiative Template Name field, type a unique name for the template.

Select the Initiative Type that this template will be available from.

If the initiative template is intended for generating letters:

Select Use Communication Template.

From the field displayed, select the communication template to use.

If the initiative template is intended for sending SMS text messages:

Select Is SMS Template.

From the SMS Template list, select the template to use.

The text from the template is displayed in the field below the SMS Template field.

Click Save.

On the Initiative Template Records page, the template is displayed in the section for the initiative type you selected.



Note:	The template record is enabled by default. If you don't want it to be used yet, deselect the Enabled checkbox.



## Bookings administration options

The Bookings option in the left hand Admin Areas menu provides the following options:





### Maintaining booking types

## About booking types

When users add a booking, they need to select a booking type.

When setting up booking types, you can define:

The default duration and user team for bookings.

The module the booking type is for.

The fee that will be added to the case when a booking is created.

The background colour to use for bookings on the calendar.

Whether the booking type should have booking subtypes which users will need to select from. When doing this, you specify the fee against each subtype, rather than the booking type.

## Setting up a booking type

To create or amend a booking type:

In the Admin Areas left menu, from the Bookings option, select Booking Types. The existing booking types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Add the following details:

If you selected a System Module of Licensing, do one of the following:

If the booking will have sub-types of booking, select Has Sub Types.

Otherwise, add the following details in the fields displayed after you select Licensing:

If you selected a System Module of Service Requests, do one of the following:

If the booking will have sub-types of booking, select Has Sub Types.

Otherwise, add the following details in the fields displayed after you select Licensing:

Add further details in these fields as required:

If you selected the Has Sub Types option, record the booking subtypes as follows:

To add a subtype, click the plus button .

Add the following details:



If you selected a System Module of Licensing, add the Licence Invoice Type and Licence Fee for the subtype, as described in step 4.

If you selected a System Module of Service Requests, add the Fee Type, Fee Unit Type, and Fee Units for the subtype, as described in step 5.

To add further subtypes, repeat these steps.

If you want the booking type to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining booking frequencies

## About booking frequencies

If a booking will need to be repeated at regular intervals, users can create a repeat booking. This will add further bookings at the frequency specified.

When maintaining the list of frequencies users can select from, for each list item, you specify the frequency in weeks.

## Setting up a frequency

To create or amend a booking frequency:

In the Admin Areas left menu, from the Bookings option, select Booking Frequencies. The existing booking frequencies are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new frequency, type a unique Code for the frequency.

Record the following details:

If you want the booking frequency to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining block bookings

## About block bookings

To ensure that a certain type of booking can be made at specific dates and times, you can create booking slots. These add empty bookings against a user team and optionally individual user, which can then be assigned to the relevant case.

This is particularly useful if you want customers to be able to booking appointments from Council Direct. Once enabled, the customer will be able to make the booking by selecting from the available slots.

Note:	Before setting up a block booking, you must have already set up the required booking type, holiday dates, email brand, and email reply to address, plus either the licence type or service request code.

## Setting up block bookings

When setting up block bookings, you:

Add the general details for the booking, including the booking type, user team, and optionally user the bookings will be associated with - see Recording basic block booking details on page 95.

Specifying the dates and times between which bookings will be possible, and generate booking slots for these - see Generating slots for a block booking on page 96.

If you want customers to be able to make bookings from Council Direct, add the details that will be displayed online, and configure the confirmation emails that will be sent - see Making block booking appointments available online on page 98.



#### Recording basic block booking details

To record the basic details for a block booking record:

In the Admin Areas left menu, from the Bookings option, select Block Bookings. The existing block booking records are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new frequency, type a unique Name for the frequency.

Add the following details for the block booking:

You can now:

Generate the block booking slots - see Generating slots for a block booking on page 96.

Add details to enable Council Direct users to book appointments from the block booking online - see Making block booking appointments available online on page 98.



#### Generating slots for a block booking

To generate the slots from which users will be able to select when booking an appointment, with the block booking record open:

In the Generate Slots section, add the following details:

On specifying the times of the first and last slots, an Exemptions section is displayed. If required, user the From and To fields to define a time period within the times specified where no slots will be generated.

Click the Calculate Slots button. Slots are generated within the timescales you specified.

Scroll down to the Slots section to view the new slots.

The slots are displayed on the calendar and in a list. You can scroll through either of these to view them.

Note that, if you specified that more than one booking can be made concurrently, there'll be multiple slots with the same date and time.



To remove a slot, deselect the checkbox next to it.

To generate further slots, repeat these steps.

Tip:	Once you've created and saved slots, these will be displayed in an Existing subsection to the left of the calendar.



#### Making block booking appointments available online

To enable Council Direct users to make appointments within a block booking, you first need to add the general configuration details, and then specify the content and appearance of the confirmation emails which will be sent.

## Adding general online configuration details

To add the general online configuration details, with the block booking record open:

In the Settings section, select the Available Online checkbox. New Online Configuration and Online Email Settings sections are displayed.



In the Online Configuration section, add the following details:

To specify how the fee for the appointment will need to be paid, do one of the following:

Select Manual Invoice if the customer will need to be invoice separately.

Select Online Payment if payment will need to be made online.

Then, if payment will need to be made at the same time as the appointment is booked, select Immediate Payment Required, and in the Payment Reservation expiry field, type the number of minutes from the payment page being displayed until the appointment reservation will be cancelled if payment doesn't go through.

Add the following further details:

If the booking type is associated with the Licensing module, record these details:

If the booking type is associated with the Service Requests module, do the following:

From the Service Request Subject list, select one of the following:



The fields displayed depend on the option you selected.

If you selected an option which involves the creation of a new service request, add the following details:



If you selected an option which may involve the user selecting an existing service request to associate the booking with, in the Service Request Code(s) field, specify the code(s) for the service requests that they'll be able to search for and select.

If you selected Fixed Service Request, click the Search button and search for and retrieve the service request to associate all bookings with.

## Configuring confirmation emails

To specify the content and format of confirmation emails for bookings:

Select the Online Email Settings section heading to open it.



Set the global details for all types of confirmation email in these fields:

You define the content for the Appointment Confirmed, Payment Confirmed, Appointment Cancelled, and Appointment Changed emails in the same way:

Add regular content in the fields provided.

To include details from the booking in the email using smarty codes, select the relevant detail from the Merge Codes list to copy the smarty code to your clipboard. Then paste it into the relevant email field.

Click Save. On saving your changes, in the Settings section, an Online URL field is displayed, with a URL providing a direct link to the appointments page for this type of booking on Council Direct.







## Chapter 4

# Contact, property, spatial, and location administration

This chapter details the administration of contact, spatial (GIS), and location functionality.

This covers functionality under the Contacts, DTF/GIS Settings, and Locations/LLPG options in the Admin Areas menu.



## DTF/GIS Settings administration options

The DTF/GIS Settings option in the left hand Admin Areas menu provides the following options:





### Managing the importing of DTF gazetteer data

To keep the address details used in Idox Cloud Public Protection up to date, you will need to import data transfer format (DTF) files of gazetteer data into the system. You import files on the D T F Record page, where you can also view details of previous imports. [do we need to state what DTF formats are supported?]

You can import CSV files containing:

A full extract of gazetteer data.

Change-only updates (COU) - in other words, only gazetteer details which have changed since the last import.

When viewing a previous import, you can download copies of the files used in the import, and view any errors.



#### Importing a DTF file

To import a DTF file:

In the Admin Areas left menu, from the DTF/GIS Settings option, select DTF Loader. The previous DTF imports are listed on the D T F Record page.

From the D T F Records left menu, select Upload DTF File. A Manual Import section is displayed.



Click the Choose file button, and then browse for and select the CSV file containing the gazetteer data. The filename is shown in the DTF File field.

If necessary, add a Comment about the import.

Click the Upload button. The file is imported and a record is created for it in the lower half of the page. [I assume. Please confirm]



#### Viewing details of previous imports

The bottom half of the D T F Record page contains a list of all imports made into the system. You can browse through these as required.



Clicking on a record displays details of the import:

The top half of the page shows basic details including:

Date and time.

Details of the files used in the import. You can download these to view their details.

If applicable, the bottom half of the page shows any errors that were encountered when loading the file, together with possible resolutions.





### Maintaining layer groups

## About layer groups

If your map contains a lot of layers, you can create layer groups to group the layers together. Layers belonging to the group will be displayed under a menu item for the group from the Display menu.



## Setting up a layer group

To set up a layer group:

In the Admin Areas left menu, from the DTF/GIS Settings option, select GIS Layer Groups. The existing layer groups are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're adding a new group, type a Name which will act as the internal identifier for the group.

Record the following details:

Click Save.



### Defining layer rendering styles

## About layer styles

To define how the features on the various layers will be rendered on the map, you set up layer styles. You can then apply these styles to:

The system layers in the GIS Setting Edit page - see Configuring the global spatial settings on page 113.

Other spatial layers, on the GIS Layer Add/Edit page - see Maintaining map layers on page 109.

## Setting up a layer style

To set up a layer rendering style:

In the Admin Areas left menu, from the DTF/GIS Settings option, select GIS Layer Styles. The existing bespoke rendering styles are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new style, in the Name field, type the name of the layer style as it'll be displayed in the system.

Change these style settings from the defaults as required:

If you selected a Fill Type of Pattern, define the pattern using the following fields:

Click Save.



### Maintaining map layers

## About map layer management

Using the GIS Layers option, you can set up the non-system layers displayed on the map. You can add the following types of layers:

A static layer format, as imported data.

A WMS tile feed to provide external map data.

A feed format using OpenLayers JS Code.

For each layer, you can specify the layer rendering to use, and optionally which layer group it should be displayed under. You can also add further information, such as source details, specific to the type of layer.

## Setting up a map layer

To set up a map layer:

In the Admin Areas left menu, from the DTF/GIS Settings option, select GIS Layers. The existing non-system layers are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're adding a new layer, type the Title of the layer as it'll be displayed in the system, and select one of the following from the Layer Data Source list:

Imported Data typically for a static layer format.

External Data typically where a WMS tile feed is used.

OpenLayers JS Code typically where a feed format is used.

Record the standard settings for all data sources as follows:

Add further details relating to the data source, as described in:

Adding details specific to OpenLayers JS Code layers on page 110.

Adding details specific to imported data layers on page 110.

Adding details specific to external data layers on page 112.

If you want the layer to be available now, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records.

Click Save.



#### Adding details specific to OpenLayers JS Code layers

Note:	Idox will provide the code required to configure OpenLayers JS Code layers.

If when adding a layer you selected a Layer Data Source of OpenLayers JS Code, the OpenLayers Config section is displayed:

In the Name field, type the name of the layer.

In the OpenLayers JS Code field, enter the code to display the layer.

Click Save.



#### Adding details specific to imported data layers

Note:	You cannot import layer files where the file names:

Begin with numeric characters, for example "123topoline.shp".

Contain spaces, for example "topo line.shp".

If when adding a layer you selected a Layer Data Source of Imported Data:

Record details in the following extra fields which are displayed in the Details section:

The Import Layer Data section is also displayed. Record details as follows:

From the Import File Format list, select the format of the file you want to import.

If you selected Shapefile, in the Shp, Shx, and Dbf sections, click the Choose File button, and then navigate to and select the relevant file.

If you selected MapInfo TAB, in the Tab, Date, Map, and ID sections, click the Choose File button, and then navigate to and select the relevant file.

Click Save.

Record the following details in the fields which are then displayed:

Click Save.

You can use this layer for answering as described in Using an imported layer for question answering.



#### Adding details specific to external data layers

If when adding a layer you selected a Layer Data Source of External Data:

Record details in the following extra fields which are displayed in the Details section:

The External Config section is also displayed. Add details in the following fields as appropriate:

Click Save.



#### Changing the sort order of the additional map layers

Note:	For information on changing the order of the system layers, see Configuring the global spatial settings on page 113.

To change the sort order of the manually-added map layers:

In the Admin Areas left menu, from the DTF/GIS Settings option, select GIS Layers. The existing non-system layers are listed.



To change the order that the layers will be displayed in on the map, use the up and down arrow buttons in the Load Order column.

Click Save.



#### Updating an imported map layer

If the source data for an imported file has changed, you can update the data in the imported map layer:

Open the layer details and click the Update Imported Data button.

The relevant fields will be displayed for the File Format assigned to the layer.

Select Choose File and then navigate to and select the updated files for each field displayed.

Click Save.



### Configuring the global spatial settings

The global settings define the defaults that'll be used whenever users open the map. This includes details such as the default location and zoom, and which layer style will be used for each system layer.

To configure the global spatial settings:

In the Admin Areas left menu, from the DTF/GIS Settings option, select GIS Settings. The current settings are displayed.



In the Default View Settings section, record the following:



Note:	These settings won't be used when users open the map from a record with a spatial extent already specified.

In the Default Layer Settings section:

From the Default System Style list, select the layer style to use for each system layer.

To change the order that the system layers will be displayed in on the map, use the up and down arrow buttons next to the required layer.

To copy the WFS URL for a layer to the clipboard for use elsewhere, click the blank button  next to the layer.

In the Default Print Settings section, select different values from the defaults as required.

To check that the spatial data used by the system is ok, click Check System GIS Data.

Click Save.



## Locations/LLPG administration options

The Locations/LLPG option in the left hand Admin Areas menu provides the following options:





### Configuring map options

## About map options

[what's the Map Options functionality for?]

## Configuring a map option

To create or amend a map option:

In the Admin Areas left menu, from the Locations/LLPG option, select Map Options. The existing map option records are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're adding a new map option, type a Name which will be displayed [TBC].

In the Option Value field, type [???].

If you want the record to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



## Contact Settings administration options

The Contact Settings option in the left hand Admin Areas menu provides the following options:





### Maintaining contact types

## About contact types

When creating a contact, users select a contact type. This may be the contact's profession, or their connection to a case, for example.

You can create contact types, and also define additional text fields which will be displayed when users select the contact type. These fields will be displayed against contacts of this type throughout the system.

## Adding or amending a contact type

To add or amend a contact type:

In the Admin Areas left menu, from the Contact Settings option, select Contact Types. The existing contact type records are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're adding a new contact type, type a Name as it will be displayed throughout the system.

If this contact type should be displayed in Council Direct, select Available Online.

If you want the contact type to be available now, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records.

To add bespoke fields to display after users select the contact type:

Click Add New. A new row is displayed.

In the Additional Field Name field, type the label to display against the field.

If you don't want this field to be displayed yet, deselect the Enabled checkbox.

Repeat these steps to add further fields.

Click Save.



### Specifying the contact type for builders in the Grants module

## About the builder contact type

Using the Builder Contact Type option, you can specify the default contact type to use for builders named when attaching costs to schedules of work in the Grants module.

You can only map one contact type under this option - this must already have been set up, as described in Maintaining contact types on page 117.

Specifying a contact type here limits the Contact Type list to this item when recording the submission of quotes against schedules of work. Because of this, it's a good idea to use a contact type which can be distinctly identified as for use in the Grants module.

## Specifying the contact type

To specify the contact type:

In the Admin Areas left menu, from the Contact Settings option, select Building Contact Type. If a contact type has previously been set up, it's listed.

Do one of the following:

If a contact type record is already listed, click on it to open it.

If a contact type record isn't listed, in the Builder Contact Type Maps left menu, select Create Builder Contact Type Map.

From the Contact Type list, select the contact type to use.

Click Save.



### Maintaining conviction types

## About conviction types

When making online submissions using Council Direct, applicants may need to declare any convictions - these will be saved against their contact record in Idox Cloud Public Protection. Additionally, users with the correct permissions can view conviction details in contact records, and add further convictions if necessary.

Using the Conviction Type functionality, you can create conviction types, and specify the question to display online for the conviction type. The conviction types can then be added to the online configuration for the relevant licence type - see Recording general online application type configuration details on page 144.

You can also specify whether users will be able to specify convictions with dates in the future.

## Adding or amending a conviction type

To add or amend a conviction type:

In the Admin Areas left menu, from the Contact Settings option, select Contact Types. The existing contact type records are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're adding a new contact type, type a unique Code.

Record the following details:

If you want the conviction type to be available now, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records.

Click Save.





## Chapter 5

# Module-specific administration

This chapter provides details of the administration options specific to the individual modules in Idox Cloud Public Protection.

This covers functionality under the Licensing, and [TBC] headings in the Admin Areas menu.



## Licensing administration options

The Licensing option in the left hand Admin Areas menu provides the following options:





### Configuring licence types

## About licence type configuration

Under the Licence Type Admin option, you can maintain the licence types used when generating licence application records.

When configuring a licence type, you specify details such as:

The dedicated "specific" tab to display. This tab contains fields relating to the particular subject area that the licence covers.

Details which will be displayed for licences of this type, such as prerequisites, default consultees, custom fields, fees and so on.

The details displayed on the online application forms for the relevant application types in Council Direct.

## Shared service configuration

If your authority is using Idox Cloud Public Protection as a shared service, tabs are displayed for each authority. This enables you to configure the licence type for your authority only. You can: [the following is a guess based on the info for Licence Specific Tabs - please confirm]

From the Copy Existing Configuration list, select the tab containing the existing configuration that to copy across [this is my best guess, based on the licence specific tab screenshot I've seen. Please confirm if this is right].

Select Create New Configuration, to set the details up from scratch as detailed in this section.

## Before configuring licence types

Make sure the following have been set up before configuring licence types: [would it be easier just to recommend you set licence types up last? Check whether other admin functionality involves selecting licence types]

Licence descriptions (which act as legislative groupings).

Licence application types (Initial, Amendment, Renewal, and so on).

Licence-specific tabs.

Action workflows.

Letter templates.

Licence capacities and licence bands if the licence type will include these types of fees.

## Configuration process

The process to configure a licence type is as follows:

For new licence types:

Create the licence type, by selecting Create Licence Type Admin in the Licence Type Admins menu.

Record basic details - see Recording basic licence type details on page 128.

Save the licence type record.

Associate the licence type with the application types which are applicable for it - see Configuring application types on page 156.

Reopen the licence type record, by selecting List Licence Admin Types and then selecting the record from the list

Alternatively, if editing a licence type, you just need to open it as in step 1e above. You can then amend the basic details in the same way.

Record general configuration details for the licence type - see Recording general licence type configuration details on page 131 .

Record any prerequisites - see Adding prerequisites on page 133.

Add standard parties who should be consulted by default for licences of this type - see Adding standard consultees on page 134.

Add any custom fields to display on the Additional tab - see Adding custom fields on page 135.

Specify which details will be copied from the original licence for renewals, variations, and new applications based on the licence record - see Defining the copy options on page 136.

Specify the action workflow(s) to add to application records - see Adding action workflows on page 136.

Specify the due date period for [determining the application?] - see Specifying due date days on page 137.

Set up the fees for the licence type - see Setting up fees on page 138.

Set up the online configuration for licences of this type - see Making a licence type available online on page 143.

Click Save to save your changes.

Note:	Do not deselect the Enabled checkbox once the licence type has been set up. If you do, all configuration will be lost.



#### Recording basic licence type details

To record the basic details for a licence type:

Create the licence type record, or select it in the list to open it. The Main Details section is the first section displayed.



If creating a licence type, in the Code field, type a unique code for the licence type, up to [??] characters.

Record details in the following fields as required:



Note:	Do not select the Allow Multiple Premises option, as this relates to historical functionality.

Select the Enabled checkbox. You need to do this now so you can associate the licence type with one or more application types.

Note:	Do not deselect this checkbox once the licence type has been set up. If you do, all configuration will be lost.

Click Save. If you're creating a licence type, further sections are displayed.

You can now add or amend general configuration details.



#### Recording general licence type configuration details

To record general configuration details for a licence type, with the licence type record open:

Record the following details relating to the renewal of licences of this type:

Note:	The Include Auto Renewal and Create Renewal Application on Renewal options relate to auto renewal functionality which is currently in development.

Specify details relating to online applications on Council Direct in the following fields:

Specify the templates to use in the following fields:

You can now record details of any prerequisites.



#### Adding prerequisites

In the Configuration section, you can record checks that need to take place before licences of this type can be granted. To do this:

Scroll down to the Prerequisites subsection, and add prerequisite records as described in Adding secondary records on page 11.

When recording a prerequisite, record details in the following fields:

After you click Save, the prerequisites are listed against the licence type.





#### Adding standard consultees

## About standard consultees

In the Consultees subsection, you can add default contacts that need to be consulted for different application types. For each consultee, you can specify a target number of days from the consultation date for them to respond by.

## Adding consultees

To add consultees, in the Configuration section:

Scroll down to the Consultees subsection, and add consultee records as described in Adding secondary records on page 11.

When recording a consultee, record details in the following fields:

After you click Save, the consultees are listed against the licence type.



If required, you can now add custom fields to display for licences of this type.



#### Adding custom fields

## About custom fields

If a licence type requires additional fields not provided as standard in Idox Cloud Public Protection, you can add custom fields which will be displayed on the Additional Licence Data tab in the licence record.

## Adding fields

To add custom fields, in the Configuration section:

Scroll down to the Additional Fields subsection, and add custom field records as described in Adding secondary records on page 11.

When adding a custom field, record details in the following fields:

If you selected a Data Type of Drop Down List, add the list items:

In the Add Option field, type the first item as you want it to appear in the list.

Click the plus button . The item is listed and the Add Option field is emptied again.



Repeat steps a and b for each field you want to add.

If completion of the field is mandatory, select Required.

Tip:	Users won't be able to save a licence record until they've recorded details in fields marked as Required.

After you click Save, the fields are listed against the licence type.



You can now define what's copied over to renewals or new licences.



#### Defining the copy options

## About copy options

You can specify which details will be copied across from the original licence record when users create a renewal, or a new licence record based on the original. You can do this for each application type the licence type has been associated with.

## Defining what to copy

To define what to copy, in the Configuration section:

Scroll down to the Copy Options subsection, and add copy option records as described in Adding secondary records on page 11.

When specifying the copy options:

Select the Application Type to set the copy options for.

Select the checkboxes for each area you want to be copied over.

After you click Save, the copy options are listed against the licence type.



You can now define the default action workflows.



#### Adding action workflows

## About action workflows

You can define workflows for actions, which [TBC]. You can then add any action workflows marked for use with Licensing to a licence type.

When a user creates a licence of this type, the workflows you define will be available from the Action Workflow option on the Licence Application menu.

## Adding workflows

To add action workflows, in the Configuration section:

Scroll down to the Default Actions Workflows subsection, and add workflow records as described in Adding secondary records on page 11.

When adding a workflow, record details in the following fields:

After you click Save, the workflows are listed against the licence type.





#### Specifying due date days

## About due date days

Due date day records determine the number of days after an application is received by which a decision date is due [is this right?]. You can specify this for each application type the licence type has been associated with.

## Defining due date days

To define due date days, in the Configuration section:

Scroll down to the Due Date Days subsection, and add due date day records as described in Adding secondary records on page 11.

When recording a due date day record, record details in the following fields:

After you click Save, the due date days are listed against the licence type.





#### Setting up fees

To set up the fees for a licence type, you need to:

Select which fee types are applicable. This determines the subsections displayed in the Fees section on the Licence Type Admin page.

Fixed Fees and Fee Percentages subsections are always displayed. You can also add subsections for:

Time Period Fees: fees which increase based on the time since the licence was applied for.

Licence Band Fees: fees based on the fee band that the licence is associated with.

Licence Capacity Fees: fees based on the capacity the licence covers. This could be the capacity of a venue, or the number of vehicles covered by the licence, for example.

For details, see Specifying the fee types to display on page 138.

Set the fees for each fee type, for all applicable application types.

Note:	If the licence type is associated with more than one application type, you will need to set up fees for each of these separately.

For details, see:

Setting up licence capacity fees on page 139.

Setting up licence band fees on page 140.

Setting up licence time period fees on page 140.

Setting up fixed fees on page 142.

Setting up fee percentages on page 143.



##### Specifying the fee types to display

To specify the fee types to display, with the licence type record open:

Scroll down to the three Show Licence... sections.



To display Licence Time Period fees:

Select the Show Licence Time Period checkbox. Further fields are displayed:



In the Label field, type the label to display against the field from which users can select fees of this type in Council Direct.

In the Help Text field, type the text to display about the fee underneath the field in Council Direct.

Repeat step 2 for the Show Licence Band and Show Licence Capacity sections as required.

You can now specify the fees for each fee type.



##### Setting up licence capacity fees

To set up the licence capacity fees for a licence type, having selected the Show Licence Capacity checkbox, in the Fees section:

Scroll down to the Licence Capacity Fees subsection, and add fee records as described in Adding secondary records on page 11.

When recording a fee, record details in the following fields:

After you click Save, the fee details are listed against the licence type.



##### Setting up licence band fees

To set up the licence band fees for a licence type, having selected the Show Licence Band checkbox, in the Fees section:

Scroll down to the Licence Band Fees subsection, and add fee records as described in Adding secondary records on page 11.

When recording a fee, record details in the following fields:

After you click Save, the fee details are listed against the licence type.



##### Setting up licence time period fees

To set up the licence time period fees for a licence type, having selected the Show Licence Time Period checkbox, in the Fees section:

Scroll down to the Time Period Fees subsection, and add fee records as described in Adding secondary records on page 11.

When recording a fee, record details in the following fields:

After you click Save, the fee details are listed against the licence type.



##### Adding initial online licence menu details

To add the initial details for an online licence menu, with the menu record open:

Record details in the following fields:

Select the Enabled checkbox.

Tip:	The menu record will need to be enabled before you can add questions to it.

Click Save. You're returned to the Online Licence Menu page.

You can now configure the questions for the menu.



##### Setting up fixed fees

To set up the fixed fees for a licence type, in the Fees section:

Scroll down to the Licence Fixed Fees subsection, and add fee records as described in Adding secondary records on page 11.

When recording a fee, record details in the following fields:

After you click Save, the fee details are listed against the licence type.



##### Setting up fee percentages

## About fee percentages

Once all other fees have been set up, you can define fee percentages. This will take a percentage of all the other fees and apply this as the initial amount to be invoiced.

Notes:	This will be reflected both in Idox Cloud Public Protection and on Council Direct.

Only this defined amount will be required as payment initially for online applications.

## Setting up the fees

To set up fee percentages for a licence type, in the Fees section:

Scroll down to the Fee Percentages subsection, and add fee records as described in Adding secondary records on page 11.

When recording a fee, record details in the following fields:

After you click Save, the fee details are listed against the licence type.



#### Making a licence type available online

To make a licence type available to users of Council Direct, you need to configure details in the Available Online section on the Licence Type Admin page.

Select the checkbox in the Available Online section heading to display further fields.



If you want users to be able to request an extension of licences of this type using Council Direct, for example for skip licences, select Can be extended.

Tip:	If you select this option, you'll also need to select the Online Start/Expiry Date option in the online application type configuration.

Configure an online application type for each type of application you want to be available on Council Direct - see Recording general online application type configuration details on page 144.

Configure the steps displayed to users on Council Direct. In each step, you include one or more questions - these each relate to separate fields in the Licensing module.

## About steps and questions

Council Direct displays questions relating to the application in steps. Each step is displayed on a different page. When configuring the online application type, you can either choose to use:

The standard configuration for these steps. This is a quick way to use standard details in the online form.

The step builder to define them yourself. This provides you with flexibility to get the online form exactly the way you want it.

## About the step builder

Using the step builder, you can create your own steps, with any number of sections in. You can then add questions to these sections, based on the details from licence-specific tabs. You can also customise these questions for display online.

For full details, see Configuring questions using the step builder on page 148.

## About the standard configuration

The standard configuration provides standard steps. You can customise the questions to display in these steps.

Step 1 contains:

All of the fields configured in the main part of the Licence Type Online Detail page - for details, see Recording general online application type configuration details on page 144.

Any "additional" custom fields defined against the licence type - see Adding custom fields on page 135.

Any "single answer" fields on the licence-specific tab(s) displayed after saving the configuration. This excludes fields where subsequent information needs to be provided by adding details in multiple rows.

The online form will then have subsequent steps for each field on the licence-specific tab(s) which requires more than a single answer.

For full details, see Configuring questions using the standard configuration on page 153.



##### Recording general online application type configuration details

To configure an online application type, in the Available Online section:

Scroll down to the Online Application Types subsection, and add an online application type record as described in Adding secondary records on page 11.

The Licence Type Online Detail Add page opens on a new tab in your browser.



From the Licence Application Type list, select the application type you want to configure.

From the Configuration Type list, select Step Builder or Standard depending on whether you want to configure the questions using the step builder.

Note:	You cannot change this value once you've saved the configuration details.

Record the following details in the Online Application Type Configuration section:

Note:	For authorities in Wales, a second version of this field is displayed, in which you can record the text to display in Welsh.

In the Contact Sensitive Data area:

Click Include next to each item you want to be included on the online form.

Click Required if the item is a mandatory field.



If you selected to include Conviction details, a Conviction Configuration section is displayed.



Add the following details in this section:

In the Disclaimer field, type the disclaimer text to display at the end of the online form.

Note:	For authorities in Wales, a second version of this field is displayed, in which you can record the text to display in Welsh.

If you want users to be able to upload files to submit with the application:

Select the Uploads Enabled section. A new Online Upload Details section is displayed.



Add the following details:

Click Save. You're returned to the licence type record.

You now need to configure the questions to display on the form:

If you selected a Configuration Type of Step Builder, see Configuring questions using the step builder on page 148.

If you selected a Configuration Type of Standard, see Configuring questions using the standard configuration on page 153.



##### Configuring questions using the step builder

## About the step builder

The step builder enables you to control the questions which will be displayed to users on Council Direct for each application type associated with a licence type.

Using the step builder, you:

Create a step.

Add one or more sections to the step.

Add fields to include as questions to the step, by dragging and dropping fields from the licence-specific tabs displayed, and then customising the information to display.

Each step is displayed as a separate page in Council Direct.

## Copying configuration from a previous online application type

Once an online application type record has been saved, you can't change the Configuration Type. So you can't change a "standard configuration" record to a "step builder" record.

However, when you create a new record, if there's an existing "standard configuration" record for the application type, a Copy Previous button is displayed, giving you the option to copy this over:



Note:	This will only be displayed if there's a standard configuration set up for the same online application type.

You can then amend the configuration as required, using the steps below as a guide.

## Using the step builder

To configure an online application type using the step builder, in the Available Online section on the Licence Type Admin page:

In the Online Application Types subsection, click the Edit button next to the online application type record you want to edit.

The Licence Type Online Detail Edit page opens on a new tab in your browser.

Scroll down the page until a section is displayed with:

Add Step and Add Section buttons in the left panel.

A series of tabs and fields in the right panel. This includes the Additional Details tab, and the tab specific to the licence type (if one has been specified).

The fields form the basis of the questions you can add to the online form. [what determines what other tabs are displayed here? For "premises" licence types, why are the other two tabs in this example displayed?]



Click Add Step to add a new step. Options are displayed to hide or remove it.

Hover over the Add Section button and select Add to Step 1 from the menu displayed to add a new section.



Record the following details for the section:

Note:	For authorities in Wales, a second version of each of these fields is displayed, in which you can record the text to display in Welsh.

Add further steps and sections as required.

To add a question to a section:

Select the tab containing the question in the right panel, and then drag and drop the question to the relevant section in the left panel.



Tip:	If you moved a question over by mistake, you can simply drag and drop it back over to the right to remove it.

Click the plus button + to expand the question details.

For single answer questions, the question details are displayed.



For multiple answer questions, each answer is displayed. Click the plus button + to expand an answer.



Record the following as required:

Add further questions as necessary.

Tip:	If you need to change the order of the questions, you can drag and drop them within the Questions area in the section to reorder them.



Once the online application type is ready for use on Council Direct, in the Online Application Type Configuration section, select the Published checkbox.

Click the Save button at the bottom of the page. You're returned to the Licence Type Admin Edit page.

## Showing or hiding fields after selection of a checkbox

If a section includes a question with a field type of "checkbox", you can specify whether other fields are either hidden or shown when this checkbox is selected. You do this after saving and closing the online application type record as above.

To specify fields to show or hide when a checkbox is selected, on the Licence Type Admin Edit page:

In the Online Application Types subsection, click the Edit button next to the online application type record you want to edit.

Display the step and section containing the question you want to show or hide, using the plus buttons + to expand the relevant details.

Do one of the following:

To hide the question when a checkbox field is selected, select the checkbox field from the Hide When Checked list.

To show the question when a checkbox field is selected, select the checkbox field from the Show When Checked list.



Repeat as necessary for any other questions, and then click Save.



##### Configuring questions using the standard configuration

## About the standard configuration

For online application types using the standard configuration, licence-specific tabs are displayed at the bottom of the Licence Type Online Detail Edit page. Each of these contains the fields available on the tab. The fields form the basis of the questions you can add to the online form.

## Using the standard configuration

To configure an online application type using the standard configuration, in the Available Online section on the Licence Type Admin page:

In the Online Application Types subsection, click the Edit button next to the online application type record you want to edit.

The Licence Type Online Detail Edit page opens on a new tab in your browser.

Scroll down the page until a section is displayed with tabs specific to the type of licence.



Record the following details for the first tab:

To configure the questions to include in the section, record the following for each required field:

Repeat steps 3 and 4 for each tab.

Once the online application type is ready for use on Council Direct, in the Online Application Type Configuration section, select the Published checkbox.

Click the Save button at the bottom of the page. You're returned to the Licence Type Admin Edit page.

## Showing or hiding fields after selection of a checkbox

If a section includes a question with a field type of "checkbox", you can specify whether other fields are either hidden or shown when this checkbox is selected. You do this after saving and closing the online application type record as above.

To specify fields to show or hide when a checkbox is selected, on the Licence Type Admin Edit page:

In the Online Application Types subsection, click the Edit button next to the online application type record you want to edit.

Display the tab containing the question you want to show or hide.

Do one of the following:

To hide the question when a checkbox field is selected, select the checkbox field from the Hide When Checked list.

To show the question when a checkbox field is selected, select the checkbox field from the Show When Checked list.



Repeat as necessary for any other questions, and then click Save.



### Configuring licence-specific tabs

## About licence-specific tabs

For each licence type, you can define which tab will be displayed which contains information relevant to that type of licence. For example, for premises licences, you can display a tab containing fields relating to the premises.

Which the tabs available are hard-coded and you can't create new ones, you can configure the details for each tab.

In the top half of the page, you can define the general details for the tab, for example the tab name to display to users.

The bottom half of the page lists the fields available for display on the tab. You can specify:

Which fields will be displayed, and the field labels used for them, both for online applications and in the system.

Other configuration for each field, such as whether it'll be included in the Licence Register.

## Shared service configuration

If your authority is using Idox Cloud Public Protection as a shared service, tabs are displayed for each authority. This enables you to configure the fields displayed for your authority only. You can:

From the Copy Existing Configuration list, select the tab containing the existing configuration to copy across. You can then amend these details as required.

Select Create New Configuration, to set the details up from scratch as detailed in this section.

Tip:	The details specified in the top half of the page will be applicable for all authorities.

## Configuring a tab

To configure a licence-specific tab:

In the Admin Areas left menu, from the Licensing option, select Licence Specific Tabs. The available tabs are listed.

Select the tab record to open it.



Specify the general configuration for the tab in the top part of the page:

Note:	The Licence Specific Object Class Name, Licence Specific Tab Template Path, Licence Specific Tab Number, and Licence Specific Tab Input Name Syntax fields are read-only

To save the general configuration details, click Save.

Specify the details for each field to display as follows:

Tip:	To revert any changes to the defined standard, click the Restore to Default button.

To save your changes, click the Save Field Configuration button.



### Configuring application types

## About application types

Each licence type must have one or more application types associated with it - for example, to cover applications for new licences, and applications for renewals.

When you set up an application type, you specify which licence types it will be available for. You can also specify whether applications of this type will be included in the Home Office Return.

Note:	Before changing or disabling any existing application types, check whether it's being used in the online application configuration for a licence type - see Recording general online application type configuration details on page 144.

## Setting up an application type

To create or amend an application type:

In the Admin Areas left menu, from the Licensing option, select Application Types. The existing application types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If creating a new application type, type a unique Code for the application type, up to [??] characters.

Record details in the following fields as appropriate:

If you want the application type to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Configuring licence statuses

## About licence statuses

To progress a licence application, users will need to update the status. You can create the statuses they select, and the impact the status change will have on the application. Changing the status may:

Display other fields, such as the issue date, expiry date, and so on.

Prevent some details from being updated, for example the decision.

Flag the application as going to committee, or requiring further action.

## Setting up a licence status

To create or amend a licence status:

In the Admin Areas left menu, from the Licensing option, select Licence Statuses. The existing statuses are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new status, type a unique Code and a Name describing the status. The name will be displayed in case details.

Record details in the following fields as appropriate: [I'll finish populating this table after I've processed an application with these statuses]

If you want the status to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Mapping cost codes for Licensing

## About cost code mappings

Each financial transaction related to Licensing in Idox Cloud Public Protection must have a fund code and a cost code.

To ensure payments get directed to the appropriate place in your finance system, for each combination of licence type and application type, you need to map each relevant cost code and fund code.

For information about setting up cost and fund codes, see Maintaining cost codes and fund codes on page 24.

## Mapping a cost code and fund code

To map a cost code and fund code to a combination of licence type and application type:

In the Admin Areas left menu, from the Licensing option, select Cost Code Map. The existing codes are listed.

Check through these to determine whether a cost code and fund code is already mapped to the combination of licence type and application type you want to configure.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Record details in the following fields as appropriate:

If you want the mapping to apply straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining invoice types

## About invoice types

When creating an invoice in a licence or licence application record, users select the Licence Invoice Type. When configuring these invoice types, you can indicate that the invoice type relates to:

An initial invoice. An invoice of this type will be automatically generated when an application is first created.

A remaining invoice. Where the licence type includes a fee percentage, an invoice of this type will be generated in addition to the initial invoice. This will contain the remaining fee after the percentage has been paid.

## Creating or amending an invoice type

To create or amend an invoice type:

In the Admin Areas left menu, from the Licensing option, select Invoice Types. The existing invoice types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new invoice type, type a unique Code for the invoice type.

Record details in the following fields:

If you want the invoice type to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining licence references

## About licence references

Unless the licence type is set up to hide it, a Licence Reference field is displayed in application and licence records. This is used to contain the reference number for the licence itself, rather than the licence record. For example, this could be the plate number for a taxi licence, or a badge number for a taxi driver licence.

The number is generated automatically when... [is this right? At what point is it generated? It seems to be generated at point of submission for online submissions, but not sure about other applications].

You can define the reference for each licence type. In the reference record, you specify the text to precede a sequential number which will be generated automatically [I'm guessing].

## Creating or amending a licence reference

Note:	Before creating a reference record, make sure you check whether there's one already for the licence type. There should only ever be one reference record enabled for a licence type.

To create or amend a licence reference:

In the Admin Areas left menu, from the Licensing option, select Licence References. The existing reference types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Record details in the following fields:



Note:	The Next Licence Number value will increment automatically as references are generated.

If you want the reference to be used straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining licence bands

## About rateable licence bands

Some licence fees are based on bands, for example late night levy fees. When you configure a licence type, you can specify the band for each fee available, and users can also select the band when manually adding fee invoices to an application.

For each band, you can specify whether the fee should be included in the Home Office Return. [need to see this for more info about where and how]

## Creating or amending a licence band

To create or amend a licence band:

In the Admin Areas left menu, from the Licensing option, select Licence Bands. The existing reference types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new licence band, type a unique Code for the band.

In the Description field, type a description for the band, as it'll be displayed in the system.

If fees of this type should be included in the Home Office Return, select Home Office Return.

If you want the band to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Configuring licence conditions

## About licence conditions

Users can add conditions to applications and licence records on the Conditions tab. Each condition is contained in a standard paragraph, and is associated with a paragraph code. When they select a paragraph code, the conditions associated with the paragraph code are then made available for selection.

## Configuring conditions

To configure licence conditions, you:

Set up the list of standard phrase classification codes. To do this:

In the Admin Areas menu, select Licensing, then Classification Codes.

Configuring the "simple" list of codes. For information about maintaining simple lists, see Setting up lists on page 12.

Set up the standard phrase paragraph codes. To do this:

In the Admin Areas menu, select Licensing, then Paragraph Codes.

Configure the codes, as described from step 2 onwards in Maintaining standard phrase paragraph codes on page 59

Set up the licence conditions. To do this:

In the Admin Areas menu, select Licensing, then Conditions.

Configure the standard phrases containing the conditions, as described from step 2 onwards in Maintaining standard phrases on page 60.



### Maintaining vehicle models

## About vehicle models

Using the Vehicle Models option, you can maintain the list of vehicle models available for selection [is this actually used in the system? The Vehicle Details licence-specific tab only has a text field for recording the vehicle model, not a code field. It's the same on Council Direct].

## Creating or amending a vehicle model

To create or amend a vehicle model:

In the Admin Areas left menu, from the Licensing option, select Vehicle Models. The existing models are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Record the following details:

If you want the vehicle model to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining premises types

## About premises types

When recording a premises licence application, users can select the type of use that the premises are open for, when they're open 24 hours a day.

When setting up the premises types, you can specify whether licences of this premises type should be included in the Home Office Return. You can also specify the premises type group [that the licence will come under in the return?].

## Creating or amending a premises type

To create or amend a premises type:

In the Admin Areas left menu, from the Licensing option, select Premise Types. The existing premises types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new premises type, type a unique Code for the premises type.

Record details in the following fields:

If you want the premises type to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Maintaining recorded change types

## About recorded change types

When users save a change to an application, they're prompted to provided details of the change, along with a recorded change type. The recorded changes are then logged so that the case contains audit trail of all changes made.

When setting up the change types that users can select, you can specify:

Which change type will be selected by default.

Which change type will be used automatically when files are uploaded to the case. [this was my best guess for the Use for File Upload option, but isn't how it's working. Any ideas what it's for?]

## Creating or amending a recorded change type

To create or amend a recorded change type:

In the Admin Areas left menu, from the Licensing option, select Recorded Change Types. The existing change types are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new change type, type a unique Code for the change type.

In the Description field, type a description of the change type as it'll be displayed in the system.

If you want the change type to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save. You're returned to the list of change types.

To specify that the change type should be used when files are uploaded to the case, select Use for File Upload.

To make it the change type which will be selected by default, in the Is Default row, click the Select button.



### Maintaining online submission statuses

## About online submission statuses

When reviewing submissions received from Council Direct, users can change the Online Application Status as appropriate. This will then update the status in Council Direct.

When setting up the statuses, you can specify which relate to the submission being accepted or declined.

When a user selects an "accepted" status, on saving their changes, an application record is created for the submission, and it's removed from the "New Applications" Online Submission list.

When a user selects a "declined" status, on saving their changes, the submission is removed from the New Applications list, but an application record is not created.

## Creating or amending a status

To create or amend an online submission status:

In the Admin Areas left menu, from the Licensing option, select Online Submission Status. The existing statuses are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a status, type a unique Name for the status, as it'll be displayed in the system and on Council Direct.

If the status will be used to mark online submissions as either accepted or declined, select the Submission Accepted or Submission Declined checkbox as appropriate.

If you want the change type to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save. You're returned to the list of change types.



### Configuring an online licence menu

## About online licence menus

By default, when a user wants to create an online submission in Council Direct, they need to know what licence type and application type they need to apply for. To make this easier for them, you can create an online licence menu.

An online licence menu acts as a wizard to guide users through a series of questions to work out which licence and application type they need. For an example of how this would work in Council Direct, see Example online licence menu on page 169.

Each online licence menu can link to the licence types under one Licence Description only.

## Building up questions and answers

When configuring an online menu, you:

Set up a question underneath a Licence Description. Then set up several answers to the question as options for the user to select.

For each answer, you can add further questions with answers as required. This creates "branches" in the tree view of questions and options. The end of each branch leads to a decision as to what licence application is required.

Tip:	If you need to edit a question, answer or decision at a later date, you just need to click on it in the tree view to open the edit window.

This image shows an example of the configuration. This example has an initial question with answers of "Premises" and "Personal". A further question will be displayed if the user selects "Premises" as the first answer.



## Configuring a menu

To configure an online licence menu:

In the Admin Areas left menu, from the Licensing option, select Online Licence Menu. The existing menus are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Add the initial details - see Adding initial online licence menu details on page 141.

Add a question - see Adding a question to an online licence menu on page 171.

Add options for the question - see Adding an answer option to an online licence menu question on page 172.

Repeat steps 4 and 5 to create as appropriate.

Add a decision at the end of each "branch" of the tree view - see Adding a decision at the end of a question branch on page 173.

Click Save.

The menu will be available on Council Direct from the Live From Date you specified.



#### Example online licence menu

The following provides a simple example of how an online licence menu would guide the user through the required steps to find out the right licence application. You can configure the menu to be as complex as required.

## Step one: apply for licence

First, the user selects the Apply For A Licence option from the left menu in Council Direct.



## Step two: Select the general licence description required

Next, they select the licence description for the type of licence their application relates to.



## Step three: answer any questions relevant to the application

This displays a question with two or more options. They select the option relevant to their application.



If subsequent questions have been set up under the answer they select, then they repeat this step with those questions.

## Step four: arrive at suggested application/licence type

After the final answer, an explanation of the licence and application they require is displayed.



## Step five: apply for licence

They can then click on the link to fill in the application form as normal. Or they can click Go Back to go back a step, or Start over to restart the process.



#### Adding initial online licence menu details

To add the initial details for an online licence menu, with the menu record open:

Record details in the following fields:

Select the Enabled checkbox.

Tip:	The menu record will need to be enabled before you can add questions to it.

Click Save. You're returned to the Online Licence Menu page.

You can now configure the questions for the menu.



#### Adding a question to an online licence menu

To add a question to an online licence menu, from the Online Licence Menu page:

Click on the online licence menu record to open it.

An (Add question) box is displayed at the bottom of the Online Licence Menu Edit page.



Click (Add question). The Add Question window opens.



In the Description field, type the question as it'll appear to users.

In the Additional Help Text field, type extra text to help clarify the question. This will be displayed below the Description.

Click Save. The window is closed, and your question is added to the Online Licence Menu Edit page. An (Add option) box is displayed below the question.



You can now add the possible answers to the question.



#### Adding an answer option to an online licence menu question

To add an answer to a question set up in an online licence menu, with the online licence menu record open:

Under the question you want to provide an answer for, click (Add option). The Add Option window opens.



In the Description field, type the option answer as it'll appear to users.

In the Additional Help Text field, type extra text to help clarify the answer. This will be displayed when a user hovers over the toggle image next to the answer:



Click Save. The window is closed, and your answer is added to the Online Licence Menu Edit page. A further question box and a decision box are displayed below the answer.



You can now:

Add another question that users will need to answer having selected this answer.

Add a "decision" stating the licence application type which is required.



#### Adding a decision at the end of a question branch

To add a decision at the end of the "branch" of questions, with the online licence menu record open:

Under the relevant answer, click the (Add decision) box. The Add Decision window opens.



Record the following details for the decision:

Click Save. The decision is displayed underneath the answer.



If you added the decision by mistake, after saving the menu record, you can click the X at the end of the row to remove it.



### Configuring committee agenda templates

## About committee agenda templates

By setting up a committee agenda template, you can specify which details will be displayed under each licence application included in a committee meeting. You do this by setting up the template in the internal editor, adding regular content and "smarty" codes to include case details.

Tip:	It's recommended that only users with HTML knowledge set up templates in the internal editor.

While you can set up several templates, only the one selected as the default will be used by the system. This means you can set up a new template first and then make it the default one when it's ready to be used.

Note:	As an alternative, you can create an external Word document and make this available to users on a network. They can then add this to committee meeting records using the Upload Agenda button on the Agenda tab.

## Configuring a template

To configure a committee agenda template:

In the Admin Areas left menu, from the Licensing option, select Licence Committee Agenda Templates. The existing templates are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



Add and format regular content, using the tips for guidance outlined in Internal editor tips on page 49.

Add smarty codes to include case information - see Using smarty codes to output case details on page 50.

Once you're happy with the template, select the Enabled checkbox to make it available on the system.

Click Save below the template.

## Setting a template as the one to be used

To set a template as the one that will be used by the system:

In the Admin Areas left menu, from the Licensing option, select Licence Committee Agenda Templates. The existing templates are listed.



Next to the template you want to be used, click the Select button.

Text is displayed next to the template stating "Selected". The previously-selected template now has the Select button displayed.



### Maintaining committee meeting outcomes

## About committee meeting outcomes

Once a committee meeting has been held, a user will need to select an outcome against each licence application.

When setting up an outcomes, you can specify whether selection of the outcome will create an action record, and if so, the action code to use.

## Setting up an outcome

To create or edit an outcome:

In the Admin Areas left menu, from the Licensing option, select Licence Committee Outcome Types. The existing outcomes are listed.

Either create a new record, or edit an existing one, as described in Working with administration records on page 9. This will display either the Add page or the Edit page.



If you're creating a new outcome, type a unique Code for the outcome.

In the Description field, type a description for the outcome, as it'll be displayed in the system.

If selecting the outcome will cause an action record to be created:

Select the Create Action checkbox.

From the Core Function list, select the core function the action you want to select comes under.

From the Action Code list, select the type of action that will be created.

If you want the outcome to be available for use on the system straight away, select the Enabled checkbox.

Otherwise, you can open the record and enable it another time - see Working with administration records on page 9.

Click Save.



### Configuring the online licence register

Note:	The live Licence Register functionality is turned off by default. After you've added and checked the configuration as described in this section, please contact Idox Service Desk to request that the functionality is enabled.

## About the online licence register

The online licence register contains three sections:

Applications for Consultation, listing the applications for which the public consultation period is open.

Licence Register, listing the current licences.

Expired Licences: listing licences for which the expiry date has passed.

## What you can configure

When configuring the online register:

Globally, you can specify the generic fields to include in the search functionality. You can specify the fields either for all sections, or the three register sections separately. Or you can specify that the search won't be displayed for some sections.

For more details, see Specifying the global search fields for the register on page 178.

You can set up different details for each licence-specific tab. And you can optionally set up different details for each licence type using the licence-specific tab.

You can specify:

The fields to display details for in each of the three register sections.

Any licence-specific fields to display in the search area once the user has selected an appropriate licence type.

Whether to prevent these records being displayed in an area of the register.

For more details, see Specifying the licence-specific fields for the register on page 180.

## Viewing the licence register configuration

To view the current configuration for the licence register, in the Admin Areas left menu, from the Licensing option, select Licence Register Config. Configuration details are listed for the search functionality, and for each licence-specific tab.





#### Specifying the global search fields for the register

## About the search fields

By default, if you don't specify which fields to display, the Licence Register search area will display as in this image:



If you then create a configuration record for the search, only the fields you select will be displayed.

When setting up a configuration record for the search, you can either specify the fields to display for all of the register sections, or for each of the three register sections individually. You can also specify that the search will not be available for an area of the register - instead, all records will always be listed.

## Specifying the fields to display

To specify the fields to display in the search area for all licence types:

In the Admin Areas left menu, from the Licensing option, select Licence Register Config.

Do one of the following:

Click on a configuration record to open it for editing.

Create a new configuration record, by clicking the Add button in the Licence Search section at the top of the page.

This will display either the Add page or the Edit page.



Select the Licence Search checkbox. The lower part of the page reduces so only the Licence Search Fields section is displayed.



If you want to specify the search fields separately for each register section, select the Search Per Section checkbox. Search Fields sections are displayed for each register section.



To prevent the search functionality from being displayed for a register section, select the Disable Licence Register, Disable Applications For Consultation, or Disable Expired Licences checkbox as appropriate.

If you selected Search Per Section, click the Add button in the Search Field section you want to add a field to.

Tip:	If you didn't select this option, a blank field is already displayed.

To add a field to the search, in the relevant section:

Select the field to display from the Field list, then click away from the field. The Online Label field is displayed and populating with the default value.

If necessary, in the Online Label field, amend the label that will be displayed next to the field on Council Direct.

To add further fields to the section, click the Add button and repeat step 6. The fields are listed in the order you added them.



To change the order of the fields, click the up  or down  arrow button next to the field you want to move.

Once you're happy with the configuration of the search fields, select the Enabled checkboxes.

Click Save. You're returned to the Licence Register Config page.

To use this configuration record as the current one for Council Direct, select the Active checkbox. This checkbox is automatically deselected for the previously-active record.



#### Specifying the licence-specific fields for the register

## About fields for licences using licence-specific tabs

As well as the global search fields, you can configure the display of fields for licences which use a particular licence-specific tab. You can either do this for all licence types using the tab, or for an individual licence type.

When creating a licence-specific configuration record, you can:

Specify the fields to display for each of the register sections. These can be the generic licence fields, and fields from the licence-specific tab.

Note:	This may be overwritten by some of the settings for the licence type - see Recording general licence type configuration details on page 131.

Specify the licence-specific fields to display in the search, in addition to the generic fields defined when Specifying the global search fields for the register on page 178.

Alternatively, you can hide licences and/or applications from a section of the register.

## Specifying the fields to display

To specify the fields to display for licence-specific licences or licence types:

In the Admin Areas left menu, from the Licensing option, select Licence Register Config.

Scroll down to the section for the licence-specific area you want to configure.

Do one of the following:

Click on a configuration record to open it for editing.

Create a new configuration record, by clicking the Add button in the section.

This will display either the Add page or the Edit page. The Licence Specific Tab will be prepopulated.



Tip:	You can change the Licence Specific tab if you clicked Add in the wrong section.

To define the fields for a specific licence type:

Select the Licence Type Specific checkbox.

Select the licence type from the Licence Type field displayed.

To prevent these licences from displaying in a register section, select the Disable Licence Register, Disable Applications For Consultation, or Disable Expired Licences checkbox as appropriate.

Scroll down to the section you want to specify the fields for:

To add fields to display, in the relevant section:

Click the Add button.

Select the field to display from the Field list, then click away from the field. The Online Label field is displayed and populating with the default value.

If necessary, in the Online Label field, amend the label that will be displayed next to the field on Council Direct.

Repeat these steps to add further fields.

The fields are listed in the order you added them.



To change the order of the fields, click the up  or down  arrow button next to the field you want to move.

Once you're happy with the configuration of the fields, select the Enabled checkboxes.

Click Save. You're returned to the Licence Register Config page.

To use this configuration record as the current one for Council Direct, select the Active checkbox.

Note:	There must only be one active configuration record for the licence type (if defined) or licence specific tab (if licence types aren't defined). Deselect the Active checkbox against the previously-active configuration record if one exists.



