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

// Reveal Animations on Scroll (Supports Reveal Up, Left, and Right)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right').forEach(el => {
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

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Hamburger Animation (Optional: turn into X)
        hamburger.classList.toggle('toggle');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// ==========================================
// FAQ ACCORDION INTERACTIVITY
// ==========================================
const initFaqAccordion = () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            
            // Toggle faq-open class on current item
            item.classList.toggle('faq-open');
            
            // Optional: Close other FAQs (Accordion effect)
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('faq-open')) {
                    otherItem.classList.remove('faq-open');
                }
            });
        });
    });
};

// Initialize new functionalities
document.addEventListener('DOMContentLoaded', () => {
    initFaqAccordion();
    initDocViewer();
    initCertTabs();
});

// ==========================================
// PROTECTED DOCUMENT VIEWER & CERT TABS
// ==========================================
let currentDocPages = [];
let currentDocIndex = 0;
let currentZoom = 1;
let isPanning = false;
let startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0;

const initDocViewer = () => {
    const modal = document.getElementById('docModal');
    if (!modal) return;

    const modalTitle = document.getElementById('docModalTitle');
    const modalImg = document.getElementById('docModalImg');
    const pageCounter = document.getElementById('docPageCounter');
    const prevBtn = document.getElementById('docPrevBtn');
    const nextBtn = document.getElementById('docNextBtn');
    const zoomInBtn = document.getElementById('docZoomIn');
    const zoomOutBtn = document.getElementById('docZoomOut');
    const zoomResetBtn = document.getElementById('docZoomReset');
    const closeBtn = document.getElementById('docCloseBtn');
    const modalBody = modal.querySelector('.doc-modal-body');
    const canvasWrapper = modal.querySelector('.doc-viewer-canvas-wrapper');

    const updateDocView = () => {
        if (!currentDocPages.length) return;
        modalImg.src = currentDocPages[currentDocIndex];
        currentZoom = 1;
        if (canvasWrapper) canvasWrapper.style.transform = `scale(${currentZoom})`;
        
        if (pageCounter) {
            pageCounter.textContent = `Page ${currentDocIndex + 1} of ${currentDocPages.length}`;
            pageCounter.style.display = currentDocPages.length > 1 ? 'inline-block' : 'none';
        }
        if (prevBtn) prevBtn.disabled = currentDocIndex === 0;
        if (nextBtn) nextBtn.disabled = currentDocIndex === currentDocPages.length - 1;
        if (prevBtn) prevBtn.style.display = currentDocPages.length > 1 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = currentDocPages.length > 1 ? 'flex' : 'none';
    };

    const openViewer = (title, pages) => {
        currentDocPages = pages;
        currentDocIndex = 0;
        if (modalTitle) modalTitle.textContent = title;
        updateDocView();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeViewer = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        currentDocPages = [];
        currentDocIndex = 0;
        currentZoom = 1;
    };

    document.querySelectorAll('.doc-view-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const card = trigger.closest('.doc-card') || trigger;
            const title = card.getAttribute('data-title') || 'Credential Document';
            try {
                const pages = JSON.parse(card.getAttribute('data-pages') || '[]');
                if (pages.length) openViewer(title, pages);
            } catch (err) {
                console.error('Failed to parse doc pages', err);
            }
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentDocIndex > 0) {
                currentDocIndex--;
                updateDocView();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentDocIndex < currentDocPages.length - 1) {
                currentDocIndex++;
                updateDocView();
            }
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (currentZoom < 2.5) {
                currentZoom += 0.25;
                if (canvasWrapper) canvasWrapper.style.transform = `scale(${currentZoom})`;
            }
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (currentZoom > 0.75) {
                currentZoom -= 0.25;
                if (canvasWrapper) canvasWrapper.style.transform = `scale(${currentZoom})`;
            }
        });
    }

    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => {
            currentZoom = 1;
            if (canvasWrapper) canvasWrapper.style.transform = `scale(1)`;
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeViewer);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === modalBody) {
            closeViewer();
        }
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowLeft' && currentDocIndex > 0) {
            currentDocIndex--;
            updateDocView();
        }
        if (e.key === 'ArrowRight' && currentDocIndex < currentDocPages.length - 1) {
            currentDocIndex++;
            updateDocView();
        }
        // Intercept save and print shortcuts
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
            e.preventDefault();
            return false;
        }
    });

    // Disable right click inside modal to prevent saving
    modal.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Panning inside modal
    if (modalBody) {
        modalBody.addEventListener('mousedown', (e) => {
            if (currentZoom <= 1) return;
            isPanning = true;
            startX = e.pageX - modalBody.offsetLeft;
            startY = e.pageY - modalBody.offsetTop;
            scrollLeft = modalBody.scrollLeft;
            scrollTop = modalBody.scrollTop;
        });

        modalBody.addEventListener('mouseleave', () => isPanning = false);
        modalBody.addEventListener('mouseup', () => isPanning = false);

        modalBody.addEventListener('mousemove', (e) => {
            if (!isPanning) return;
            e.preventDefault();
            const x = e.pageX - modalBody.offsetLeft;
            const y = e.pageY - modalBody.offsetTop;
            const walkX = (x - startX) * 1.5;
            const walkY = (y - startY) * 1.5;
            modalBody.scrollLeft = scrollLeft - walkX;
            modalBody.scrollTop = scrollTop - walkY;
        });
    }
};

const initCertTabs = () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.doc-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
};