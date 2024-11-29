// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Set Active Navigation Link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        // Remove any existing active classes
        link.classList.remove('active');
        
        // Get the href value
        const href = link.getAttribute('href');
        
        // Check if this is the current page
        if (currentPath.endsWith(href) || 
            (currentPath.endsWith('/') && href === './') ||
            (currentPath.endsWith('index.html') && href === './')) {
            link.classList.add('active');
        }
    });
}

// Initialize active nav link when DOM is loaded
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Security measures
const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Weather API Configuration
const WEATHER_API_KEY = 'cd32c94e7a85382c9574351b15df5c17'; // Replace with your OpenWeatherMap API key
const BULAWAYO_COORDS = {
    lat: -20.1325,
    lon: 28.6083
};

// Fetch Weather Data
async function fetchWeather() {
    const weatherWidget = document.querySelector('.weather-widget');
    const temperatureElement = document.querySelector('#temperature');
    const iconElement = weatherWidget?.querySelector('i');
    
    if (!weatherWidget || !temperatureElement || !iconElement) return;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${BULAWAYO_COORDS.lat}&lon=${BULAWAYO_COORDS.lon}&units=metric&appid=${WEATHER_API_KEY}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.main || !data.weather || !data.weather[0]) {
            throw new Error('Invalid weather data received');
        }
        
        const temperature = Math.round(data.main.temp);
        const weatherIcon = getWeatherIcon(data.weather[0].icon);
        
        iconElement.className = weatherIcon;
        temperatureElement.textContent = `${temperature}°C`;
        weatherWidget.style.display = 'flex';
    } catch (error) {
        console.error('Error fetching weather:', error);
        temperatureElement.textContent = 'N/A';
        iconElement.className = 'fas fa-exclamation-circle';
        weatherWidget.style.display = 'flex';
    }
}

// Get appropriate Font Awesome icon based on weather code
function getWeatherIcon(code) {
    const icons = {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-showers-heavy',
        '09n': 'fas fa-cloud-showers-heavy',
        '10d': 'fas fa-cloud-sun-rain',
        '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog'
    };
    
    return icons[code] || 'fas fa-sun';
}

// Initialize weather widget
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    // Update weather every 30 minutes
    setInterval(fetchWeather, 30 * 60 * 1000);
});

// Contact Form Security
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Input validation and sanitization
            const formData = new FormData(contactForm);
            const sanitizedData = {};
            
            for (let [key, value] of formData.entries()) {
                // Basic XSS prevention
                value = String(value)
                    .replace(/[<>]/g, '') // Remove < and >
                    .trim();
                    
                // Validate email
                if (key === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        alert('Please enter a valid email address');
                        return;
                    }
                }
                
                // Validate required fields
                if (!value) {
                    alert(`Please fill in all required fields`);
                    return;
                }
                
                sanitizedData[key] = value;
            }
            
            console.log('Form submitted with sanitized data:', sanitizedData);
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Back to Top Button
function initBackToTop() {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    // Show button when page is scrolled
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });

    // Scroll to top when clicked
    button.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top when DOM is loaded
document.addEventListener('DOMContentLoaded', initBackToTop);

// Navbar Active State
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Get the href and extract the page name
        const href = link.getAttribute('href');
        
        // Check if this link corresponds to current page
        if ((currentPage === 'index.html' && href === './') || 
            (currentPage === href) || 
            (`./${currentPage}` === href)) {
            link.classList.add('active');
        }
    });
}

// Initialize active state when DOM is loaded
document.addEventListener('DOMContentLoaded', setActiveNavItem);

// Navbar Active State
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 60) {
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
