// ===== NAVBAR SCROLL STATE =====
const nav = document.querySelector('nav');
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 80);
  if (backToTop) backToTop.classList.toggle('visible', y > 400);
}, { passive: true });

// ===== BACK TO TOP =====
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== MOBILE MENU =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileOverlay = document.querySelector('.mobile-overlay');

function toggleMobileMenu() {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  mobileOverlay.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', toggleMobileMenu);
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) toggleMobileMenu();
    });
  });
}

// ===== LANGUAGE SWITCHER =====
const langBtn = document.querySelector('.lang-btn');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    const body = document.body;
    if (body.classList.contains('lang-en') || (!body.classList.contains('lang-zh') && !body.classList.contains('lang-th'))) {
      // en -> zh
      body.classList.remove('lang-en', 'lang-th');
      body.classList.add('lang-zh');
      langBtn.textContent = 'TH / EN';
    } else if (body.classList.contains('lang-zh')) {
      // zh -> th
      body.classList.remove('lang-en', 'lang-zh');
      body.classList.add('lang-th');
      langBtn.textContent = 'EN / 中文';
    } else {
      // th -> en
      body.classList.remove('lang-zh', 'lang-th');
      body.classList.add('lang-en');
      langBtn.textContent = '中文 / TH';
    }
    localStorage.setItem('aimkt-lang', document.body.className.match(/lang-(\w+)/)?.[0] || 'lang-en');
  });

  // Restore saved language
  const saved = localStorage.getItem('aimkt-lang');
  if (saved && saved !== 'lang-en') {
    document.body.classList.remove('lang-en');
    document.body.classList.add(saved);
    if (saved === 'lang-zh') langBtn.textContent = 'TH / EN';
    else if (saved === 'lang-th') langBtn.textContent = 'EN / 中文';
  }
}

// ===== SCROLL REVEAL (Intersection Observer) =====
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

// ===== CHART BAR ANIMATION =====
const chartBoxes = document.querySelectorAll('.chart-box');
if (chartBoxes.length) {
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.b');
        bars.forEach((bar, i) => {
          const h = bar.getAttribute('data-h') || bar.style.height;
          bar.style.height = '0';
          setTimeout(() => { bar.style.height = h; }, i * 80);
        });
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  chartBoxes.forEach(box => chartObserver.observe(box));
}

// ===== NUMBER COUNTER =====
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== VENDOR STEP STAGGER =====
const vsteps = document.querySelectorAll('.vstep-item');
if (vsteps.length) {
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.parentElement.querySelectorAll('.vstep-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 150);
        });
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  vsteps.forEach(el => {
    el.classList.add('reveal');
    stepObserver.observe(el);
  });
}
