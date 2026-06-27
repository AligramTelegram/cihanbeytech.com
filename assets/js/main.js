/* ============================================================
   CihanBeyTech — Main JS
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -60',
  onUpdate(self) { nav.classList.toggle('scrolled', self.progress > 0); }
});

/* ── OVERLAY MENÜ ── */
const burger     = document.getElementById('burger');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
  navOverlay.classList.add('is-open');
  burger.classList.add('is-open');
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navOverlay.classList.remove('is-open');
  burger.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () =>
  navOverlay.classList.contains('is-open') ? closeMenu() : openMenu()
);

document.querySelectorAll('.nav-overlay__link').forEach(link =>
  link.addEventListener('click', closeMenu)
);

/* ── SMOOTH ANCHOR ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    closeMenu();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ── HERO ENTRANCE ── */
const heroTl = gsap.timeline({ delay: 0.3 });

heroTl
  .to('.hero__info', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });

/* Scroll ettikçe scroll göstergesini gizle */
const scrollIndicator = document.querySelector('.hero__scroll');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    const hide = window.scrollY > 80;
    scrollIndicator.style.opacity = hide ? '0' : '';
    scrollIndicator.style.transition = 'opacity 0.4s';
  }, { passive: true });
}

/* ── HAKKIMIZDA PARTICLE NETWORK ── */
(function initParticles() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = window.innerWidth < 768 ? 40 : 80;
  const MAX_DIST = 160;
  const ACCENT = '139,92,246';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT},0.7)`;
      ctx.fill();

      for (let j = i + 1; j < COUNT; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${ACCENT},${(1 - d / MAX_DIST) * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { init(); draw(); obs.disconnect(); }
  }, { threshold: 0.1 });
  obs.observe(canvas);

  window.addEventListener('resize', () => { resize(); }, { passive: true });
})();

/* ── HAKKIMIZDA REVEAL ── */
gsap.to('.abt-reveal', {
  opacity: 1, y: 0,
  duration: 0.7, stagger: 0.12, ease: 'power3.out',
  scrollTrigger: { trigger: '.about', start: 'top 75%' }
});

/* About stat sayaçlar */
document.querySelectorAll('.about__stat-num[data-target]').forEach(el => {
  const target = parseInt(el.dataset.target);
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter() {
      const start = performance.now(), dur = 1600;
      (function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }
  });
});

/* ── PORTFOLYO STACKED CARDS ── */
(function initStackedCards() {
  const cards   = gsap.utils.toArray('.pf-card');
  const dots    = document.querySelectorAll('.pf-dot');
  const counter = document.getElementById('pfCurrent');
  const stack   = document.querySelector('.pf-stack');
  const wrap    = document.querySelector('.pf-stack-wrap');
  const TOTAL   = cards.length;
  if (!cards.length || !stack || !wrap) return;

  const isMobile = () => window.innerWidth <= 768;

  function setActive(idx) {
    dots.forEach((d, i) => d.classList.toggle('pf-dot--active', i === idx));
    if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
  }

  /* MOBİL: scroll snap */
  function initMobile() {
    cards.forEach(card => gsap.set(card, { clearProps: 'all' }));
    stack.style.height = '';
    wrap.addEventListener('scroll', () => {
      const idx = Math.round(wrap.scrollLeft / (wrap.offsetWidth));
      setActive(Math.min(idx, TOTAL - 1));
    }, { passive: true });
    setActive(0);
  }

  /* DESKTOP: pinned stack */
  let currentIdx = -1;
  let pinST = null;

  function setStackHeight() {
    gsap.set(cards[0], { clearProps: 'all' });
    stack.style.height = cards[0].offsetHeight + 'px';
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
          opacity: behind <= 2 ? 1 - behind * 0.18 : 0,
          zIndex: TOTAL - dist,
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
      end: () => `+=${(TOTAL - 1) * window.innerHeight * 0.65}`,
      pin: true, pinSpacing: true, anticipatePin: 1,
      onUpdate(self) {
        showCard(Math.min(Math.round(self.progress * (TOTAL - 1)), TOTAL - 1));
      }
    });
  }

  /* PF header reveal */
  gsap.to('.pf-reveal', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.pf-header', start: 'top 85%' }
  });

  if (isMobile()) { initMobile(); } else { initDesktop(); }

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
      initDesktop();
    }
    ScrollTrigger.refresh();
  });
})();

/* ── SÜREÇ ── */
gsap.to('.prc-reveal', {
  opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.process', start: 'top 82%' }
});

gsap.utils.toArray('.prc-item').forEach((item, i) => {
  gsap.fromTo(item,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
    }
  );
});

/* ── İLETİŞİM ── */
gsap.to('.ctc-reveal', {
  opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact', start: 'top 80%' }
});

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.contact__submit');
    const txt = btn.querySelector('.btn__text');
    txt.textContent = 'Gönderiliyor...';
    btn.disabled = true;
    setTimeout(() => {
      txt.textContent = '✓ Mesajınız İletildi!';
      btn.style.background = '#059669';
      setTimeout(() => {
        txt.textContent = 'Mesaj Gönder';
        btn.disabled = false;
        btn.style.background = '';
        e.target.reset();
      }, 3000);
    }, 1200);
  });
}
