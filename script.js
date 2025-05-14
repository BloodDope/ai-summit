document.addEventListener('DOMContentLoaded', () => {
    // Loading animation
    const loading = document.createElement('div');
    loading.className = 'loading';
    document.body.appendChild(loading);

    // Remove loading animation after 1.5 seconds
    setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 500);
    }, 1500);

    // Add floating effect to main elements
    document.querySelectorAll('.bg-gray-900').forEach(card => {
        card.classList.add('glow-card');
    });

    // Add neon glow to important text
    document.querySelectorAll('h2, h3').forEach(heading => {
        heading.classList.add('neon-glow');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add hover-scale class to cards
    document.querySelectorAll('.bg-gray-900').forEach(card => {
        card.classList.add('hover-scale');
    });

    // Text reveal animation
    const revealElements = document.querySelectorAll('p, h2, h3');
    revealElements.forEach(el => {
        el.classList.add('reveal-text');
    });

    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.add('opacity-100');
                entry.target.classList.remove('opacity-0');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections and reveal elements
    document.querySelectorAll('section, .reveal-text').forEach(section => {
        section.classList.add('opacity-0', 'transition-opacity', 'duration-1000');
        observer.observe(section);
    });

    // Form submission handling
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            const button = form.querySelector('button');
            const originalButtonText = button.textContent;
            
            // Validate inputs
            if (!email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Disable form and show loading state
            button.disabled = true;
            button.innerHTML = '<span class="loading-spinner"></span> Sending...';
            button.classList.add('animate-pulse');
            
            try {
                const response = await fetch('send_message.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, message })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    form.reset();
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            } catch (error) {
                showNotification(error.message || 'An error occurred. Please try again later.', 'error');
            } finally {
                // Reset button state
                button.disabled = false;
                button.textContent = originalButtonText;
                button.classList.remove('animate-pulse');
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} opacity-0 transform translate-y-2`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.remove('opacity-0', 'translate-y-2');
            notification.classList.add('opacity-100', 'translate-y-0');
        }, 10);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Navigation scroll behavior
    const nav = document.getElementById('mainNav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // Handle navigation background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
        
        // Update active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.toggle('show');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('show');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (mobileMenu) {
                mobileMenu.classList.remove('show');
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mouse move effect for feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Handle hover effects for gradient text
    document.querySelectorAll('.gradient-text-static').forEach(el => {
        const text = el.textContent;
        el.setAttribute('data-text', text);
    });
}); 