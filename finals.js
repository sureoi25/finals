// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple form submission handling
    const contactForm = document.querySelector('.contact_form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Display success message
            const formSubmitBtn = document.querySelector('.form_submit');
            const originalText = formSubmitBtn.textContent;
            
            formSubmitBtn.textContent = 'Message Sent!';
            formSubmitBtn.disabled = true;
            
            // Clear form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                formSubmitBtn.textContent = originalText;
                formSubmitBtn.disabled = false;
            }, 3000);
        });
    }

    // Add active class to current navigation section
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.main-nav a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Background carousel functionality
    const backgroundCarousel = document.querySelector('.background-carousel');
    if (backgroundCarousel) {
        const slides = backgroundCarousel.querySelectorAll('.carousel-slide');
        const dotsContainer = backgroundCarousel.querySelector('.carousel-dots');
        let currentSlide = 0;
        
        // Create dots for background carousel
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function moveToSlide(index) {
            // Fade out current slide
            slides[currentSlide].style.opacity = '0';
            dots[currentSlide].classList.remove('active');
            
            // Update current slide index
            currentSlide = index;
            
            // Fade in new slide
            slides[currentSlide].style.opacity = '1';
            dots[currentSlide].classList.add('active');
            
            // Update gradient colors based on current slide
            updateGradientColors();
        }
        
        function updateGradientColors() {
            // Define gradient colors for each slide
            const gradientColors = [
                { start: 'rgba(100, 184, 177, 0.7)', end: 'rgba(34, 190, 217, 0.7)' },
                { start: 'rgba(34, 190, 217, 0.7)', end: 'rgba(233, 213, 156, 0.7)' },
                { start: 'rgba(233, 213, 156, 0.7)', end: 'rgba(100, 184, 177, 0.7)' },
                { start: 'rgba(100, 184, 177, 0.7)', end: 'rgba(34, 190, 217, 0.7)' }
            ];
            
            // Apply the gradient for the current slide
            const intro = document.querySelector('.intro');
            if (intro) {
                intro.style.setProperty('--gradient-start', gradientColors[currentSlide].start);
                intro.style.setProperty('--gradient-end', gradientColors[currentSlide].end);
            }
        }

        // Auto advance slides
        setInterval(() => {
            const nextSlide = (currentSlide + 1) % slides.length;
            moveToSlide(nextSlide);
        }, 5000);

        // Add click events to navigation buttons
        const prevButton = backgroundCarousel.querySelector('.carousel-prev');
        const nextButton = backgroundCarousel.querySelector('.carousel-next');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
                moveToSlide(prevSlide);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const nextSlide = (currentSlide + 1) % slides.length;
                moveToSlide(nextSlide);
            });
        }
        
        // Initialize gradient colors
        updateGradientColors();
    }

    // Regular carousels functionality
    const carousels = document.querySelectorAll('.carousel, .activities-carousel');
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let currentSlide = 0;
        
        // Create dots for carousel
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.dot');

        function moveToSlide(index) {
            carousel.querySelector('.carousel-container').style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentSlide = index;
        }

        // Add click events to navigation buttons
        const prevButton = carousel.querySelector('.carousel-button.prev');
        const nextButton = carousel.querySelector('.carousel-button.next');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
                moveToSlide(prevSlide);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const nextSlide = (currentSlide + 1) % slides.length;
                moveToSlide(nextSlide);
            });
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle button');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-sun');
                icon.classList.toggle('fa-moon');
            }
        });
    }

    // Dark mode functionality
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });

    // Mobile menu functionality
    const mainNav = document.querySelector('.main-nav');
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && mainNav.classList.contains('mobile-menu-open')) {
            mainNav.classList.remove('mobile-menu-open');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('mobile-menu-open');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Update theme icon
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}