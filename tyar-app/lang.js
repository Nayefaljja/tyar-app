/**
 * Tyar — Shared Language Utility
 * Usage: include this script, add data-en="..." to any element.
 * Reads/writes 'tyar-lang' in localStorage.
 * Toggle button: any element with id="langBtn" or class="lang-toggle"
 */
(function () {

    function getStoredLang() {
        return localStorage.getItem('tyar-lang') || 'ar';
    }

    function applyLang(lang) {
        localStorage.setItem('tyar-lang', lang);
        const html = document.documentElement;
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Update all toggle button labels
        document.querySelectorAll('.lang-toggle, #langBtn').forEach(btn => {
            const label = btn.querySelector('[data-lang-label], #langLabel') || btn;
            label.textContent = lang === 'ar' ? 'English' : 'العربية';
        });

        // Translate all elements carrying data-en
        document.querySelectorAll('[data-en]').forEach(el => {
            const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
            const isTitle = el.tagName === 'TITLE';
            const val = lang === 'en' ? el.dataset.en : el.dataset.ar;
            if (!val) return;
            if (isInput)       el.placeholder = val;
            else if (isTitle)  document.title = val;
            else               el.innerHTML = val;
        });

        // Translate placeholders specifically marked
        document.querySelectorAll('[data-en-ph]').forEach(el => {
            el.placeholder = lang === 'en' ? el.dataset.enPh : el.dataset.arPh;
        });
    }

    function storeOriginals() {
        document.querySelectorAll('[data-en]').forEach(el => {
            if (el.dataset.ar) return; // already set
            const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
            const isTitle = el.tagName === 'TITLE';
            if (isInput)       el.dataset.ar = el.placeholder;
            else if (isTitle)  el.dataset.ar = document.title;
            else               el.dataset.ar = el.innerHTML;
        });
        document.querySelectorAll('[data-en-ph]').forEach(el => {
            if (!el.dataset.arPh) el.dataset.arPh = el.placeholder;
        });
    }

    function init() {
        storeOriginals();
        applyLang(getStoredLang());

        document.querySelectorAll('.lang-toggle, #langBtn').forEach(btn => {
            btn.addEventListener('click', function () {
                applyLang(getStoredLang() === 'ar' ? 'en' : 'ar');
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose globally so pages can call TyarLang.apply('en') if needed
    window.TyarLang = { apply: applyLang, current: getStoredLang };
})();
