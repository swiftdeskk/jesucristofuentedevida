// ========================================
// EFECTO PARALLAX EN HERO
// ========================================
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            
            if (heroContent) {
                const parallaxSpeed = 0.5;
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                heroContent.style.opacity = 1 - (scrolled / 700);
            }
        });
    }
}

// ========================================
// ANIMACIÓN DE TARJETAS AL APARECER
// ========================================
function initCardAnimations() {
    const cards = document.querySelectorAll(`
        .schedule-card,
        .about-card,
        .ministry-card,
        .testimonial-card,
        .anexo-card
    `);
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Agregar delay escalonado
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });
}

// ========================================
// EFECTO RIPPLE EN BOTONES
// ========================================
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Crear elemento ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // Calcular posición
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            // Agregar al botón
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            // Remover después de la animación
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ========================================
// ANIMACIÓN DE CONTADORES
// ========================================
function initNumberCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// ========================================
// ANIMACIÓN DE TEXTO LETRA POR LETRA
// ========================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

function initTypeWriterEffect() {
    const typeElements = document.querySelectorAll('[data-typewriter]');
    
    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.getAttribute('data-typewriter');
                const speed = parseInt(element.getAttribute('data-speed')) || 50;
                
                typeWriter(element, text, speed);
                typeObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    typeElements.forEach(el => typeObserver.observe(el));
}

// ========================================
// ANIMACIÓN DE PROGRESO (BARRAS)
// ========================================
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress') || '0';
                
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 100);
                
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        bar.style.width = '0%';
        bar.style.transition = 'width 1.5s ease';
        progressObserver.observe(bar);
    });
}

// ========================================
// EFECTO HOVER 3D EN TARJETAS
// ========================================
function init3DCardEffect() {
    const cards = document.querySelectorAll('.ministry-card, .about-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
        
        card.style.transition = 'transform 0.3s ease';
    });
}

// ========================================
// ZOOM EN IMÁGENES AL HACER HOVER
// ========================================
function initImageZoom() {
    const images = document.querySelectorAll('.zoomable-image, .gallery-image');
    
    images.forEach(img => {
        const container = img.parentElement;
        container.style.overflow = 'hidden';
        
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.1)';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
        
        img.style.transition = 'transform 0.5s ease';
    });
}

// ========================================
// ANIMACIÓN DE APARICIÓN SECUENCIAL
// ========================================
function initSequentialReveal() {
    const elements = document.querySelectorAll('[data-reveal-order]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const order = parseInt(entry.target.getAttribute('data-reveal-order')) || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, order * 200);
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    elements.forEach(el => revealObserver.observe(el));
}

// ========================================
// EFECTO DE ONDAS EN BOTONES
// ========================================
function initWaveEffect() {
    const waveButtons = document.querySelectorAll('.btn-wave');
    
    waveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const wave = document.createElement('div');
            wave.className = 'wave-effect';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            wave.style.width = wave.style.height = size * 2 + 'px';
            wave.style.left = e.clientX - rect.left - size + 'px';
            wave.style.top = e.clientY - rect.top - size + 'px';
            
            this.appendChild(wave);
            
            setTimeout(() => wave.remove(), 1000);
        });
    });
}

// ========================================
// ANIMACIÓN DE ICONOS AL HACER HOVER
// ========================================
function initIconAnimations() {
    const iconContainers = document.querySelectorAll('.schedule-icon, .about-icon, .ministry-icon');
    
    iconContainers.forEach(container => {
        const icon = container.querySelector('i');
        
        if (icon) {
            container.addEventListener('mouseenter', () => {
                icon.classList.add('icon-bounce');
            });
            
            container.addEventListener('mouseleave', () => {
                icon.classList.remove('icon-bounce');
            });
        }
    });
}

// ========================================
// TEXTO REVELADO GRADUALMENTE
// ========================================
function initTextReveal() {
    const textElements = document.querySelectorAll('.text-reveal');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    textElements.forEach(el => textObserver.observe(el));
}

// ========================================
// SECCIÓN COUNTER CON ANIMACIÓN
// ========================================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const suffix = entry.target.dataset.suffix || '';
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateStat = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.textContent = Math.floor(current) + suffix;
                        requestAnimationFrame(updateStat);
                    } else {
                        entry.target.textContent = target + suffix;
                    }
                };
                
                updateStat();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.7 });
    
    stats.forEach(stat => statsObserver.observe(stat));
}

// ========================================
// INICIALIZACIÓN DE TODAS LAS ANIMACIONES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Animaciones principales
    initParallaxEffect();
    initCardAnimations();
    initRippleEffect();
    initNumberCounters();
    initIconAnimations();
    
    // Animaciones adicionales
    initTypeWriterEffect();
    initProgressBars();
    init3DCardEffect();
    initImageZoom();
    initSequentialReveal();
    initWaveEffect();
    initTextReveal();
    initStatsCounter();

});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Desactivar todas las animaciones
    document.documentElement.style.setProperty('--transition-duration', '0s');
}