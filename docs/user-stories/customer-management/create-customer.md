# Create New Customer

**ID:** US-101  
**Feature:** Customer Management  
**Created By:** Ralph Bautista  
**Created On:** May 2, 2024  
**Last Updated:** May 2, 2024

## User Story

As a sales representative,  
I want to create a new customer record,  
So that I can track interactions with this customer and associate orders with them.

## Acceptance Criteria

1. A form is available to create a new customer with the following fields:
   - Customer Name (required)
   - TIN (Tax Identification Number)
   - Customer Type (individual/business)
   - Address Information (street, city, state, postal code, country)
   - Contact Information (email, phone)

2. The system validates the form data:
   - Customer Name must be between 2-100 characters
   - TIN must be in the format XXX-XXX-XXX if provided
   - Postal Code must be a valid 4-digit number

3. Upon successful submission, the system:
   - Creates a new customer record in the database
   - Displays a success message
   - Redirects to the customer list or the new customer's detail page

4. If validation fails, the system:
   - Displays appropriate error messages
   - Preserves the entered data
   - Allows the user to correct and resubmit

5. The form includes a "Cancel" button that returns to the customer list without creating a record

## Priority

High

## Effort

Medium

## Status

Done

## Notes

- TIN validation is specific to Philippines tax ID format
- Consider adding a "Create and Add Another" button for bulk customer creation
- Future enhancement: Add ability to upload customer logo or profile image

## Related

- **PRD:** [Customer Management PRD](../../prd/customer-management.md)
- **Technical Spec:** [Customer Model Specification](../../technical/models/customer-model.md)
- **Design:** [Customer Form Design](../../design/customer-form.md)
- **Related Stories:** [View Customer Details](./view-customer.md), [Edit Customer](./edit-customer.md)
