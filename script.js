// DOM Elements
const navbar = document.querySelector('.navbar');
const progressItems = document.querySelectorAll('.progress-item');
const sections = document.querySelectorAll('section');

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Reveal Animations on Scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// Page Progress Indicator Logic
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Get the index of the current section relative to all sections
            const index = Array.from(sections).indexOf(entry.target);
            
            // Remove active class from all progress items
            progressItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to corresponding progress item (if it exists)
            if (progressItems[index]) {
                progressItems[index].classList.add('active');
            }
        }
    });
}, {
    threshold: 0.5 // Trigger when 50% of the section is visible
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Click to Scroll Logic for Timeline
progressItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (sections[index]) {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        }
    });
    // Add pointer cursor style directly or via CSS
    item.style.cursor = 'pointer';
});