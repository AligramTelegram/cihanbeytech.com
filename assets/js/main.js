/* ===========================
   CihanBeyTech — Main JS
   =========================== */

gsap.registerPlugin(ScrollTrigger);

/* ------ NAV SCROLL EFFECT ------ */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -60',
  onUpdate(self) {
    nav.classList.toggle('scrolled', self.progress > 0);
  }
});

/* ------ MOBILE MENU ------ */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const open  = mobileMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  gsap.to(spans[0], { rotation: open ? 45 : 0,  y: open ? 7 : 0,  duration: 0.3 });
  gsap.to(spans[1], { opacity:  open ? 0 : 1,            duration: 0.2 });
  gsap.to(spans[2], { rotation: open ? -45 : 0, y: open ? -7 : 0, duration: 0.3 });
});

document.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1,        duration: 0.2 });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
  });
});


/* ------ HERO ENTRANCE ------ */
gsap.timeline({ delay: 0.2 })
  .to('.hero .reveal-up', {
    opacity: 1, y: 0,
    duration: 0.9, stagger: 0.12,
    ease: 'power3.out'
  })
  .to('.hero .reveal-right', {
    opacity: 1, x: 0,
    duration: 1.1, ease: 'power3.out'
  }, '-=0.5');

/* ------ HİZMETLER BENTO ANIMASYONLARI ------ */

// Başlıklar
gsap.to('.svc-reveal', {
  opacity: 1, y: 0,
  duration: 0.8, stagger: 0.12,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.services .section-header', start: 'top 82%' }
});

// Bento kartlar — clip-path + stagger sıralı açılma
const bentoOrder = [
  '.svc-item--1', '.svc-item--2', '.svc-item--3',
  '.svc-item--4', '.svc-item--5', '.svc-item--6',
  '.svc-item--7', '.svc-item--8'
];

bentoOrder.forEach((sel, i) => {
  gsap.to(sel, {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0 round 22px)',
    duration: 0.65,
    delay: i * 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.svc-bento', start: 'top 80%', toggleActions: 'play none none none' }
  });
});

// Stat bar dolma animasyonu
gsap.to('.svc-stat__fill', {
  width: (i, el) => el.style.width || '75%',
  duration: 1.4, ease: 'power2.out', delay: 0.4,
  scrollTrigger: { trigger: '.svc-bento', start: 'top 75%' }
});

// Stat sayaçlar
document.querySelectorAll('.svc-stat__val[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter() {
      const start = performance.now();
      const dur   = 1600;
      (function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }
  });
});

/* ------ SCROLL REVEAL ------ */
function revealOnScroll(selector, fromX = 0, fromY = 0) {
  document.querySelectorAll(selector).forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0');
    gsap.fromTo(el,
      { opacity: 0, x: fromX, y: fromY },
      {
        opacity: 1, x: 0, y: 0,
        duration: 0.75, delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });
}

revealOnScroll('.services .reveal-up',       0, 40);
revealOnScroll('.portfolio .reveal-up',      0, 40);
revealOnScroll('.process .reveal-up',        0, 40);
revealOnScroll('.testimonials .reveal-up',   0, 40);
revealOnScroll('.contact .reveal-up',        0, 40);
revealOnScroll('.about .reveal-left',  -50,  0);
revealOnScroll('.about .reveal-right',  50,  0);
revealOnScroll('.contact .reveal-left',  -50, 0);
revealOnScroll('.contact .reveal-right',  50, 0);

/* ------ COUNTER ANIMATION ------ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const start  = performance.now();
  const dur    = 1800;
  (function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}

new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
}, { threshold: 0.5 }).observe ? document.querySelectorAll('.stat__num').forEach(el => {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 }).observe(el);
}) : null;

/* ------ SKILL BARS ------ */
document.querySelectorAll('.skill-bar__fill').forEach(el => {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        gsap.to(e.target, { width: e.target.dataset.width + '%', duration: 1.3, ease: 'power2.out', delay: 0.2 });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 }).observe(el);
});

