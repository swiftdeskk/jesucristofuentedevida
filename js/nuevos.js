// ========================================
// ACORDEÓN DE FAQS
// ========================================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar otros FAQs abiertos (opcional)
            const wasActive = item.classList.contains('active');
            
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle el FAQ clickeado
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
}

// ========================================
// INSCRIPCIÓN AL CURSO
// ========================================
function initCourseRegistration() {
    const courseBtn = document.querySelector('.course-info .btn-primary');
    
    if (courseBtn) {
        courseBtn.addEventListener('click', () => {
            showRegistrationModal();
        });
    }
}

function showRegistrationModal() {
    const modal = document.createElement('div');
    modal.className = 'registration-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2><i class="fas fa-user-graduate"></i> Inscripción al Curso de Bienvenida</h2>
            <p>Completa tus datos y nos pondremos en contacto contigo</p>
            
            <form id="courseForm" class="course-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="nombre">Nombre Completo *</label>
                        <input type="text" id="nombre" name="nombre" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Correo Electrónico *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono *</label>
                        <input type="tel" id="telefono" name="telefono" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="mensaje">¿Cómo nos conociste?</label>
                    <textarea id="mensaje" name="mensaje" rows="3"></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">
                    <i class="fas fa-check-circle"></i> Confirmar Inscripción
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Agregar estilos al modal
    addModalStyles();
    
    // Animación de entrada
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Cerrar modal
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', () => closeModal(modal));
    
    // Manejar envío del formulario
    const form = modal.querySelector('#courseForm');
    form.addEventListener('submit', handleCourseSubmit);
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

async function handleCourseSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Deshabilitar botón
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        // Simular envío
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
            const modal = document.querySelector('.registration-modal');
            if (modal) {
                closeModal(modal);
            }
        }, 2000);
        
    } catch (error) {
        showNotification('Hubo un error. Por favor, intenta nuevamente.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmar Inscripción';
    }
}

function showSuccessMessage() {
    const form = document.querySelector('#courseForm');
    if (form) {
        form.innerHTML = `
            <div class="success-message-box">
                <i class="fas fa-check-circle"></i>
                <h3>¡Inscripción Exitosa!</h3>
                <p>Hemos recibido tu solicitud. Te contactaremos pronto con más detalles del curso.</p>
            </div>
        `;
    }
}

// ========================================
// BOTONES "UNIRME AL MINISTERIO"
// ========================================
function initMinistryButtons() {
    const ministryButtons = document.querySelectorAll('.ministry-detail-content .btn-primary');
    
    ministryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ministryName = button.closest('.ministry-detail-content').querySelector('.ministry-detail-title').textContent;
            showMinistryInterestForm(ministryName);
        });
    });
}

function showMinistryInterestForm(ministryName) {
    const modal = document.createElement('div');
    modal.className = 'registration-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2><i class="fas fa-hands-helping"></i> Únete al ${ministryName}</h2>
            <p>Cuéntanos un poco sobre ti y nos pondremos en contacto</p>
            
            <form id="ministryForm" class="course-form">
                <input type="hidden" name="ministerio" value="${ministryName}">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="nombre">Nombre Completo *</label>
                        <input type="text" id="nombre" name="nombre" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Correo Electrónico *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono *</label>
                        <input type="tel" id="telefono" name="telefono" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="experiencia">¿Tienes experiencia previa en este ministerio?</label>
                    <select id="experiencia" name="experiencia">
                        <option value="">Selecciona una opción</option>
                        <option value="ninguna">Ninguna experiencia</option>
                        <option value="poca">Poca experiencia</option>
                        <option value="moderada">Experiencia moderada</option>
                        <option value="mucha">Mucha experiencia</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="mensaje">¿Por qué te interesa este ministerio?</label>
                    <textarea id="mensaje" name="mensaje" rows="4"></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">
                    <i class="fas fa-paper-plane"></i> Enviar Solicitud
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    addModalStyles();
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', () => closeModal(modal));
    
    const form = modal.querySelector('#ministryForm');
    form.addEventListener('submit', handleMinistrySubmit);
}

async function handleMinistrySubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        form.innerHTML = `
            <div class="success-message-box">
                <i class="fas fa-check-circle"></i>
                <h3>¡Solicitud Enviada!</h3>
                <p>Gracias por tu interés en servir. Un líder del ministerio se pondrá en contacto contigo pronto.</p>
            </div>
        `;
        
        setTimeout(() => {
            const modal = document.querySelector('.registration-modal');
            if (modal) closeModal(modal);
        }, 2500);
        
    } catch (error) {
        showNotification('Hubo un error. Por favor, intenta nuevamente.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
    }
}

// ========================================
// AGREGAR ESTILOS DEL MODAL
// ========================================
function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .registration-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .registration-modal.show {
            opacity: 1;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
        }
        
        .modal-content {
            position: relative;
            background: white;
            max-width: 600px;
            margin: 50px auto;
            padding: 2.5rem;
            border-radius: 15px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            color: #999;
            cursor: pointer;
            line-height: 1;
            transition: color 0.3s;
        }
        
        .modal-close:hover {
            color: #333;
        }
        
        .modal-content h2 {
            color: #2C3E50;
            margin-bottom: 0.5rem;
            font-size: 1.8rem;
        }
        
        .modal-content h2 i {
            color: #4A90E2;
            margin-right: 0.5rem;
        }
        
        .modal-content > p {
            color: #666;
            margin-bottom: 2rem;
        }
        
        .course-form .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .course-form .form-group {
            margin-bottom: 1.5rem;
        }
        
        .course-form label {
            display: block;
            margin-bottom: 0.5rem;
            color: #2C3E50;
            font-weight: 600;
            font-size: 0.95rem;
        }
        
        .course-form input,
        .course-form textarea,
        .course-form select {
            width: 100%;
            padding: 0.8rem;
            border: 2px solid #F8F9FA;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            transition: border-color 0.3s;
        }
        
        .course-form input:focus,
        .course-form textarea:focus,
        .course-form select:focus {
            outline: none;
            border-color: #4A90E2;
        }
        
        .btn-block {
            width: 100%;
            justify-content: center;
        }
        
        .success-message-box {
            text-align: center;
            padding: 2rem;
        }
        
        .success-message-box i {
            font-size: 4rem;
            color: #27ae60;
            margin-bottom: 1rem;
        }
        
        .success-message-box h3 {
            color: #2C3E50;
            font-size: 1.8rem;
            margin-bottom: 1rem;
        }
        
        .success-message-box p {
            color: #666;
            font-size: 1.05rem;
            line-height: 1.6;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                margin: 20px;
                padding: 1.5rem;
            }
            
            .course-form .form-row {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ========================================
// NOTIFICACIONES
// ========================================
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || colors.info;
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initFAQAccordion();
    initCourseRegistration();
    initMinistryButtons();
    
});