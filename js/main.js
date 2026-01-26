/* ========================================
   JESUCRISTO FUENTE DE VIDA - MAIN.JS
   JavaScript principal del sitio web
======================================== */

// ========================================
// VARIABLES GLOBALES
// ========================================
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// ========================================
// MENÚ MÓVIL
// ========================================
function initMobileMenu() {
    // Toggle del menú móvil
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Cambiar icono del botón
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ========================================
// NAVBAR STICKY CON EFECTO SCROLL
// ========================================
function initStickyNavbar() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Agregar sombra al navbar cuando se hace scroll
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Ocultar/mostrar navbar al hacer scroll (opcional)
        // Descomenta si quieres que el navbar se oculte al hacer scroll hacia abajo
        /*
        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        */
        
        lastScroll = currentScroll;
    });
}

// ========================================
// NAVEGACIÓN SUAVE (SMOOTH SCROLL)
// ========================================
function initSmoothScroll() {
    // Seleccionar todos los enlaces que apuntan a anclas
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignorar enlaces vacíos o solo "#"
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calcular la posición considerando la altura del navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                // Scroll suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// RESALTAR ENLACE ACTIVO EN NAVBAR
// ========================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const navbarHeight = navbar.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// ANIMACIÓN DEL INDICADOR DE SCROLL
// ========================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.schedule-section');
            if (nextSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = nextSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Ocultar indicador al hacer scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 200) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// ========================================
// ANIMACIONES AL HACER SCROLL (SCROLL REVEAL)
// ========================================
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Opcional: dejar de observar después de revelar
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos con clases de animación
    const animatedElements = document.querySelectorAll(`
        .scroll-reveal,
        .scroll-reveal-left,
        .scroll-reveal-right,
        .scroll-reveal-scale,
        .schedule-card,
        .about-card,
        .ministry-card,
        .testimonial-card,
        .anexo-card
    `);
    
    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// CONTADOR ANIMADO
// ========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Inicializar contadores si existen
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-counter'));
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
}

// ========================================
// LAZY LOADING DE IMÁGENES
// ========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// PREVENIR ENVÍO DE FORMULARIOS VACÍOS
// ========================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Por favor, completa todos los campos obligatorios.');
            }
        });
    });
}

// ========================================
// TOOLTIP PERSONALIZADO
// ========================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltipText = element.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => tooltip.classList.add('show'), 10);
            
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
                setTimeout(() => tooltip.remove(), 300);
            }, { once: true });
        });
    });
}

// ========================================
// CAMBIAR AÑO AUTOMÁTICAMENTE EN FOOTER
// ========================================
function updateFooterYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// ========================================
// MODO OSCURO (OPCIONAL)
// ========================================
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        // Verificar preferencia guardada
        const darkMode = localStorage.getItem('darkMode');
        
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
        }
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', null);
            }
        });
    }
}

// ========================================
// DETECCIÓN DE DISPOSITIVO
// ========================================
function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.add('desktop-device');
    }
}

// ========================================
// PREVENIR CLIC DERECHO EN IMÁGENES (OPCIONAL)
// ========================================
function protectImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    });
}

// ========================================
// MANEJO DE ERRORES DE IMÁGENES
// ========================================
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'images/placeholder.jpg'; // Imagen de respaldo
            this.alt = 'Imagen no disponible';
        });
    });
}

// ========================================
// PERFORMANCE: PRELOAD DE ENLACES
// ========================================
function initLinkPreload() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'prefetch';
                preloadLink.href = href;
                document.head.appendChild(preloadLink);
            }
        });
    });
}

// ========================================
// CONSOLA DE BIENVENIDA
// ========================================
function showWelcomeMessage() {
    console.log('%c¡Bienvenido a Jesucristo Fuente de Vida! 🙏', 'color: #4A90E2; font-size: 20px; font-weight: bold;');
    console.log('%c"Jesús le dijo: Yo soy el camino, la verdad y la vida" - Juan 14:6', 'color: #7B68EE; font-size: 14px; font-style: italic;');
}

// ========================================
// INICIALIZACIÓN AL CARGAR EL DOM
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Funciones principales
    initMobileMenu();
    initStickyNavbar();
    initSmoothScroll();
    initActiveNavLink();
    initScrollIndicator();
    initScrollReveal();
    
    // Funciones adicionales
    initCounters();
    initLazyLoading();
    initFormValidation();
    initTooltips();
    updateFooterYear();
    detectDevice();
    handleImageErrors();
    
    // Opcional: descomentar si necesitas
    // initDarkMode();
    // protectImages();
    // initLinkPreload();
    
    // Mensaje de bienvenida en consola
    showWelcomeMessage();
    
    console.log('✅ Sitio web cargado correctamente');
});

// ========================================
// INICIALIZACIÓN AL CARGAR LA VENTANA
// ========================================
window.addEventListener('load', () => {
    // Remover clase de carga si existe
    document.body.classList.remove('loading');
    
    console.log('✅ Todos los recursos cargados');
});

// ========================================
// MANEJO DE ERRORES GLOBALES
// ========================================
window.addEventListener('error', (e) => {
    console.error('Error capturado:', e.error);
});

// ========================================
// EXPORTAR FUNCIONES (SI SE USA COMO MÓDULO)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initSmoothScroll,
        initScrollReveal
    };
}