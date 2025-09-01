// Contact form functionality
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupValidation();
        this.setupSubmitHandler();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        let isValid = true;
        let message = '';

        // Required field validation
        if (!value) {
            isValid = false;
            message = `${this.capitalizeFirst(fieldName)} is required`;
        } else {
            // Specific field validations
            switch (fieldName) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        message = 'Please enter a valid email address';
                    }
                    break;
                case 'name':
                    if (value.length < 2) {
                        isValid = false;
                        message = 'Name must be at least 2 characters long';
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        isValid = false;
                        message = 'Message must be at least 10 characters long';
                    }
                    break;
            }
        }

        // Update UI
        if (!isValid) {
            formGroup.classList.add('error');
            errorMessage.textContent = message;
        } else {
            formGroup.classList.remove('error');
            errorMessage.textContent = '';
        }

        return isValid;
    }

    clearErrors(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
    }

    setupSubmitHandler() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            const inputs = this.form.querySelectorAll('input, textarea');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                this.showFormError('Please fix the errors above');
                return;
            }

            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual endpoint)
                await this.submitForm();
                this.showSuccess();
                this.form.reset();
            } catch (error) {
                this.showError('Failed to send message. Please try again.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    async submitForm() {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // For demo purposes, always succeed
                // In a real implementation, you would send data to your backend
                const formData = new FormData(this.form);
                const data = Object.fromEntries(formData);
                
                console.log('Form data:', data);
                resolve();
            }, 2000);
        });
    }

    showSuccess() {
        // Use the toast from main.js
        if (window.portfolioApp) {
            window.portfolioApp.showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        }
    }

    showError(message) {
        if (window.portfolioApp) {
            window.portfolioApp.showToast(message, 'error');
        }
    }

    showFormError(message) {
        // Create or update form error message
        let errorDiv = this.form.querySelector('.form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                color: var(--error-500);
                background: rgba(239, 68, 68, 0.1);
                padding: var(--space-3);
                border-radius: var(--radius);
                margin-bottom: var(--space-4);
                text-align: center;
                font-size: var(--font-size-sm);
                border: 1px solid rgba(239, 68, 68, 0.2);
            `;
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }
        
        errorDiv.textContent = message;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});