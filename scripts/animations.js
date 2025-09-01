// Advanced animations and effects
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallaxEffects();
        this.setupTypewriterEffect();
        this.setupFloatingElements();
        this.setupMouseFollower();
        this.setupTextRevealAnimations();
        this.setupLoadingAnimations();
    }

    setupParallaxEffects() {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            // Hero parallax
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
            }

            // Profile card parallax
            const profileCard = document.querySelector('.profile-card');
            if (profileCard) {
                profileCard.style.transform = `translateY(${scrollY * -0.1}px)`;
            }

            // Section backgrounds
            document.querySelectorAll('.parallax').forEach(element => {
                const rect = element.getBoundingClientRect();
                const speed = element.dataset.speed || 0.5;
                const yPos = -(rect.top * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        const requestParallax = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestParallax);
    }

    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.speed) || 100;
            
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-500)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    // Blinking cursor effect
                    setInterval(() => {
                        element.style.borderRight = element.style.borderRight === 'none' 
                            ? '2px solid var(--primary-500)' 
                            : 'none';
                    }, 500);
                }
            };
            
            // Start typewriter when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    setupFloatingElements() {
        // Create floating decoration elements
        const createFloatingElement = (className, emoji) => {
            const element = document.createElement('div');
            element.className = className;
            element.textContent = emoji;
            element.style.cssText = `
                position: absolute;
                font-size: 2rem;
                opacity: 0.1;
                pointer-events: none;
                animation: float 6s ease-in-out infinite;
                z-index: 0;
            `;
            return element;
        };

        // Add floating elements to hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const floatingElements = [
                { emoji: '💻', top: '20%', left: '10%', delay: '0s' },
                { emoji: '⚡', top: '60%', left: '80%', delay: '2s' },
                { emoji: '🚀', top: '40%', left: '15%', delay: '4s' },
                { emoji: '🎯', top: '70%', left: '70%', delay: '1s' },
                { emoji: '🔧', top: '30%', left: '85%', delay: '3s' }
            ];

            floatingElements.forEach(({ emoji, top, left, delay }) => {
                const element = createFloatingElement('floating-icon', emoji);
                element.style.top = top;
                element.style.left = left;
                element.style.animationDelay = delay;
                hero.appendChild(element);
            });
        }
    }

    setupMouseFollower() {
        // Create cursor follower for desktop
        if (window.innerWidth > 1024) {
            const cursor = document.createElement('div');
            cursor.className = 'cursor-follower';
            cursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s ease, transform 0.1s ease;
            `;
            document.body.appendChild(cursor);

            let mouseX = 0;
            let mouseY = 0;
            let cursorX = 0;
            let cursorY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                cursor.style.opacity = '0.6';
            });

            document.addEventListener('mouseleave', () => {
                cursor.style.opacity = '0';
            });

            // Smooth cursor movement
            const updateCursor = () => {
                cursorX += (mouseX - cursorX) * 0.1;
                cursorY += (mouseY - cursorY) * 0.1;
                cursor.style.left = cursorX + 'px';
                cursor.style.top = cursorY + 'px';
                requestAnimationFrame(updateCursor);
            };
            updateCursor();

            // Scale cursor on hover
            document.querySelectorAll('a, button, .portfolio-card').forEach(element => {
                element.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                });
                element.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                });
            });
        }
    }

    setupTextRevealAnimations() {
        // Text reveal animation for headings
        const revealText = (element) => {
            const text = element.textContent;
            element.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(50px);
                    animation: fadeInUp 0.6s ease forwards;
                    animation-delay: ${index * 0.05}s;
                `;
                element.appendChild(span);
            });
        };

        // Apply to section titles when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.revealed) {
                    revealText(entry.target);
                    entry.target.dataset.revealed = 'true';
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.section-title').forEach(title => {
            observer.observe(title);
        });
    }

    setupLoadingAnimations() {
        // Page loading animation
        window.addEventListener('load', () => {
            // Hide loading screen if it exists
            const loader = document.querySelector('.page-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }

            // Trigger entrance animations
            this.triggerEntranceAnimations();
        });
    }

    triggerEntranceAnimations() {
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-text > *');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Animate profile card
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            profileCard.style.opacity = '0';
            profileCard.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                profileCard.style.transition = 'all 0.8s ease-out';
                profileCard.style.opacity = '1';
                profileCard.style.transform = 'translateX(0)';
            }, 800);
        }
    }

    // Utility function to create staggered animations
    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    // Animate elements on scroll
    animateOnScroll(element, animationClass, threshold = 0.1) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animationClass);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold });

        observer.observe(element);
    }

    // Create particle effects
    createParticles(container, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-500);
                border-radius: 50%;
                opacity: 0.3;
                animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            container.appendChild(particle);
        }
    }

    // Magnetic effect for buttons
    setupMagneticEffect() {
        document.querySelectorAll('.btn-primary').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Text scramble effect
    scrambleText(element, finalText) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iterations = 0;
        
        const interval = setInterval(() => {
            element.textContent = finalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return finalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= finalText.length) {
                clearInterval(interval);
            }

            iterations += 1 / 3;
        }, 30);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    window.animationController = animationController;
});

// Additional animation utilities
const AnimationUtils = {
    // Smooth number counting animation
    countUp: (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    },

    // Fade in elements sequentially
    fadeInSequence: (elements, delay = 200) => {
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * delay);
        });
    },

    // Ripple effect
    createRipple: (button, event) => {
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        circle.style.cssText = `
            width: ${diameter}px;
            height: ${diameter}px;
            left: ${event.clientX - rect.left - radius}px;
            top: ${event.clientY - rect.top - radius}px;
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(circle);

        setTimeout(() => circle.remove(), 600);
    }
};

// CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            AnimationUtils.createRipple(this, e);
        });
    });
});

// Intersection Observer for scroll-triggered animations
const createScrollObserver = (className, animationClass, options = {}) => {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                if (options.once !== false) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll(className).forEach(element => {
        observer.observe(element);
    });
};

// Export for use in other scripts
window.AnimationUtils = AnimationUtils;
window.createScrollObserver = createScrollObserver;