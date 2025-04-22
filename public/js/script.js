// Format currency input
document.querySelectorAll('input[type="number"]').forEach(input => {
    if (input.id === 'totalAmount' || input.id === 'withholdingTax') {
        input.addEventListener('input', function (e) {
            let value = this.value;
            if (value) {
                // Remove any non-numeric characters
                value = value.replace(/[^\d]/g, '');
                // Format with commas
                this.value = parseInt(value).toLocaleString();
            }
        });

        // When form is submitted, remove formatting
        input.form.addEventListener('submit', function () {
            input.value = input.value.replace(/,/g, '');
        });
    }
});

// File input preview
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function (e) {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            const preview = document.createElement('div');
            preview.className = 'mt-2';

            if (file.type.startsWith('image/')) {
                reader.onload = function (e) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" class="img-preview" alt="File preview">
                    `;
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                preview.innerHTML = `
                    <i class="fas fa-file-pdf"></i> ${file.name}
                `;
            }

            // Remove any existing preview
            const existingPreview = this.nextElementSibling;
            if (existingPreview && existingPreview.classList.contains('mt-2')) {
                existingPreview.remove();
            }

            this.parentNode.appendChild(preview);
        }
    });
});

// Active navigation link
document.addEventListener('DOMContentLoaded', function () {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (currentPath.startsWith(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
});

// Status color helper function
function getStatusColor(status) {
    const colors = {
        'Fully paid': 'success',
        'BIR 2307': 'warning',
        'Cancelled': 'danger',
        'Pending': 'info'
    };
    return colors[status] || 'secondary';
}

// Search functionality
document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const ordersTableBody = document.getElementById('ordersTableBody');

    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            const type = searchType.value;

            fetch(`/orders/search?query=${encodeURIComponent(query)}&type=${type}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.orders) {
                        ordersTableBody.innerHTML = '';
                        if (data.orders.length > 0) {
                            data.orders.forEach(order => {
                                const statusName = order.status ? order.status.name : 'Unknown';
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${order.siNumber || ''}</td>
                                    <td>${order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ''}</td>
                                    <td>${order.customerName || ''}</td>
                                    <td>${order.totalAmount ? parseFloat(order.totalAmount).toLocaleString() : ''}</td>
                                    <td>
                                        <span class="badge bg-${getStatusColor(statusName)}">
                                            ${statusName}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="btn-group" role="group">
                                            <a href="/orders/${order.id}" class="btn btn-sm btn-info">View</a>
                                            <a href="/orders/${order.id}/edit" class="btn btn-sm btn-warning">Edit</a>
                                            <form action="/orders/${order.id}/delete" method="POST" class="d-inline">
                                                <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this order?')">Delete</button>
                                            </form>
                                        </div>
                                    </td>
                                `;
                                ordersTableBody.appendChild(row);
                            });
                        } else {
                            ordersTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No orders found</td></tr>';
                        }
                    } else {
                        console.error('Error searching orders:', data.error);
                        ordersTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Error searching orders</td></tr>';
                    }
                })
                .catch(error => {
                    console.error('Error searching orders:', error);
                    ordersTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Error searching orders</td></tr>';
                });
        });

        // Handle search type change
        searchType.addEventListener('change', function () {
            searchInput.value = '';
            searchInput.placeholder = `Search by ${this.options[this.selectedIndex].text.toLowerCase()}...`;
        });
    }
});

// Customer search functionality
$(document).ready(function () {
    const searchInput = $('#customerSearch');
    const searchTypeSelect = $('#searchType');
    const customersTable = $('#customersTable');
    const customersTableBody = $('#customersTableBody');
    const noResultsRow = $('#noResultsRow');

    // Initialize autocomplete
    searchInput.autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.get('/customers/search/suggestions', {
                query: request.term,
                type: searchTypeSelect.val()
            })
                .done(function (data) {
                    response(data.suggestions);
                })
                .fail(function () {
                    response([]);
                });
        },
        select: function (event, ui) {
            searchInput.val(ui.item.value);
            $('#customerSearchForm').submit();
            return false;
        }
    });

    // Handle search form submission
    $('#customerSearchForm').on('submit', function (e) {
        e.preventDefault();
        const query = searchInput.val().trim();

        if (!query) {
            return;
        }

        $.get('/customers/search', {
            query: query,
            type: searchTypeSelect.val()
        })
            .done(function (data) {
                customersTableBody.empty();

                if (data.customers && data.customers.length > 0) {
                    data.customers.forEach(function (customer) {
                        const row = `
                        <tr>
                            <td>
                                <a href="/customers/${customer.id}">${customer.name}</a>
                            </td>
                            <td>${customer.tin || 'N/A'}</td>
                            <td>${new Date(customer.customerSince).toLocaleDateString()}</td>
                            <td>
                                ${customer.address ?
                                `${customer.address.streetAddress}, ${customer.address.city}` :
                                'No address'}
                            </td>
                            <td>
                                ${customer.contact ?
                                `${customer.contact.name}<br>${customer.contact.email || 'No email'}` :
                                'No contact'}
                            </td>
                            <td>
                                Total: ${customer.totalOrders}<br>
                                Pending: ${customer.pendingOrders}
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <a href="/customers/${customer.id}" class="btn btn-sm btn-info">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    <a href="/customers/${customer.id}/edit" class="btn btn-sm btn-warning">
                                        <i class="bi bi-pencil"></i>
                                    </a>
                                    <button type="button" class="btn btn-sm btn-danger delete-customer" data-id="${customer.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                        customersTableBody.append(row);
                    });
                    customersTable.show();
                    noResultsRow.hide();
                } else {
                    customersTable.hide();
                    noResultsRow.show();
                }
            })
            .fail(function () {
                alert('An error occurred while searching. Please try again.');
            });
    });

    // Clear search results when search input is cleared
    searchInput.on('input', function () {
        if (!this.value) {
            location.reload();
        }
    });
}); 