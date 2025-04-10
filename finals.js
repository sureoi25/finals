document.addEventListener('DOMContentLoaded', function() {
    //smooth scrolling sa tanan
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

    //form validation and form submission
    const contactForm = document.querySelector('#palawan-contact-form');
    if (contactForm) {
        // Add validation classes to form fields
        const formFields = contactForm.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            //validate on blur
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            //validate on input
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        //validate for individual fields
        function validateField(field) {
            const fieldId = field.id;
            const fieldValue = field.value.trim();
            let isValid = true;
            let errorMessage = '';
            
            //remove existing error message
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            //validate based on field type 
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
            
            //apply validation styling
            if (!isValid) {
                field.classList.add('error');
                
                //add error message
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errorMessage;
                field.parentNode.appendChild(errorElement);
            } else {
                field.classList.remove('error');
            }
            
            return isValid;
        }
        
        //add the function to contact form 
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            //validate all the fields
            let isFormValid = true;
            formFields.forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                return;
            }
            
            //get the values of each 
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            //get status element
            const formStatus = document.getElementById('form-status');
            const formSubmitBtn = document.querySelector('.form_submit');
            const originalText = formSubmitBtn.textContent;
            
            //update the button state 
            formSubmitBtn.textContent = 'Sending...';
            formSubmitBtn.disabled = true;
            
            //ang values e himog form data para e butang sa g sheets
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject);
            formData.append('message', message);
            
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxLB04hthAWTNdTTpi3U-Y82FFasUd2GB2L9qHy8BRlje0O_lw1Ocgu9ANWm_n9umbR-Q/exec';
            
            //send data to g sheets using fetch api
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
                //e reset ang button after 3 seconds
                setTimeout(() => {
                    formSubmitBtn.textContent = originalText;
                    formSubmitBtn.disabled = false;
                    
                    //e clear ang status message after 5 seconds
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

    //dark,light mode toggle
    const themeToggle = document.querySelector('.theme_toggle button');
    const body = document.body;

    if (themeToggle) {
        //check if unsa nga theme gigamit daan
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
            //set ang theme gigamit last
            localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    //carousel 
    const carousels = document.querySelectorAll('.carousel, .activities_carousel');
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel_slide');
        const dotsContainer = carousel.querySelector('.carousel_dots');
        let currentSlide = 0;
        
        //dots for carousel
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.dot');

        function moveToSlide(index) {
            carousel.querySelector('.carousel_container').style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentSlide = index;
        }

        //event listener sa prev and next button sa mga carousel
        const prevButton = carousel.querySelector('.carousel_button.prev');
        const nextButton = carousel.querySelector('.carousel_button.next');

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

    //mobile navbar 
    const mobileMenuToggle = document.querySelector('.mobile_menu_toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav_links a');

    //click event to mobile menu
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    //if gi abli ang mobile menu, niya ni clickon any of the nav links, close the menu
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            //handle home link
            if (link.textContent.trim().toLowerCase() === 'home') {
                const introSection = document.querySelector('.intro');
                if (introSection) {
                    //check if wala sa home page daan
                    if (window.scrollY > 100) {
                        //smooth scroll to intro
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    //if mu click outside sa menu close the mobile menu
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    //get search, ang input sa search bar and ang button imsmo
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) return;

        const infoCards = document.querySelectorAll('.i_card');
        let found = false;

        infoCards.forEach(card => {
            const cardTitle = card.querySelector('.card-header h3').textContent.toLowerCase();
            const cardLocation = card.querySelector('.location').textContent.toLowerCase();
            const cardDescription = card.querySelector('.description').textContent.toLowerCase();

            if (cardTitle.includes(searchTerm) || 
                cardLocation.includes(searchTerm) || 
                cardDescription.includes(searchTerm)) {
                found = true;
                //e rmeove ang highlight from all cards
                infoCards.forEach(c => {
                    c.classList.remove('highlight');
                    c.style.transform = 'none';
                });
                
                //e highlight ang card nga mu match sa search
                card.classList.add('highlight');
                
                //scroll to card nga mu match
                const destinationSection = document.getElementById('destination-info');
                const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
                const offset = 100;
                
                window.scrollTo({
                    top: cardTop - offset,
                    behavior: 'smooth'
                });

                //scale up ang card nga gi highlight for 1.5seconds
                card.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    card.style.transform = 'none';
                }, 1500);
            }
        });

        if (!found) {
            //if walay mu match show no match
            alert('No matching destinations found.');
        }
    }

    //search ig click sa search button
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    //search ig mu pislit enter
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // if e click ang top destinations mu adto sa corresponding info card
    const destinationHighlights = document.querySelectorAll('.destination_highlight');
    
    destinationHighlights.forEach(highlight => {
        highlight.addEventListener('click', function() {
            const destination = this.getAttribute('data-destination');
            const infoCard = document.querySelector(`.i_card[data-destination="${destination}"]`);
            
            if (infoCard) {
                //remove ang highlight from all info cards
                document.querySelectorAll('.i_card').forEach(card => {
                    card.classList.remove('highlight');
                });
                
                //add highlight to card
                infoCard.classList.add('highlight');
                
                //scroll to the info card
                const destinationSection = document.getElementById('destination-info');
                const cardTop = infoCard.getBoundingClientRect().top + window.pageYOffset;
                const offset = 100;
                
                window.scrollTo({
                    top: cardTop - offset,
                    behavior: 'smooth'
                });
                
                //scale up ang highlighted for 1.5 seconds
                infoCard.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    infoCard.style.transform = 'none';
                }, 1500);
            }
        });
    });
});
