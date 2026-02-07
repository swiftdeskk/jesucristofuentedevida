// ========================================
// CONFIGURACIÓN GENERAL
// ========================================
const FormConfig = {
    formspreeEndpoint: 'https://formspree.io/f/xykkpzok',
    showSuccessMessage: true,
    showErrorMessage: true,
    redirectAfterSubmit: false,
    redirectDelay: 2000,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phonePattern: /^(\+51|51)?[\s]?[9][0-9]{8}$/
};

// ========================================
// VALIDACIÓN DE CAMPOS
// ========================================
const Validators = {
    required: (value) => {
        return value.trim() !== '';
    },
    
    email: (value) => {
        return FormConfig.emailPattern.test(value);
    },
    
    phone: (value) => {
        const digitsOnly = value.replace(/\D/g, '');
        
        if (digitsOnly.length === 9) {
            return digitsOnly.startsWith('9');
        } else if (digitsOnly.length === 11) {
            return digitsOnly.startsWith('51') && digitsOnly.charAt(2) === '9';
        }
        
        return false;
    },
    
    minLength: (value, min) => {
        return value.length >= min;
    },
    
    maxLength: (value, max) => {
        return value.length <= max;
    },
    
    numeric: (value) => {
        return !isNaN(value) && value.trim() !== '';
    },
    
    alpha: (value) => {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
    },
    
    url: (value) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }
};

// ========================================
// MENSAJES DE ERROR
// ========================================
const ErrorMessages = {
    required: 'Este campo es obligatorio',
    email: 'Por favor, ingresa un email válido',
    phone: 'Ingresa un número de celular peruano válido (9 dígitos que empiecen con 9)',
    minLength: (min) => `Debe tener al menos ${min} caracteres`,
    maxLength: (max) => `No debe exceder ${max} caracteres`,
    numeric: 'Solo se permiten números',
    alpha: 'Solo se permiten letras',
    url: 'Por favor, ingresa una URL válida',
    checkbox: 'Debes aceptar este campo para continuar'
};

// ========================================
// FORMATEADOR DE TELÉFONO
// ========================================
class PhoneFormatter {
    constructor(input) {
        this.input = input;
        this.init();
    }
    
