document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('#site-nav');
    
    // Mobile menu toggle functionality
    menuToggle && menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        siteNav && siteNav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (siteNav && menuToggle && !siteNav.contains(e.target) && !menuToggle.contains(e.target)) {
                siteNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('#site-nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                siteNav && siteNav.classList.remove('active');
                menuToggle && menuToggle.classList.remove('active');
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const scrollY = window.pageYOffset;
        
        if (header) {
            if (scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // Reveal animation on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function reveal() {
        revealElements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial reveal check
    reveal();
    
    // Reveal on scroll
    window.addEventListener('scroll', reveal);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            siteNav && siteNav.classList.remove('active');
            menuToggle && menuToggle.classList.remove('active');
        }
    });
    
    // Text rotator for hero section
    const rotatorElement = document.getElementById('rotator');
    const phrases = [
        'Streamline Operations',
        'Real-time Tracking',
        'Smart Analytics',
        'Seamless Delivery'
    ];
    
    let phraseIndex = 0;
    
    function rotateText() {
        if (rotatorElement) {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            rotatorElement.style.opacity = '0';
            
            setTimeout(() => {
                rotatorElement.textContent = phrases[phraseIndex];
                rotatorElement.style.opacity = '1';
            }, 500);
        }
    }
    
    // Initialize rotator
    if (rotatorElement) {
        rotatorElement.textContent = phrases[0];
        setInterval(rotateText, 3000);
    }
    
    // Team slider functionality
    const teamContainer = document.querySelector('.team-container');
    const teamCards = document.querySelectorAll('.team-card');
    const teamDots = document.querySelectorAll('.team-dot');
    const teamPrev = document.querySelector('.team-prev');
    const teamNext = document.querySelector('.team-next');
    
    let currentSlide = 0;
    const cardsPerSlide = 3;
    const cardWidth = 340; // 320px card + 20px gap
    const totalSlides = Math.ceil(teamCards.length / cardsPerSlide);
    
    function showSlide(index) {
        currentSlide = index;
        
        // Update container transform
        if (teamContainer) {
            const offset = -index * (cardsPerSlide * cardWidth);
            teamContainer.style.transform = `translateX(${offset}px)`;
            teamContainer.style.transition = 'transform 0.5s ease';
        }
        
        // Update dots
        teamDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Previous slide
    teamPrev && teamPrev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    });
    
    // Next slide
    teamNext && teamNext.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    });
    
    // Dot navigation
    teamDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    
    contactForm && contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            from_name: formData.get('from_name'),
            reply_to: formData.get('reply_to'),
            message: formData.get('message')
        };
        
        // Send email using EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.send('service_id', 'template_id', data)
                .then(function(response) {
                    showNotification('Message sent successfully! We\'ll get back to you soon.');
                    contactForm.reset();
                })
                .catch(function(error) {
                    showNotification('Failed to send message. Please try again.');
                    console.error('EmailJS error:', error);
                });
        } else {
            // Fallback: log to console
            console.log('Form submitted:', data);
            showNotification('Message received! We\'ll get back to you soon.');
            contactForm.reset();
        }
    });
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    themeToggle && themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        this.textContent = isDark ? '◐' : '◑';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '◑';
    }
});

// Notification function
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add notification styles
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #106e44 0%, #0d5f3a 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(16, 110, 68, 0.25);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}
