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

    // Enhanced form validation and submission handling
    const contactForm = document.querySelector('#palawan-contact-form');
    if (contactForm) {
        // Add validation classes to form fields
        const formFields = contactForm.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            // Add validation on blur
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Add validation on input
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Validation function for individual fields
        function validateField(field) {
            const fieldId = field.id;
            const fieldValue = field.value.trim();
            let isValid = true;
            let errorMessage = '';
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Validate based on field type
            switch(fieldId) {
                case 'name':
                    if (fieldValue === '') {
                        isValid = false;
                        errorMessage = 'Name is required';
                    } else if (fieldValue.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters';
                    }
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (fieldValue === '') {
                        isValid = false;
                        errorMessage = 'Email is required';
                    } else if (!emailRegex.test(fieldValue)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                    
                case 'subject':
                    if (fieldValue === '') {
                        isValid = false;
                        errorMessage = 'Subject is required';
                    } else if (fieldValue.length < 3) {
                        isValid = false;
                        errorMessage = 'Subject must be at least 3 characters';
                    }
                    break;
                    
                case 'message':
                    if (fieldValue === '') {
                        isValid = false;
                        errorMessage = 'Message is required';
                    } else if (fieldValue.length < 10) {
                        isValid = false;
                        errorMessage = 'Message must be at least 10 characters';
                    }
                    break;
            }
            
            // Apply validation styling
            if (!isValid) {
                field.classList.add('error');
                
                // Add error message
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errorMessage;
                field.parentNode.appendChild(errorElement);
            } else {
                field.classList.remove('error');
            }
            
            return isValid;
        }
        
        // Form submission handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isFormValid = true;
            formFields.forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                return;
            }
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Get status element
            const formStatus = document.getElementById('form-status');
            const formSubmitBtn = document.querySelector('.form_submit');
            const originalText = formSubmitBtn.textContent;
            
            // Update button state
            formSubmitBtn.textContent = 'Sending...';
            formSubmitBtn.disabled = true;
            
            // Prepare form data
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject);
            formData.append('message', message);
            
            // Replace with your deployed Google Apps Script web app URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxLB04hthAWTNdTTpi3U-Y82FFasUd2GB2L9qHy8BRlje0O_lw1Ocgu9ANWm_n9umbR-Q/exec';
            
            // Send data to Google Sheet via fetch API
            fetch(scriptURL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' 
            })
            .then(response => {
                
                formStatus.innerHTML = '<div class="success-message">Message sent successfully!</div>';
                formSubmitBtn.textContent = 'Message Sent!';

                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.innerHTML = '<div class="error-message">Network error. Please try again later.</div>';
                formSubmitBtn.textContent = originalText;
            })
            .finally(() => {
                // Reset button after 3 seconds
                setTimeout(() => {
                    formSubmitBtn.textContent = originalText;
                    formSubmitBtn.disabled = false;
                    
                    // Clear status message after 5 seconds
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                    }, 5000);
                }, 3000);
            });
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

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) return;

        const infoCards = document.querySelectorAll('.info-card');
        let found = false;

        infoCards.forEach(card => {
            const cardTitle = card.querySelector('.card-header h3').textContent.toLowerCase();
            const cardLocation = card.querySelector('.location').textContent.toLowerCase();
            const cardDescription = card.querySelector('.description').textContent.toLowerCase();

            if (cardTitle.includes(searchTerm) || 
                cardLocation.includes(searchTerm) || 
                cardDescription.includes(searchTerm)) {
                found = true;
                // Remove highlight from all cards
                infoCards.forEach(c => {
                    c.classList.remove('highlight');
                    c.style.transform = 'none';
                });
                
                // Add highlight to matching card
                card.classList.add('highlight');
                
                // Scroll to the card
                const destinationSection = document.getElementById('destination-info');
                const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
                const offset = 100; // Adjust this value based on your navbar height
                
                window.scrollTo({
                    top: cardTop - offset,
                    behavior: 'smooth'
                });

                // Briefly scale up the card to draw attention
                card.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    card.style.transform = 'none';
                }, 1500);
            }
        });

        if (!found) {
            // Optionally show a message that no results were found
            alert('No matching destinations found.');
        }
    }

    // Search on button click
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    // Search on Enter key press
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Destination highlight click functionality
    const destinationHighlights = document.querySelectorAll('.destination_highlight');
    
    destinationHighlights.forEach(highlight => {
        highlight.addEventListener('click', function() {
            const destination = this.getAttribute('data-destination');
            const infoCard = document.querySelector(`.info-card[data-destination="${destination}"]`);
            
            if (infoCard) {
                // Remove highlight from all cards
                document.querySelectorAll('.info-card').forEach(card => {
                    card.classList.remove('highlight');
                });
                
                // Add highlight to the target card
                infoCard.classList.add('highlight');
                
                // Scroll to the destination info section
                const destinationSection = document.getElementById('destination-info');
                const cardTop = infoCard.getBoundingClientRect().top + window.pageYOffset;
                const offset = 100; // Adjust this value based on your navbar height
                
                window.scrollTo({
                    top: cardTop - offset,
                    behavior: 'smooth'
                });
                
                // Briefly scale up the card to draw attention
                infoCard.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    infoCard.style.transform = 'none';
                }, 1500);
            }
        });
    });
});