    init() {
        this.input.addEventListener('input', (e) => this.format(e));
        this.input.addEventListener('focus', (e) => this.handleFocus(e));
        this.input.addEventListener('blur', (e) => this.handleBlur(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Formatear valor existente
        if (this.input.value) {
            this.formatExisting();
        }
    }
    
    format(e) {
        let value = e.target.value;
        let numbersOnly = value.replace(/\D/g, '');
        
        // Remover 51 si está al inicio
        if (numbersOnly.startsWith('51')) {
            numbersOnly = numbersOnly.substring(2);
        }
        
        // Limitar a 9 dígitos
        numbersOnly = numbersOnly.substring(0, 9);
        
        // Formatear con espacios
        let formatted = '';
        for (let i = 0; i < numbersOnly.length; i++) {
            if (i > 0 && i % 3 === 0) {
                formatted += ' ';
            }
            formatted += numbersOnly[i];
        }
        
        // Agregar +51
        if (numbersOnly.length > 0) {
            formatted = '+51 ' + formatted;
        }
        
        e.target.value = formatted;
    }
    
    handleFocus(e) {
        if (!e.target.value || e.target.value.trim() === '') {
            e.target.value = '+51 ';
        }
        setTimeout(() => {
            const length = e.target.value.length;
            e.target.setSelectionRange(length, length);
        }, 0);
    }
    
    handleBlur(e) {
        if (e.target.value === '+51 ' || e.target.value === '+51') {
            e.target.value = '';
        }
    }
    
    handleKeydown(e) {
        const cursorPos = e.target.selectionStart;
        
        // Prevenir borrar el +51
        if (e.key === 'Backspace' && cursorPos <= 4) {
            e.preventDefault();
            return;
        }
        
        // Solo permitir números
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
        if (!allowedKeys.includes(e.key) && (e.key < '0' || e.key > '9')) {
            e.preventDefault();
        }
    }
    
    formatExisting() {
        const event = { target: this.input };
        this.format(event);
    }
}

// ========================================
// CLASE PARA MANEJO DE FORMULARIOS
// ========================================
class FormHandler {
    constructor(formElement) {
        this.form = formElement;
        this.fields = this.form.querySelectorAll('input, textarea, select');
        this.submitButton = this.form.querySelector('button[type="submit"], input[type="submit"]');
        this.useFormspree = this.form.hasAttribute('data-formspree') || this.form.id === 'contactForm';
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
        
        this.disableAutocomplete();
    }
    
    validateField(field) {
        const value = field.value;
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required')) {
            if (field.type === 'checkbox') {
                if (!field.checked) {
                    isValid = false;
                    errorMessage = ErrorMessages.checkbox;
                }
            } else if (!Validators.required(value)) {
                isValid = false;
                errorMessage = ErrorMessages.required;
            }
        }
        
        if (field.type === 'email' && value && !Validators.email(value)) {
            isValid = false;
            errorMessage = ErrorMessages.email;
        }
        
        if (field.type === 'tel' && value && !Validators.phone(value)) {
            isValid = false;
            errorMessage = ErrorMessages.phone;
        }
        
        const minLength = field.getAttribute('minlength');
        if (minLength && value && !Validators.minLength(value, minLength)) {
            isValid = false;
            errorMessage = ErrorMessages.minLength(minLength);
        }
        
        const maxLength = field.getAttribute('maxlength');
        if (maxLength && value && !Validators.maxLength(value, maxLength)) {
            isValid = false;
            errorMessage = ErrorMessages.maxLength(maxLength);
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error', 'is-invalid');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error error-message';
        errorElement.textContent = message;
        
        if (field.type === 'checkbox') {
            const checkboxGroup = field.closest('.checkbox-group') || field.parentNode;
            checkboxGroup.appendChild(errorElement);
        } else {
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        field.style.borderColor = '#e74c3c';
    }
    
    clearFieldError(field) {
        field.classList.remove('error', 'is-invalid');
        field.style.borderColor = '';
        
        const errorElement = field.parentNode.querySelector('.field-error') ||
                            (field.closest('.checkbox-group') && field.closest('.checkbox-group').querySelector('.field-error'));
        
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    validateForm() {
        let isValid = true;
        
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showNotification('Por favor, corrige los errores antes de enviar', 'error');
            
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            
            return;
        }
        
        this.disableSubmitButton();
        
        try {
            if (this.useFormspree) {
                await this.sendWithFormspree();
            } else {
                await this.simulateSubmit();
            }
            
            this.showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.', 'success');
            this.resetForm();
            
            if (FormConfig.redirectAfterSubmit) {
                setTimeout(() => {
                    window.location.href = this.form.getAttribute('data-redirect') || '/';
                }, FormConfig.redirectDelay);
            }
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            this.showNotification('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.', 'error');
        } finally {
            this.enableSubmitButton();
        }
    }
    
    async sendWithFormspree() {
        const formData = new FormData(this.form);
        
        const response = await fetch(FormConfig.formspreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const data = await response.json();
            if (data.errors) {
                throw new Error(data.errors.map(e => e.message).join(', '));
            }
            throw new Error('Error al enviar el formulario');
        }
        
        return await response.json();
    }
    
    async sendToServer(data) {
        const response = await fetch(this.form.action || '/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Error en el servidor');
        }
        
        return await response.json();
    }
    
    simulateSubmit() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `form-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Cerrar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
    
    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || colors.info;
    }
    
    disableSubmitButton() {
        if (this.submitButton) {
            this.submitButton.disabled = true;
            this.submitButton.classList.add('loading');
            this.originalButtonText = this.submitButton.innerHTML;
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        }
    }
    
    enableSubmitButton() {
        if (this.submitButton) {
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('loading');
            this.submitButton.innerHTML = this.originalButtonText || '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
        }
    }
    
    resetForm() {
        this.form.reset();
        this.fields.forEach(field => this.clearFieldError(field));
        
        const counter = this.form.querySelector('.character-counter');
        if (counter) {
            const textarea = this.form.querySelector('textarea[maxlength]');
            if (textarea) {
                const maxLength = textarea.getAttribute('maxlength');
                counter.textContent = `0 / ${maxLength}`;
                counter.style.color = '#999';
            }
        }
    }
    
    disableAutocomplete() {
        const sensitiveFields = this.form.querySelectorAll('input[type="password"], input[type="email"]');
        sensitiveFields.forEach(field => {
            field.setAttribute('autocomplete', 'off');
        });
    }
}

// ========================================
// INICIALIZAR FORMATEADORES DE TELÉFONO
// ========================================
function initPhoneFormatters() {
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="telefono"], input[name="phone"]');
    
    phoneInputs.forEach(input => {
        // Establecer placeholder
        if (!input.placeholder) {
            input.placeholder = '+51 999 999 999';
        }
        
        // Aplicar formateador
        new PhoneFormatter(input);
    });
}

// ========================================
// FORMULARIO DE CONTACTO
// ========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        new FormHandler(contactForm);
    }
}

// ========================================
// FORMULARIO DE SUSCRIPCIÓN
// ========================================
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (!Validators.email(emailInput.value)) {
                showInlineError(emailInput, 'Por favor, ingresa un email válido');
                return;
            }
            
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                showSuccessMessage(form, '¡Gracias por suscribirte! Recibirás nuestras novedades.');
                form.reset();
            } catch (error) {
                showInlineError(emailInput, 'Error al suscribirse. Intenta nuevamente.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    });
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================
function showInlineError(input, message) {
    const existingError = input.parentNode.querySelector('.inline-error');
    if (existingError) {
        existingError.remove();
    }
    
    const error = document.createElement('span');
    error.className = 'inline-error';
    error.textContent = message;
    error.style.cssText = `
        display: block;
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.3rem;
    `;
    
    input.style.borderColor = '#e74c3c';
    input.parentNode.appendChild(error);
    
    input.addEventListener('input', function removeError() {
        error.remove();
        input.style.borderColor = '';
        input.removeEventListener('input', removeError);
    });
}

function showSuccessMessage(container, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: fadeIn 0.3s ease;
    `;
    
    container.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

// ========================================
// VALIDACIÓN DE FORMULARIOS GENÉRICOS
// ========================================
function initAllForms() {
    const forms = document.querySelectorAll('form[data-validate="true"]');
    
    forms.forEach(form => {
        new FormHandler(form);
    });
}

// ========================================
// CONTADOR DE CARACTERES
// ========================================
function initCharacterCounter() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength');
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.85rem;
            color: #999;
            margin-top: 0.3rem;
        `;
        
        const updateCounter = () => {
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#e74c3c';
            } else {
                counter.style.color = '#999';
            }
        };
        
        const existingCounter = textarea.parentNode.querySelector('.character-counter');
        if (!existingCounter) {
            textarea.parentNode.appendChild(counter);
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });
}

// ========================================
// AUTO-RESIZE DE TEXTAREAS
// ========================================
function initAutoResizeTextarea() {
    const textareas = document.querySelectorAll('textarea[data-autoresize]');
    
    textareas.forEach(textarea => {
        textarea.style.overflow = 'hidden';
        
        const resize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        
        textarea.addEventListener('input', resize);
        resize();
    });
}

// ========================================
// PREVENIR DOBLE SUBMIT
// ========================================
function preventDoubleSubmit() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        let isSubmitting = false;
        
        form.addEventListener('submit', (e) => {
            if (isSubmitting) {
                e.preventDefault();
                return false;
            }
            
            isSubmitting = true;
            
            setTimeout(() => {
                isSubmitting = false;
            }, 3000);
        });
    });
}

// ========================================
// AGREGAR ESTILOS DE ANIMACIÓN
// ========================================
function addAnimationStyles() {
    if (document.getElementById('form-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'form-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-content i:first-child {
            font-size: 1.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            margin-left: auto;
            opacity: 0.8;
            transition: opacity 0.3s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        input[type="tel"]:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }
        
        input[type="tel"].error {
            animation: shake 0.3s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @media (max-width: 768px) {
            .form-notification {
                left: 20px !important;
                right: 20px !important;
                max-width: none !important;
                top: 80px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    initPhoneFormatters();
    initContactForm();
    initNewsletterForm();
    initAllForms();
    initCharacterCounter();
    initAutoResizeTextarea();
    preventDoubleSubmit();
    
});

// ========================================
// EXPORTAR PARA USO EXTERNO
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FormHandler,
        Validators,
        ErrorMessages,
        PhoneFormatter
    };
}