/* ------ PORTFOLIO HEADER REVEAL ------ */
gsap.to('.pf-reveal', {
  opacity: 1, y: 0,
  duration: 0.75, stagger: 0.12, ease: 'power3.out',
  scrollTrigger: { trigger: '.pf-header', start: 'top 82%' }
});

/* ------ PORTFOLIO STACKED CARDS ------ */
(function initStackedCards() {
  const cards   = gsap.utils.toArray('.pf-card');
  const dots    = document.querySelectorAll('.pf-dot');
  const counter = document.getElementById('pfCurrent');
  const stack   = document.querySelector('.pf-stack');
  const wrap    = document.querySelector('.pf-stack-wrap');
  const TOTAL   = cards.length;
  if (!cards.length || !stack || !wrap) return;

  const isMobile = () => window.innerWidth <= 768;

  /* ---- DOTS / SAYAÇ GÜNCELLE ---- */
  function setActive(idx) {
    dots.forEach((d, i) => d.classList.toggle('pf-dot--active', i === idx));
    if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
  }

  /* ==========================================
     MOBİL: yatay scroll snap carousel
     ========================================== */
  function initMobile() {
    // GSAP transform'ları sıfırla, CSS devralır
    cards.forEach(card => gsap.set(card, { clearProps: 'all' }));
    stack.style.height = '';

    // Scroll ile aktif kartı takip et (dots güncelle)
    wrap.addEventListener('scroll', () => {
      const idx = Math.round(wrap.scrollLeft / wrap.offsetWidth);
      setActive(Math.min(idx, TOTAL - 1));
    }, { passive: true });

    setActive(0);
  }

  /* ==========================================
     DESKTOP: üst üste pinned stack
     ========================================== */
  let currentIdx = -1;
  let pinST = null;

  function setStackHeight() {
    gsap.set(cards[0], { clearProps: 'all' });
    const h = cards[0].offsetHeight;
    stack.style.height = h + 'px';
  }

  function initDesktopCards() {
    cards.forEach((card, i) => {
      const behind = Math.min(i, 3);
      gsap.set(card, {
        y:       i === 0 ? 0 : behind * 14,
        scale:   i === 0 ? 1 : Math.max(1 - behind * 0.04, 0.86),
        opacity: i === 0 ? 1 : behind <= 2 ? 1 - behind * 0.18 : 0,
        zIndex:  TOTAL - i,
      });
    });
  }

  function showCard(idx) {
    if (idx === currentIdx) return;
    currentIdx = idx;
    setActive(idx);
    cards.forEach((card, i) => {
      const dist = i - idx;
      if (dist < 0) {
        gsap.to(card, { y: -32, scale: 0.92, opacity: 0, zIndex: 1, duration: 0.5, ease: 'power3.inOut', overwrite: true });
      } else if (dist === 0) {
        gsap.to(card, { y: 0, scale: 1, opacity: 1, zIndex: TOTAL, duration: 0.55, ease: 'power3.out', overwrite: true });
      } else {
        const behind = Math.min(dist, 3);
        gsap.to(card, {
          y: behind * 14, scale: Math.max(1 - behind * 0.04, 0.86),
          opacity: behind <= 2 ? 1 - behind * 0.18 : 0, zIndex: TOTAL - dist,
          duration: 0.5, ease: 'power3.out', overwrite: true
        });
      }
    });
  }

  function initDesktop() {
    currentIdx = -1;
    setStackHeight();
    initDesktopCards();
    showCard(0);

    pinST = ScrollTrigger.create({
      trigger: '.pf-stack-wrap',
      start: 'top top+=80',
      end:   () => `+=${(TOTAL - 1) * window.innerHeight * 0.65}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate(self) {
        const idx = Math.min(Math.round(self.progress * (TOTAL - 1)), TOTAL - 1);
        showCard(idx);
      }
    });
  }

  /* ---- İLK YÜKLEME ---- */
  if (isMobile()) {
    initMobile();
  } else {
    initDesktop();
  }

  /* ---- RESIZE: mod geçişi ---- */
  let lastMobile = isMobile();
  window.addEventListener('resize', () => {
    const mobile = isMobile();
    if (mobile === lastMobile) { if (!mobile) { setStackHeight(); ScrollTrigger.refresh(); } return; }
    lastMobile = mobile;
    if (pinST) { pinST.kill(); pinST = null; }
    if (mobile) {
      cards.forEach(card => gsap.set(card, { clearProps: 'all' }));
      stack.style.height = '';
      initMobile();
    } else {
      wrap.onscroll = null;
      initDesktop();
    }
    ScrollTrigger.refresh();
  });
})();

/* ------ PROCESS LINE ------ */
gsap.fromTo('.process__line',
  { scaleX: 0, transformOrigin: 'left center' },
  { scaleX: 1, duration: 1.5, ease: 'power2.out',
    scrollTrigger: { trigger: '.process__steps', start: 'top 70%' } }
);

/* ------ PARALLAX ORBS (throttled RAF) ------ */
let orbRaf;
let ox = 0, oy = 0;
document.addEventListener('mousemove', (e) => {
  ox = e.clientX;
  oy = e.clientY;
  if (orbRaf) return;
  orbRaf = requestAnimationFrame(() => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (ox - cx) / cx;
    const dy = (oy - cy) / cy;
    gsap.to('.orb--1', { x: dx * 25, y: dy * 18, duration: 2, ease: 'power1.out' });
    gsap.to('.orb--2', { x: dx * -18, y: dy * -14, duration: 2, ease: 'power1.out' });
    gsap.to('.orb--3', { x: dx * 12, y: dy * 8, duration: 2, ease: 'power1.out' });
    orbRaf = null;
  });
});

/* ------ HERO CARDS SUBTLE MOUSE PARALLAX ------ */
let cardRaf;
let cx = 0, cy = 0;
document.addEventListener('mousemove', (e) => {
  cx = e.clientX; cy = e.clientY;
  if (cardRaf) return;
  cardRaf = requestAnimationFrame(() => {
    const dx = (cx / window.innerWidth  - 0.5);
    const dy = (cy / window.innerHeight - 0.5);
    gsap.to('.hv__card--main',   { x: dx * -12, y: dy * -8,  duration: 1.5, ease: 'power1.out' });
    gsap.to('.hv__card--metric', { x: dx * 10,  y: dy * 12,  duration: 1.5, ease: 'power1.out' });
    gsap.to('.hv__card--time',   { x: dx * -8,  y: dy * 15,  duration: 1.5, ease: 'power1.out' });
    gsap.to('.hv__card--review', { x: dx * 14,  y: dy * -10, duration: 1.5, ease: 'power1.out' });
    cardRaf = null;
  });
});

/* ------ CARD TILT (GPU-only, passive) ------ */
document.querySelectorAll('.service-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    card.style.transform = `perspective(800px) rotateY(${dx*5}deg) rotateX(${-dy*5}deg) translateY(-6px)`;
  }, { passive: true });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ------ STAGGER CARD REVEALS ------ */
['service-card', 'testimonial-card'].forEach(cls => {
  ScrollTrigger.batch(`.${cls}`, {
    start: 'top 90%',
    onEnter: batch => gsap.fromTo(batch,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out', overwrite: true }
    )
  });
});

/* ------ CONTACT FORM ------ */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn');
  const txt = btn.querySelector('.btn__text');
  gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
  txt.textContent = 'Gönderiliyor...';
  btn.disabled = true;
  setTimeout(() => {
    txt.textContent = '✓ Mesajınız İletildi!';
    gsap.to(btn, { background: 'linear-gradient(135deg,#059669,#10b981)', duration: 0.4 });
    setTimeout(() => {
      txt.textContent = 'Mesaj Gönder';
      btn.disabled = false;
      gsap.to(btn, { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', duration: 0.4 });
      e.target.reset();
    }, 3000);
  }, 1200);
});

/* ------ SMOOTH ANCHOR NAV ------ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ------ FOOTER ENTRANCE ------ */
gsap.from('.footer__inner > *', {
  scrollTrigger: { trigger: '.footer', start: 'top 85%' },
  opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: 'power2.out'
});
