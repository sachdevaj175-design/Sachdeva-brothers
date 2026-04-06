// ============================================
// DOM ELEMENTS
// ============================================
const mainNav = document.getElementById('mainNav');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const whatsappBtn = document.getElementById('whatsappBtn');
const whatsappModal = document.getElementById('whatsappModal');
const waClose = document.getElementById('waClose');
const waBackdrop = document.getElementById('waBackdrop');
const waForm = document.getElementById('waForm');
const backToTop = document.getElementById('backToTop');
const playBtn = document.getElementById('playBtn');
const videoModal = document.getElementById('videoModal');
const videoClose = document.getElementById('videoClose');
const videoBackdrop = document.getElementById('videoBackdrop');

// ============================================
// STICKY NAVIGATION
// ============================================
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }

    if (backToTop) {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

// ============================================
// MOBILE NAVIGATION
// ============================================
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

if (navMenu) {
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const parent = link.closest('.has-dropdown');
            if (parent && window.innerWidth <= 991) {
                e.preventDefault();
                parent.classList.toggle('mobile-open');
                return;
            }
            if (mobileToggle) mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

document.addEventListener('click', (e) => {
    if (navMenu && mobileToggle && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============================================
// SCROLL ANIMATIONS (Pure CSS driven)
// ============================================
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate');
    const windowHeight = window.innerHeight;

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight * 0.85) {
            el.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    function checkCounters() {
        if (started) return;
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            started = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCounter();
            });
        }
    }

    window.addEventListener('scroll', checkCounters);
    checkCounters();
}

animateCounters();

// ============================================
// PRODUCT CAROUSEL
// ============================================
class ProductCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.dotsContainer = document.getElementById('carouselDots');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');

        if (!this.track) return;

        this.cards = Array.from(this.track.children);
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalPages = Math.ceil(this.cards.length / this.cardsPerView);
        this.isDragging = false;
        this.startX = 0;
        this.autoplayInterval = null;

        this.init();
    }

    getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 767) return 1;
        if (width <= 991) return 2;
        if (width <= 1199) return 3;
        return 4;
    }

    init() {
        this.createDots();
        this.bindEvents();
        this.updateCarousel();
        this.startAutoplay();
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => { this.prevPage(); this.resetAutoplay(); });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => { this.nextPage(); this.resetAutoplay(); });
        }

        this.track.addEventListener('mousedown', (e) => this.dragStart(e));
        this.track.addEventListener('mousemove', (e) => this.dragging(e));
        this.track.addEventListener('mouseup', (e) => this.dragEnd(e));
        this.track.addEventListener('mouseleave', (e) => this.dragEnd(e));
        this.track.addEventListener('touchstart', (e) => this.dragStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.dragging(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.dragEnd(e));

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newPerView = this.getCardsPerView();
                if (newPerView !== this.cardsPerView) {
                    this.cardsPerView = newPerView;
                    this.totalPages = Math.ceil(this.cards.length / this.cardsPerView);
                    if (this.currentIndex >= this.totalPages) this.currentIndex = this.totalPages - 1;
                    this.createDots();
                    this.updateCarousel();
                }
            }, 250);
        });

        const wrapper = document.querySelector('.product-carousel-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => this.stopAutoplay());
            wrapper.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }

    dragStart(e) {
        this.isDragging = true;
        this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.track.classList.add('dragging');
        this.stopAutoplay();
    }

    dragging(e) {
        if (!this.isDragging) return;
        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = currentX - this.startX;
        const cardWidth = this.cards[0].offsetWidth + 24;
        const baseTranslate = -(this.currentIndex * this.cardsPerView * cardWidth);
        this.track.style.transform = `translateX(${baseTranslate + diff}px)`;
    }

    dragEnd(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.track.classList.remove('dragging');

        let endX;
        if (e.changedTouches) {
            endX = e.changedTouches[0].clientX;
        } else {
            endX = e.clientX;
        }

        const diff = endX - this.startX;
        if (diff < -80) this.nextPage();
        else if (diff > 80) this.prevPage();
        else this.updateCarousel();

        this.startAutoplay();
    }

    goToPage(pageIndex) {
        this.currentIndex = pageIndex;
        this.updateCarousel();
        this.resetAutoplay();
    }

    prevPage() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.totalPages - 1;
        this.updateCarousel();
    }

    nextPage() {
        this.currentIndex = this.currentIndex < this.totalPages - 1 ? this.currentIndex + 1 : 0;
        this.updateCarousel();
    }

    updateCarousel() {
        const cardWidth = this.cards[0].offsetWidth + 24;
        const translateX = -(this.currentIndex * this.cardsPerView * cardWidth);
        const maxTranslate = -((this.cards.length - this.cardsPerView) * cardWidth);
        const finalTranslate = Math.max(translateX, maxTranslate);

        this.track.style.transform = `translateX(${finalTranslate}px)`;

        const dots = this.dotsContainer ? this.dotsContainer.querySelectorAll('.carousel-dot') : [];
        dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentIndex));
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextPage(), 4000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// ============================================
// WHATSAPP MODAL
// ============================================
function openWhatsAppModal() {
    if (whatsappModal) {
        whatsappModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeWhatsAppModal() {
    if (whatsappModal) {
        whatsappModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (whatsappBtn) whatsappBtn.addEventListener('click', openWhatsAppModal);
if (waClose) waClose.addEventListener('click', closeWhatsAppModal);
if (waBackdrop) waBackdrop.addEventListener('click', closeWhatsAppModal);

if (waForm) {
    waForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('waName').value.trim();
        const mobile = document.getElementById('waMobile').value.trim();
        const company = document.getElementById('waCompany').value.trim();
        const email = document.getElementById('waEmail').value.trim();
        const service = document.getElementById('waService').value;
        const message = document.getElementById('waMessage').value.trim();

        let waMessage = `Hello! I'm ${name}.%0AMobile: ${mobile}`;
        if (company) waMessage += `%0ACompany: ${company}`;
        if (email) waMessage += `%0AEmail: ${email}`;
        waMessage += `%0AService: ${service}`;
        if (message) waMessage += `%0AMessage: ${message}`;

        window.open(`https://wa.me/919780380300?text=${waMessage}`, '_blank');
        waForm.reset();
        closeWhatsAppModal();
    });
}

// ============================================
// VIDEO MODAL
// ============================================
function openVideoModal() {
    if (videoModal) {
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    if (videoModal) {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (playBtn) playBtn.addEventListener('click', openVideoModal);
if (videoClose) videoClose.addEventListener('click', closeVideoModal);
if (videoBackdrop) videoBackdrop.addEventListener('click', closeVideoModal);

// ============================================
// BACK TO TOP
// ============================================
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// ESCAPE KEY
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWhatsAppModal();
        closeVideoModal();
    }
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ============================================
// ACTIVE NAV ON SCROLL
// ============================================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============================================
// HIGHLIGHT TARGET PRODUCT
// ============================================
function highlightTargetProduct() {
    const hash = window.location.hash;
    if (!hash) return;

    const targetCard = document.querySelector(hash);
    if (!targetCard || !targetCard.classList.contains('sub-product-card')) return;

    setTimeout(() => {
        const navHeight = document.querySelector('.main-nav') ? document.querySelector('.main-nav').offsetHeight + 20 : 100;
        const cardTop = targetCard.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: cardTop, behavior: 'smooth' });
        targetCard.classList.add('highlighted');
        setTimeout(() => targetCard.classList.remove('highlighted'), 3000);
    }, 500);
}

window.addEventListener('load', highlightTargetProduct);
window.addEventListener('hashchange', highlightTargetProduct);

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new ProductCarousel();
});
