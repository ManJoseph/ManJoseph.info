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
    const modalBody = modal.querySelector('.doc-modal-body');
    const canvasWrapper = modal.querySelector('.doc-viewer-canvas-wrapper');
    const closeBtn = document.getElementById('docCloseBtn');

    // Desktop controls
    const pageCounter = document.getElementById('docPageCounter');
    const prevBtn = document.getElementById('docPrevBtn');
    const nextBtn = document.getElementById('docNextBtn');
    const zoomInBtn = document.getElementById('docZoomIn');
    const zoomOutBtn = document.getElementById('docZoomOut');
    const zoomResetBtn = document.getElementById('docZoomReset');

    // Mobile secondary bar controls
    const mobilePageCounter = document.getElementById('docMobilePageCounter');
    const mobilePrevBtn = document.getElementById('docMobilePrevBtn');
    const mobileNextBtn = document.getElementById('docMobileNextBtn');
    const mobileZoomIn = document.getElementById('docMobileZoomIn');
    const mobileZoomOut = document.getElementById('docMobileZoomOut');
    const mobileZoomReset = document.getElementById('docMobileZoomReset');

    const applyZoom = () => {
        if (!canvasWrapper) return;
        const isMobile = window.innerWidth <= 768;
        const pct = Math.round(currentZoom * 100);

        if (currentZoom === 1) {
            canvasWrapper.style.width = '100%';
            canvasWrapper.style.minWidth = 'auto';
            canvasWrapper.style.maxWidth = isMobile ? '100%' : '850px';
        } else {
            if (isMobile) {
                // On mobile: expand past screen width using percentage so scroll triggers naturally
                canvasWrapper.style.maxWidth = 'none';
                canvasWrapper.style.width = `${pct}%`;
                canvasWrapper.style.minWidth = `${pct}%`;
            } else {
                // On desktop: calculate based on 850px standard width
                const pxWidth = Math.round(850 * currentZoom);
                canvasWrapper.style.maxWidth = 'none';
                canvasWrapper.style.width = `${pxWidth}px`;
                canvasWrapper.style.minWidth = `${pxWidth}px`;
            }
        }
        const text = currentZoom === 1 ? 'Fit' : `${pct}%`;
        if (zoomResetBtn) zoomResetBtn.textContent = text;
        if (mobileZoomReset) mobileZoomReset.textContent = text;
    };

    const updateDocView = () => {
        if (!currentDocPages.length) return;
        modalImg.src = currentDocPages[currentDocIndex];
        
        // Reset scroll position to top of document on every page switch
        if (modalBody) {
            modalBody.scrollTop = 0;
            modalBody.scrollLeft = 0;
        }

        const isMulti = currentDocPages.length > 1;
        const pageText = `Page ${currentDocIndex + 1} of ${currentDocPages.length}`;
        
        // Desktop sync
        if (pageCounter) {
            pageCounter.textContent = pageText;
            pageCounter.style.display = isMulti ? 'inline-block' : 'none';
        }
        if (prevBtn) {
            prevBtn.disabled = currentDocIndex === 0;
            prevBtn.style.display = isMulti ? 'inline-flex' : 'none';
        }
        if (nextBtn) {
            nextBtn.disabled = currentDocIndex === currentDocPages.length - 1;
            nextBtn.style.display = isMulti ? 'inline-flex' : 'none';
        }

        // Mobile sync
        if (mobilePageCounter) {
            mobilePageCounter.textContent = pageText;
        }
        if (mobilePrevBtn) {
            mobilePrevBtn.disabled = currentDocIndex === 0;
        }
        if (mobileNextBtn) {
            mobileNextBtn.disabled = currentDocIndex === currentDocPages.length - 1;
        }
        const mobilePagesContainer = modal.querySelector('.doc-mobile-pages');
        if (mobilePagesContainer) {
            mobilePagesContainer.style.visibility = isMulti ? 'visible' : 'hidden';
        }
    };

    const openViewer = (title, pages) => {
        currentDocPages = pages;
        currentDocIndex = 0;
        currentZoom = 1;
        if (modalTitle) modalTitle.textContent = title;
        applyZoom();
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
        applyZoom();
    };

    // Card click triggers
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

    // Paging Handlers
    const handlePrev = () => {
        if (currentDocIndex > 0) {
            currentDocIndex--;
            updateDocView();
        }
    };

    const handleNext = () => {
        if (currentDocIndex < currentDocPages.length - 1) {
            currentDocIndex++;
            updateDocView();
        }
    };

    // Zoom Handlers
    const handleZoomIn = () => {
        if (currentZoom < 2.5) {
            currentZoom = Math.min(2.5, +(currentZoom + 0.25).toFixed(2));
            applyZoom();
        }
    };

    const handleZoomOut = () => {
        if (currentZoom > 0.5) {
            currentZoom = Math.max(0.5, +(currentZoom - 0.25).toFixed(2));
            applyZoom();
        }
    };

    const handleZoomReset = () => {
        currentZoom = 1;
        applyZoom();
        if (modalBody) {
            modalBody.scrollTop = 0;
            modalBody.scrollLeft = 0;
        }
    };

    // Robust touch & click binder
    const bindBtn = (btn, handler) => {
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handler();
        });
    };

    bindBtn(prevBtn, handlePrev);
    bindBtn(nextBtn, handleNext);
    bindBtn(mobilePrevBtn, handlePrev);
    bindBtn(mobileNextBtn, handleNext);

    bindBtn(zoomInBtn, handleZoomIn);
    bindBtn(zoomOutBtn, handleZoomOut);
    bindBtn(zoomResetBtn, handleZoomReset);
    bindBtn(mobileZoomIn, handleZoomIn);
    bindBtn(mobileZoomOut, handleZoomOut);
    bindBtn(mobileZoomReset, handleZoomReset);

    if (closeBtn) closeBtn.addEventListener('click', closeViewer);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === modalBody) {
            closeViewer();
        }
    });

    // Mobile touch swipe for multi-page documents
    let touchStartX = 0;
    let touchStartY = 0;
    if (modalBody) {
        modalBody.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        modalBody.addEventListener('touchend', (e) => {
            if (currentZoom > 1.1) return; // Allow panning when zoomed
            if (e.changedTouches.length === 1) {
                const diffX = e.changedTouches[0].clientX - touchStartX;
                const diffY = e.changedTouches[0].clientY - touchStartY;
                if (Math.abs(diffX) > 60 && Math.abs(diffY) < 50) {
                    if (diffX < 0) {
                        handleNext();
                    } else {
                        handlePrev();
                    }
                }
            }
        }, { passive: true });

        // Desktop mouse drag to pan when zoomed
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
            modalBody.scrollLeft = scrollLeft - (x - startX) * 1.5;
            modalBody.scrollTop = scrollTop - (y - startY) * 1.5;
        });
    }

    // Keyboard controls & shortcut security
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
            e.preventDefault();
            return false;
        }
    });

    modal.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
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