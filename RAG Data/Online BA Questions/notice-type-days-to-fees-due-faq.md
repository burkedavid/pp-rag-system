# Notice Type Days to Fees Due - Frequently Asked Questions

## What does the 'Days to Fees due' mean in admin > notice type?

**Based on analysis of the Idox Public Protection System source code, the 'Days to Fees due' field in Notice Type administration determines how many days after a notice is served before the fee payment becomes due. This field is used to automatically calculate payment due dates for notices that require fees.**

### What the Source Code Analysis Revealed

**Days to Fee Due Field Definition**
The system includes this field as part of Notice Type configuration:
- **Field Type** - Number field storing days value
- **Purpose** - Sets the payment period for notices of this type
- **Usage** - Combined with notice served date to calculate payment due date

**Automatic Payment Due Date Calculation**
The system automatically calculates payment due dates by adding the specified number of days to the notice served date to determine when payment becomes due.

### How Days to Fees Due Works

**Payment Timeline Calculation**
When a notice is issued that requires a fee:
- **Served Date** - The date the notice is officially served
- **Days to Fee Due** - The number of days specified in the notice type configuration
- **Payment Due Date** - Automatically calculated by adding the days to the served date
- **System Update** - The payment due date is stored in the notice record

**Integration with Fee Requirements**
This field works alongside other notice type fee settings:
- **Fee Required** - Whether this notice type requires payment
- **Fee Amount** - The standard fee amount for this notice type
- **Reduced Rate Fee** - Optional lower fee amount for early payment
- **Reduced Rate Days** - How many days the reduced rate is available

### Notice Type Fee Configuration

**Related Fee Fields**
The notice type configuration includes several fee-related fields:
- **Fee Required** - Boolean flag indicating if fee payment is mandatory
- **Fee** - The standard fee amount to be charged
- **Days to Fee Due** - Number of days until payment is due
- **Reduced Rate Fee** - Lower fee available for early payment
- **Reduced Rate Days** - Time period for reduced rate availability

**Payment Period Management**
The system manages different payment periods:
- **Standard Payment Period** - Set by 'Days to Fee Due' field
- **Reduced Rate Period** - Shorter period for discounted payment
- **Grace Period Management** - Automatic calculation of when payments become overdue

### Practical Usage Examples

**Fixed Penalty Notice Example**
For a Fixed Penalty Notice type:
- **Fee Required** - Yes
- **Fee Amount** - £150
- **Days to Fee Due** - 28 days
- **Reduced Rate Fee** - £75
- **Reduced Rate Days** - 14 days

This configuration means:
- Full fee of £150 is due 28 days after service
- Reduced fee of £75 is available for first 14 days
- Payment becomes overdue after 28 days

**Enforcement Notice Example**
For an enforcement notice requiring compliance fee:
- **Fee Required** - Yes
- **Fee Amount** - £200
- **Days to Fee Due** - 21 days
- **No reduced rate** - Standard fee only

This means payment of £200 is due within 21 days of service.

### System Benefits

**Automated Payment Management**
The days to fees due configuration provides:
- **Consistent Payment Periods** - Standardized payment timescales for each notice type
- **Automatic Due Date Calculation** - System calculates payment due dates without manual intervention
- **Early Payment Incentives** - Support for reduced rates to encourage prompt payment
- **Compliance Monitoring** - Clear deadlines for payment compliance tracking

**Administrative Efficiency**
- **Standardized Processes** - Consistent payment periods across similar notice types
- **Reduced Manual Calculation** - Automatic due date computation
- **Clear Payment Terms** - Defined payment periods for recipients and officers
- **Performance Tracking** - Ability to monitor payment compliance rates

### Integration with Other System Functions

**Payment Processing**
The payment due dates calculated from this field integrate with:
- **Payment Recording** - Tracking when payments are received against due dates
- **Overdue Monitoring** - Identifying notices with payments past due date
- **Reminder Systems** - Triggering payment reminders before due dates
- **Enforcement Escalation** - Managing further enforcement for unpaid fees

**Reporting and Analytics**
- **Payment Performance** - Analysis of payment rates within specified periods
- **Financial Forecasting** - Predicting income based on notice issue dates and payment periods
- **Compliance Rates** - Monitoring how many fees are paid within the specified timeframe
- **Collection Effectiveness** - Measuring success of different payment periods

### Configuration Best Practices

**Setting Appropriate Payment Periods**
When configuring days to fees due:
- **Legal Requirements** - Ensure compliance with statutory payment periods
- **Reasonable Time** - Allow sufficient time for recipients to arrange payment
- **Consistency** - Use similar periods for comparable notice types
- **Collection Optimization** - Balance prompt payment with reasonable compliance time

**Coordination with Reduced Rates**
- **Incentive Period** - Ensure reduced rate period is shorter than full payment period
- **Clear Communication** - Recipients understand both payment options and timescales
- **Administrative Management** - Officers can easily track which payment rate applies

### Other Potentially Useful Questions Identified

Based on the source code analysis, other notice type configuration questions that might be valuable:

1. **What does 'Reminder Communication Days' mean in notice type configuration?**
2. **How do 'Reduced Rate Days' work with the main payment due period?**
3. **What is 'Follow Up Communication Days' used for in notice types?**
4. **How does 'Appeal Number of Days' affect notice processing?**
5. **What does 'Fee Required' control in notice type setup?**
6. **How are 'Maximum Penalty on Conviction' amounts used in notices?**
7. **What is the purpose of 'Action Schedule ID' in notice type configuration?**
8. **How do notice types link to communication templates?**

### Conclusion

The 'Days to Fees due' field in notice type administration sets the standard payment period for notices requiring fees. This field enables automatic calculation of payment due dates by adding the specified number of days to the notice served date, ensuring consistent payment timescales and supporting effective fee collection processes.

**This answer is based on analysis of the actual Notice Type source code in the system, specifically the object.NoticeType.php class and the FPN API payment calculation functionality.**