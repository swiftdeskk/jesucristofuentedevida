// ========================================
// FILTRADO DE CATEGORÍAS
// ========================================
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover active de todos
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar active al clickeado
            button.classList.add('active');
            
            // Obtener categoría
            const category = button.getAttribute('data-category');
            
            // Filtrar posts
            blogCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ========================================
// PAGINACIÓN
// ========================================
function initPagination() {
    const paginationButtons = document.querySelectorAll('.pagination-btn:not([disabled])');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover active
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar active (si no es flecha)
            if (!button.querySelector('i')) {
                button.classList.add('active');
            }
            
            // Scroll a inicio de blog
            const blogSection = document.querySelector('.blog-posts-section');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ========================================
// SUSCRIPCIÓN AL NEWSLETTER
// ========================================
function initNewsletterSubscription() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        const input = newsletterForm.querySelector('.newsletter-input');
        const button = newsletterForm.querySelector('.btn');
        
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = input.value.trim();
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Deshabilitar botón
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            try {
                // Simular envío
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showNotification('¡Gracias por suscribirte! Recibirás nuestras actualizaciones.', 'success');
                input.value = '';
            } catch (error) {
                showNotification('Hubo un error. Por favor, intenta nuevamente.', 'error');
            } finally {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-envelope"></i> Suscribirme';
            }
        });
    }
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
    initCategoryFilter();
    initPagination();
    initNewsletterSubscription();
    
});

// Agregar animación CSS si no existe
const style = document.createElement('style');
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
`;
document.head.appendChild(style);