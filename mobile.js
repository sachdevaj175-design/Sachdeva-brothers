// Menu
const menuBtn = document.getElementById('mMenuBtn');
const menuOverlay = document.getElementById('mMenuOverlay');
const menuClose = document.getElementById('mMenuClose');

menuBtn.addEventListener('click', () => menuOverlay.classList.add('active'));
menuClose.addEventListener('click', () => menuOverlay.classList.remove('active'));

document.querySelectorAll('.m-menu-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });
});

// Nav scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mNav');
    if (window.scrollY > 50) {
        nav.style.borderBottomColor = 'rgba(232,67,10,.2)';
    } else {
        nav.style.borderBottomColor = 'rgba(232,67,10,.1)';
    }
});

// Product Slider
const track = document.getElementById('mProductTrack');
const bar = document.getElementById('mSliderBar');
const counter = document.getElementById('mSliderCurrent');
let currentSlide = 0;
const totalSlides = 8;
let startX = 0;
let isDragging = false;

function updateSlider() {
    if (!track) return;
    const cardWidth = track.children[0].offsetWidth + 14;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    bar.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
    counter.textContent = String(currentSlide + 1).padStart(2, '0');
}

if (track) {
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.changedTouches[0].clientX;
        if (diff > 50 && currentSlide < totalSlides - 1) {
            currentSlide++;
        } else if (diff < -50 && currentSlide > 0) {
            currentSlide--;
        }
        updateSlider();
    });
}

// Counter Animation
function animateCounters() {
    document.querySelectorAll('.m-stat-num').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = target / 60;
        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };
        update();
    });
}

animateCounters();

// WhatsApp Sheet
const waBtn = document.getElementById('mWaBtn');
const waSheet = document.getElementById('mWaSheet');
const waBackdrop = document.getElementById('mWaBackdrop');
const waForm = document.getElementById('mWaForm');

waBtn.addEventListener('click', () => waSheet.classList.add('active'));
waBackdrop.addEventListener('click', () => waSheet.classList.remove('active'));

waForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('mWaName').value.trim();
    const mobile = document.getElementById('mWaMobile').value.trim();
    const company = document.getElementById('mWaCompany').value.trim();
    const email = document.getElementById('mWaEmail').value.trim();
    const service = document.getElementById('mWaService').value;
    let msg = `Hello! I'm ${name}.%0AMobile: ${mobile}`;
    if (company) msg += `%0ACompany: ${company}`;
    if (email) msg += `%0AEmail: ${email}`;
    msg += `%0AProduct: ${service}`;
    window.open(`https://wa.me/919780380300?text=${msg}`, '_blank');
    waForm.reset();
    waSheet.classList.remove('active');
});

// Scroll to top
document.getElementById('mScrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Redirect to desktop if resized
window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
        window.location.href = 'index.html';
    }
});
