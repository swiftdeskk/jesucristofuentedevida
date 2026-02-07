let currentImageIndex = 0;
let images = [];

// ========================================
// FILTRADO DE GALERÍA
// ========================================
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover active
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar active
            button.classList.add('active');
            
            // Obtener filtro
            const filter = button.getAttribute('data-filter');
            
            // Filtrar imágenes
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Actualizar array de imágenes visibles
            updateVisibleImages();
        });
    });
}

// ========================================
// MODAL DE IMAGEN
// ========================================
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const viewButtons = document.querySelectorAll('.gallery-view-btn');
    
    // Crear array de imágenes
    updateVisibleImages();
    
    // Abrir modal al hacer clic en ver
    viewButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const imageSrc = button.getAttribute('data-image');
            const galleryItem = button.closest('.gallery-item');
            const title = galleryItem.querySelector('h3').textContent;
            const subtitle = galleryItem.querySelector('p').textContent;
            
            currentImageIndex = index;
            openModal(imageSrc, `${title} - ${subtitle}`);
        });
    });
    
    // También abrir al hacer clic en la imagen
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const button = item.querySelector('.gallery-view-btn');
            const imageSrc = button.getAttribute('data-image');
            const title = item.querySelector('h3').textContent;
            const subtitle = item.querySelector('p').textContent;
            
            currentImageIndex = index;
            openModal(imageSrc, `${title} - ${subtitle}`);
        });
    });
    
    // Cerrar modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Navegación
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(-1);
    });
    
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(1);
    });
    
    // Teclado
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
            } else if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            }
        }
    });
    
    function openModal(imageSrc, caption) {
        modalImage.src = imageSrc || 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Imagen';
        modalCaption.textContent = caption;
        modal.classList.add('active');
    }
    
    function navigateImage(direction) {
        currentImageIndex += direction;
        
        // Loop
        if (currentImageIndex < 0) {
            currentImageIndex = images.length - 1;
        } else if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
        }
        
        const imageData = images[currentImageIndex];
        modalImage.src = imageData.src;
        modalCaption.textContent = imageData.caption;
    }
}

function updateVisibleImages() {
    images = [];
    const visibleItems = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
    
    visibleItems.forEach(item => {
        const button = item.querySelector('.gallery-view-btn');
        const title = item.querySelector('h3').textContent;
        const subtitle = item.querySelector('p').textContent;
        const imageSrc = button.getAttribute('data-image');
        
        images.push({
            src: imageSrc || 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Imagen',
            caption: `${title} - ${subtitle}`
        });
    });
}

// ========================================
// CARGAR MÁS FOTOS
// ========================================
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Mostrar loading
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            
            // Simular carga
            setTimeout(() => {
                showNotification('No hay más fotos para mostrar en este momento.', 'info');
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-images"></i> Cargar Más Fotos';
            }, 1000);
        });
    }
}

// ========================================
// LAZY LOADING DE IMÁGENES
// ========================================
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-image img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
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
    initGalleryFilter();
    initImageModal();
    initLoadMore();
    initLazyLoading();
    
});

// Agregar animaciones CSS
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
    
    .gallery-image img.loaded {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);