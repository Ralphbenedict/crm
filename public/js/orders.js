document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('orderForm');
    const progressBar = document.querySelector('.progress-bar');
    const sections = document.querySelectorAll('.form-section');
    let currentSection = 0;

    // Initialize form validation
    function initializeValidation() {
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('input', function () {
                validateField(this);
            });
        });
    }

    // Validate individual field
    function validateField(field) {
        if (field.validity.valid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }
        updateProgress();
    }

    // Update progress bar
    function updateProgress() {
        const totalFields = form.querySelectorAll('input[required], select[required]').length;
        const validFields = form.querySelectorAll('.is-valid').length;
        const progress = (validFields / totalFields) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }

    // Format currency inputs
    const currencyInputs = document.querySelectorAll('#totalAmount, #withholdingTax');
    currencyInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            // Remove any non-numeric characters except decimal point
            let value = this.value.replace(/[^\d.]/g, '');

            // Ensure only one decimal point
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }

            // Limit to 2 decimal places
            if (parts.length === 2 && parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].slice(0, 2);
            }

            this.value = value;
        });
    });

    // Modern file upload handling
    function initializeFileUploads() {
        const uploadAreas = document.querySelectorAll('.upload-area');

        uploadAreas.forEach(area => {
            const input = area.querySelector('.file-input');
            const preview = document.getElementById(`filePreview${area.id.slice(-1)}`);

            // Click to upload
            area.addEventListener('click', () => input.click());

            // Drag and drop
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });

            area.addEventListener('dragleave', () => {
                area.classList.remove('dragover');
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('dragover');

                if (e.dataTransfer.files.length) {
                    input.files = e.dataTransfer.files;
                    handleFileSelect(input);
                }
            });

            // File selection
            input.addEventListener('change', () => handleFileSelect(input));
        });
    }

    function handleFileSelect(input) {
        const file = input.files[0];
        const preview = document.getElementById(`filePreview${input.id.slice(-1)}`);

        if (file) {
            // Clear existing preview
            preview.innerHTML = '';

            // Create preview item
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}">
                        <button type="button" class="btn-remove" title="Remove file">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                previewItem.innerHTML = `
                    <i class="bi bi-file-pdf"></i>
                    <span>${file.name}</span>
                    <button type="button" class="btn-remove" title="Remove file">
                        <i class="bi bi-x-circle"></i>
                    </button>
                `;
            }

            // Add remove functionality
            previewItem.querySelector('.btn-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                input.value = '';
                preview.innerHTML = '';
            });

            preview.appendChild(previewItem);
        }
    }

    // Initialize file uploads
    initializeFileUploads();

    // Form submission
    form.addEventListener('submit', function (e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    });

    // Initialize
    initializeValidation();
    updateProgress();
}); 