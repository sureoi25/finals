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

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle button');
    const body = document.body;

    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-sun');
                icon.classList.toggle('fa-moon');
            }
            
            // Save theme preference
            localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    // Search functionality
    const searchInput = document.getElementById('destination-search');
    const searchButton = document.querySelector('.search-button');
    const destinationSlides = document.querySelectorAll('.carousel-slide');
    const destinationsSection = document.getElementById('destinations');
    const destinationsCarousel = document.querySelector('#destinations .carousel');
    const destinationsContainer = document.querySelector('#destinations .carousel-container');

    function searchDestinations() {
        const searchTerm = searchInput.value.toLowerCase();
        let found = false;
        let matchingSlideIndex = -1;

        // First check if we need to scroll to the destinations section
        if (searchTerm.length > 0) {
            // Scroll to destinations section
            destinationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Find matching slides and highlight them
        destinationSlides.forEach((slide, index) => {
            const title = slide.querySelector('h3').textContent.toLowerCase();
            const description = slide.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                slide.style.display = 'block';
                found = true;
                
                // If this is the first match, store its index
                if (matchingSlideIndex === -1) {
                    matchingSlideIndex = index;
                }
            } else {
                slide.style.display = 'none';
            }
        });

        // If we found a match, move the carousel to that slide
        if (matchingSlideIndex !== -1 && destinationsContainer) {
            // Move to the matching slide
            destinationsContainer.style.transform = `translateX(-${matchingSlideIndex * 100}%)`;
            
            // Update the dots
            const dots = document.querySelectorAll('#destinations .dot');
            dots.forEach((dot, index) => {
                if (index === matchingSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Show/hide no results message
        const noResults = document.querySelector('.no-results') || document.createElement('div');
        if (!found && searchTerm !== '') {
            noResults.className = 'no-results';
            noResults.textContent = 'No destinations found matching your search.';
            destinationsCarousel.appendChild(noResults);
        } else {
            const existingNoResults = document.querySelector('.no-results');
            if (existingNoResults) {
                existingNoResults.remove();
            }
        }
    }

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', searchDestinations);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchDestinations();
            }
        });
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
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Add click event to mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            // Special handling for Home link
            if (link.textContent.trim().toLowerCase() === 'home') {
                const introSection = document.querySelector('.intro');
                if (introSection) {
                    // Check if we're not already at the top of the page
                    if (window.scrollY > 100) {
                        // Smooth scroll to intro section
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
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