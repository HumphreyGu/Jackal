// ===== NAVBAR SCROLL STATE =====
const nav = document.querySelector('nav');
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 80);
  if (backToTop) backToTop.classList.toggle('visible', y > 500);
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
  const isOpen = !hamburger.classList.contains('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
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
      body.classList.remove('lang-en', 'lang-th');
      body.classList.add('lang-zh');
      langBtn.textContent = 'TH / EN';
    } else if (body.classList.contains('lang-zh')) {
      body.classList.remove('lang-en', 'lang-zh');
      body.classList.add('lang-th');
      langBtn.textContent = 'EN / 中文';
    } else {
      body.classList.remove('lang-zh', 'lang-th');
      body.classList.add('lang-en');
      langBtn.textContent = '中文 / TH';
    }
    localStorage.setItem('aimkt-lang', document.body.className.match(/lang-(\w+)/)?.[0] || 'lang-en');
  });

  const saved = localStorage.getItem('aimkt-lang');
  if (saved && saved !== 'lang-en') {
    document.body.classList.remove('lang-en');
    document.body.classList.add(saved);
    if (saved === 'lang-zh') langBtn.textContent = 'TH / EN';
    else if (saved === 'lang-th') langBtn.textContent = 'EN / 中文';
  }
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
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
          setTimeout(() => { bar.style.height = h; }, i * 100 + 200);
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
  }, { threshold: 0.4 });
  counters.forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 1600;
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
          setTimeout(() => item.classList.add('visible'), i * 200);
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

// ===== SMOOTH ANCHOR SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== SUBTLE IMAGE PARALLAX =====
const parallaxImgs = document.querySelectorAll('.e-img img, .gallery-item img');
if (parallaxImgs.length) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        parallaxImgs.forEach(img => {
          const rect = img.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const center = rect.top + rect.height / 2;
            const offset = (center - window.innerHeight / 2) * 0.03;
            img.style.transform = `translateY(${offset}px)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===== WPP-INSPIRED DYNAMIC EFFECTS =====

// Scroll Progress Bar
(function(){
  const bar = document.querySelector('.scroll-progress');
  if(!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
  }, {passive:true});
})();

// Hero Canvas Particle Network
(function(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  let particles = [];
  const COUNT = 55;
  const LINK_DIST = 130;

  function resize(){
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for(let i = 0; i < COUNT; i++){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.5 + .5
    });
  }

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particles.length; i++){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(155,143,255,0.22)';
      ctx.fill();
      for(let j = i + 1; j < particles.length; j++){
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if(d < LINK_DIST){
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(61,47,212,${.055*(1-d/LINK_DIST)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// Cursor Glow
(function(){
  const glow = document.querySelector('.cursor-glow');
  if(!glow) return;
  let active = false;
  document.addEventListener('mousemove', e => {
    if(!active){ glow.classList.add('active'); active = true; }
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => {
    glow.classList.remove('active'); active = false;
  });
})();

// Card 3D Tilt
document.querySelectorAll('.card-tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x*5}deg) rotateX(${-y*5}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Geometric Parallax
(function(){
  const geos = document.querySelectorAll('.geo');
  if(!geos.length) return;
  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      geos.forEach(el => {
        const rect = el.getBoundingClientRect();
        if(rect.top < window.innerHeight && rect.bottom > 0){
          const speed = parseFloat(el.dataset.speed || .03);
          const offset = (rect.top + rect.height/2 - window.innerHeight/2) * speed;
          const base = el.classList.contains('geo-diamond') ? ' rotate(45deg)' : '';
          el.style.transform = `translateY(${offset}px)${base}`;
        }
      });
    });
  }, {passive:true});
})();

// Image Reveal on Scroll
(function(){
  const imgs = document.querySelectorAll('.img-reveal');
  if(!imgs.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, {threshold:.15});
  imgs.forEach(el => obs.observe(el));
})();
