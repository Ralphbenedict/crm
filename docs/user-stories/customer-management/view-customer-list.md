# View Customer List

**ID:** US-102  
**Feature:** Customer Management  
**Created By:** Ralph Bautista  
**Created On:** May 2, 2024  
**Last Updated:** May 2, 2024

## User Story

As a sales manager,  
I want to view a list of all customers,  
So that I can monitor the customer base and quickly access customer information.

## Acceptance Criteria

1. The customer list page displays a table with the following columns:
   - Customer Name (clickable to view details)
   - TIN
   - Customer Since (date)
   - Address
   - Primary Contact
   - Customer Type
   - Actions (Edit, Delete)

2. The list is paginated, showing 20 customers per page

3. The list is sorted alphabetically by customer name by default

4. A search bar allows filtering customers by:
   - Name
   - TIN

5. The search is dynamic, updating results as the user types

6. The total number of customers is displayed at the top of the list

7. A "Create New Customer" button is prominently displayed

8. Each customer row includes:
   - A link to view detailed information
   - A button to edit the customer
   - A button to delete the customer (with confirmation)

9. The list shows order statistics for each customer:
   - Total number of orders
   - Number of pending orders

## Priority

High

## Effort

Medium

## Status

Done

## Notes

- Consider adding advanced filtering options in the future
- Performance optimization may be needed for large customer databases
- Future enhancement: Add export to CSV/Excel functionality

## Related

- **PRD:** [Customer Management PRD](../../prd/customer-management.md)
- **Technical Spec:** [Customer List Implementation](../../technical/views/customer-list.md)
- **Design:** [Customer List UI](../../design/customer-list.md)
- **Related Stories:** [Search Customers](./search-customers.md), [Create Customer](./create-customer.md)
