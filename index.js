// --- DOM styling utilities (append to your index.js) ---
/* Helper: accept element or selector */
function _getEl(target) {
    if (!globalThis.document) return null;
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    return target instanceof Element ? target : null;
}

/* Class utilities */
function addClass(target, className) {
    const el = _getEl(target);
    if (!el) return;
    el.classList.add(className);
}
function removeClass(target, className) {
    const el = _getEl(target);
    if (!el) return;
    el.classList.remove(className);
}
function toggleClass(target, className) {
    const el = _getEl(target);
    if (!el) return;
    el.classList.toggle(className);
}

/* Inline styles: set single or multiple properties */
function setStyle(target, styles = {}) {
    const el = _getEl(target);
    if (!el) return;
    Object.keys(styles).forEach(k => {
        el.style[k] = styles[k];
    });
}

/* Apply styles to all matched elements (selector or NodeList/Array) */
function setStyles(target, styles = {}) {
    if (!globalThis.document) return;
    if (typeof target === 'string') {
        document.querySelectorAll(target).forEach(el => setStyle(el, styles));
        return;
    }
    if (target instanceof NodeList || Array.isArray(target)) {
        target.forEach(el => setStyle(el, styles));
        return;
    }
    setStyle(target, styles);
}

/* Theme via CSS variables on :root */
function createTheme(vars = {}) {
    if (!globalThis.document) return;
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => {
        root.style.setProperty(`--${k}`, v);
    });
}
function applyTheme(themeObject) {
    createTheme(themeObject);
}

/* Simple fade in / fade out using opacity + transition */
function fadeIn(target, ms = 300, display = 'block') {
    const el = _getEl(target);
    if (!el) return Promise.resolve();
    el.style.opacity = 0;
    el.style.display = display;
    el.style.transition = `opacity ${ms}ms`;
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            el.style.opacity = 1;
            setTimeout(() => {
                el.style.transition = '';
                resolve();
            }, ms);
        });
    });
}
function fadeOut(target, ms = 300) {
    const el = _getEl(target);
    if (!el) return Promise.resolve();
    el.style.transition = `opacity ${ms}ms`;
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            el.style.opacity = 0;
            setTimeout(() => {
                el.style.transition = '';
                el.style.display = 'none';
                resolve();
            }, ms);
        });
    });
}

/* Debounce utility for scroll/resize handlers */
function debounce(fn, wait = 200) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

/* Responsive font-size between min and max based on viewport width */
function responsiveFont(selector, minPx = 12, maxPx = 20, minW = 320, maxW = 1280) {
    if (!globalThis.document) return;
    const els = document.querySelectorAll(selector);
    function update() {
        const w = Math.max(minW, Math.min(maxW, window.innerWidth));
        const ratio = (w - minW) / (maxW - minW);
        const size = Math.round(minPx + (maxPx - minPx) * ratio);
        els.forEach(el => (el.style.fontSize = `${size}px`));
    }
    update();
    window.addEventListener('resize', debounce(update, 120));
}

/* Export new utilities (replace or merge into your module.exports) */
module.exports = Object.assign(module.exports || {}, {
    addClass,
    removeClass,
    toggleClass,
    setStyle,
    setStyles,
    createTheme,
    applyTheme,
    fadeIn,
    fadeOut,
    debounce,
    responsiveFont
});
