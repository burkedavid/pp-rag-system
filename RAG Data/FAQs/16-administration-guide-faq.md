# Administration Guide - Frequently Asked Questions

## Getting Started with Administration

### How do I access the administration areas in Idox Cloud Public Protection?

Click the "Admin" item in the top menu. This displays the Admin Areas menu down the left side of the page, which contains headings for each administration area. Click the "+" button next to a heading to expand the menu for that area.

### What happens when I'm working in an admin area?

When working in an admin area (like Users Admin), a context-sensitive Admin menu appears on the left side of the page. This gives you options to create and view records, and is displayed above the general Admin Areas menu. The menu provides options to perform tasks relevant to that specific area.

## Working with Administration Records

### How do I create a new administration record?

Select the "Create..." option from the context-sensitive Admin menu to create a record. Complete all required fields in the creation form, then save the record to make it available in the system.

### How do I view existing administration records?

To display a list of available records, select the "List..." option from the Admin menu in any administrative area. You can then review the displayed records in table format.

### How do I edit an existing administration record?

To open and edit a record, first display the list of records using "List..." from the Admin menu, then click on the specific record in the list to open it for editing.

### Should I delete records I no longer need?

No, you should disable records rather than delete them when they're no longer required. This ensures that while users can no longer select the record for current cases, it will still be related to historical records.

### How do I enable or disable administration records?

To enable or disable records:
1. From the context-sensitive Admin menu, select "List..." to view the records
2. To show disabled records, either select "Show Disabled" from the Admin menu, or select/deselect the "Show Disabled" option above the list
3. Select or deselect the "Enabled" checkbox next to the listed records as required

### Can I change the order that items appear in lists?

Yes, for some record types you can specify the order in which records will be displayed. On the summary page for the record type, use the up and down arrows at the end of each row to change the position. The Load Order field updates automatically. Click "Save" to confirm the new order.

## Secondary Records

### What are secondary records in administration?

Secondary records are additional configuration items attached to primary administrative records. For example, in Licence Type Admin, you can add secondary records defining default consultees, prerequisites, and other related information.

### How do I add secondary records to an administration record?

To add secondary records:
1. Click the down arrow in the relevant subsection to display more details
2. Click the "Edit" button to open the Edit window
3. Click "Add" - a blank row is added
4. Record details in the fields provided
5. To add more secondary records, repeat steps 3 and 4
6. Click "Save" - the secondary records are then listed against the administration record

## Setting Up Lists

### What types of lists are available in the Admin area?

There are two types of lists:
- **Simple lists**: These contain values that users can select, and selecting a value doesn't impact any other part of the system
- **Activating lists**: When users select a value from these lists, it impacts something else in the system (like displaying more fields or progressing a case to the next stage)

### Can I set default values for lists?

Yes, sometimes you can set a list value as the default which will be selected if users don't physically select anything else.

### How do I create or edit a list value?

To create or edit a value for a list:
1. In the Admin Areas menu, select the "List..." item for the relevant area
2. The context-sensitive menu is displayed with existing values
3. For a new value: select "Create..." from the context-sensitive menu on the left
4. For editing: click on an existing value in the list
5. For new list values, type a unique code in the "Code" field to represent the list value
6. In the "Description" field, type a description as it'll appear in the list
7. For activating list values, specify additional details as required
8. If you want the list value available for selection immediately, select the "Enabled" checkbox
9. Click "Save"

### How do I specify the default value for a list?

If a list page contains an "Is Default" column, you can specify the default value:
1. On the list page, select "System" from the top menu, then the relevant option
2. In the "Is Default" column, click the "Select" button on the value you want to be the default
3. Text stating "Selected" is displayed for that value

## Managing Fee Types

### What are fee types used for?

Fee types are used in several modules in Idox Cloud Public Protection to define how fees are calculated for cases. In the fee type record, you define how the fee will be calculated by setting up fee conditions.

### How do fee conditions work?

For each fee condition, you can:
- Specify whether it relates to a flat fee or a charge per unit
- If charging per unit, add factors such as an initial fee and maximum fee amount
- Add a "range" of numbers of units that the fee condition will apply for (for example, more than two units but fewer than ten)

### How do I set up a new fee type?

To set up a fee type:
1. In the Admin Areas left menu, select the option for the relevant module (like "Inspection")
2. Under this menu option, select "Fee Types" (or "Fee/Fine Types" in the Dog module)
3. Either create a new record or edit an existing one
4. If creating new, type a unique "Code" and "Description" as they'll be displayed in the system
5. To create a fee condition, click the "Add" button - a blank row is added
6. Record details in the Fee/Rate section
7. For flat fees: select the "Flat Fee" checkbox and record the required details
8. For non-flat fees: record the appropriate details for unit-based charging
9. To specify the range of unit numbers this condition applies to, complete the relevant fields
10. If fees should be rounded for part units, select from the "Round Remainder Units" list whether to round up, down, or to nearest unit
11. If there's a maximum fee ceiling, select the "Maximum Fee Ceiling" checkbox
12. To add more fee conditions, repeat steps 5-11
13. If you want the fee type available immediately, select the "Enabled" checkbox in the Details section
14. Click "Save"

## General System Administration

### What functionality is available under General administration?

The General option in the left hand Admin Areas menu provides various system-wide administration options that affect the running of the system. This covers functionality under both the General and Users options in the Admin Areas menu.

### How do I maintain activity codes?

Activity codes can be maintained through the General administration options. This allows you to define and manage the various activity types used throughout the system.

## User Administration Questions

### How do I manage user accounts in the system?

User account management is available through the Users option in the Admin Areas menu. This allows you to create, modify, and manage user access and permissions throughout the system.

### What should I know about user permissions?

The system is designed to give authorities flexibility when deciding which types of users can access which areas. For example, if you're set up as an officer, you might not have access to certain functionality, or as a manager, you may not have permissions to create location records. However, this can be configured differently for each authority.

## Tips and Best Practices

### What should I remember when working with administration records?

- Always disable records rather than deleting them when they're no longer needed
- Use the context-sensitive Admin menus for efficient navigation
- Take advantage of the "Show Disabled" option to view historical records when needed
- Set up default values for lists where appropriate to improve user efficiency
- Test fee calculations with sample scenarios before implementing new fee types

### Where can I find more information about general system functionality?

For information about general common functionality in Idox Cloud Public Protection, refer to the other Idox Cloud Public Protection User Guides available in your system documentation.

### Are there any fields or sections marked as "To Be Confirmed"?

Some sections in the administration guide may contain notes like "[TBC whether this is just for map layers]" indicating that certain functionality details are still being confirmed or may be specific to certain modules. Check with your system administrator for the most current information about these features.