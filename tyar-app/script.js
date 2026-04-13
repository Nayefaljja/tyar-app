// Tyar App — Main Script

// ==========================================
// Toast Notification (replaces alert)
// ==========================================
function showToast(message, type = 'success') {
    const existing = document.getElementById('tyar-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'tyar-toast';
    toast.style.cssText = `
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
        background: ${type === 'success' ? '#22c55e' : '#3CAEA3'};
        color: white; padding: 12px 24px; border-radius: 50px;
        font-family: 'Tajawal', sans-serif; font-size: 0.95rem; font-weight: 600;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 9999;
        opacity: 0; transition: opacity 0.3s ease; white-space: nowrap;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==========================================
// Dark Mode (shared across all pages)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const darkToggle = document.getElementById('darkToggle');
    const darkIcon = document.getElementById('darkIcon');
    const html = document.documentElement;

    if (darkToggle) {
        function setTheme(dark) {
            if (dark) {
                html.setAttribute('data-theme', 'dark');
                if (darkIcon) darkIcon.className = 'fas fa-sun';
                localStorage.setItem('tyar-theme', 'dark');
            } else {
                html.removeAttribute('data-theme');
                if (darkIcon) darkIcon.className = 'fas fa-moon';
                localStorage.setItem('tyar-theme', 'light');
            }
        }

        if (localStorage.getItem('tyar-theme') === 'dark') setTheme(true);
        darkToggle.addEventListener('click', () => setTheme(html.getAttribute('data-theme') !== 'dark'));
    }

    // ==========================================
    // Mobile Navigation
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu on nav link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    // ==========================================
    // Smooth Scroll
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target === '#') return;
            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // Marketplace Filters (charger/maintenance pages)
    // ==========================================
    const searchButton = document.querySelector('.marketplace-filters .btn-primary');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const model = document.getElementById('model')?.value;
            const city = document.getElementById('location')?.value;
            const listings = document.querySelectorAll('.listing-card');
            let shown = 0;

            listings.forEach(card => {
                let visible = true;
                if (model && !card.textContent.toLowerCase().includes(model.toLowerCase())) visible = false;
                if (city && !card.textContent.toLowerCase().includes(city.toLowerCase())) visible = false;
                card.style.display = visible ? '' : 'none';
                if (visible) shown++;
            });

            showToast(`تم العثور على ${shown} نتيجة`);
        });
    }

    // ==========================================
    // Form Submissions
    // ==========================================
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formId = form.id || (form.closest('section')?.id) || '';
            let message = 'تم الإرسال بنجاح!';

            if (formId.includes('charger') || form.closest('.charger-installation')) {
                message = 'تم استلام طلب تركيب الشاحن. سنتواصل معك خلال 24 ساعة.';
            } else if (formId.includes('maintenance') || form.closest('.maintenance')) {
                message = 'تم جدولة موعد الصيانة بنجاح. ستصلك رسالة تأكيد.';
            } else if (formId.includes('contact') || form.closest('.contact')) {
                message = 'شكراً لرسالتك! سيرد عليك فريقنا خلال 24 ساعة.';
            }

            showToast(message);
            form.reset();
        });
    });

    // ==========================================
    // Favorite Buttons (non-marketplace pages)
    // ==========================================
    document.querySelectorAll('.listing-actions .btn-outline').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isLiked = icon.classList.contains('fas');
            icon.classList.toggle('far', isLiked);
            icon.classList.toggle('fas', !isLiked);
            const title = this.closest('.listing-details')?.querySelector('h3')?.textContent || '';
            showToast(isLiked ? `تمت إزالة ${title} من المفضلة` : `تمت إضافة ${title} للمفضلة`);
        });
    });

    // ==========================================
    // Contact Seller Buttons
    // ==========================================
    document.querySelectorAll('.listing-actions .btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.closest('.listing-details')?.querySelector('h3')?.textContent || 'السيارة';
            showToast(`جارٍ فتح نموذج التواصل لـ ${title}`);
        });
    });

    // ==========================================
    // Sell EV Button
    // ==========================================
    const postEvButton = document.querySelector('.marketplace-cta .btn-primary');
    if (postEvButton) {
        postEvButton.addEventListener('click', function() {
            showToast('ستتوفر ميزة إضافة إعلانك قريباً!', 'info');
        });
    }

    // ==========================================
    // Scroll Reveal (IntersectionObserver)
    // ==========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.feature-card, .listing-card, .service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        revealObserver.observe(el);
    });
});
