/* ═══════════════════════════════════════════════════════════════
   AL LÍO ESTUDIO — Main JavaScript
   Scroll animations, header, mobile menu, smooth interactions
   ═══════════════════════════════════════════════════════════════ */

import './style.css';

// ─── Wait for DOM ───
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initHeroAnimation();
  initSmoothScroll();
  initContactForm();
  assignStaggerDelays();
});

/* ═══════════════════════════════════════════
   HEADER (scroll-aware)
   ═══════════════════════════════════════════ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  const threshold = 50;

  const onScroll = () => {
    const y = window.scrollY;

    if (y > threshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once
}

/* ═══════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════ */
function initMobileMenu() {
  const burger = document.getElementById('burger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  const links = menu.querySelectorAll('.mobile-menu__link');

  const toggleMenu = () => {
    const isOpen = menu.classList.contains('active');

    if (isOpen) {
      menu.classList.remove('active');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      menu.classList.add('active');
      burger.classList.add('active');
      burger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  burger.addEventListener('click', toggleMenu);

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      toggleMenu();
    }
  });
}

/* ═══════════════════════════════════════════
   SCROLL ANIMATIONS (Intersection Observer)
   ═══════════════════════════════════════════ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate="fade-up"]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   HERO ANIMATION (3D perspective entrance)
   ═══════════════════════════════════════════ */
function initHeroAnimation() {
  const claim = document.querySelector('[data-animate="hero"]');
  if (!claim) return;

  // Delay for dramatic effect
  setTimeout(() => {
    claim.classList.add('visible');
  }, 300);
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL (for anchor links)
   ═══════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update URL without jump
      history.pushState(null, null, href);
    });
  });
}

/* ═══════════════════════════════════════════
   STAGGER DELAYS (for service cards)
   ═══════════════════════════════════════════ */
function assignStaggerDelays() {
  const cards = document.querySelectorAll('.services__grid [data-animate="fade-up"]');
  cards.forEach((card, i) => {
    card.style.setProperty('--stagger', i);
  });
}

/* ═══════════════════════════════════════════
   CONTACT FORM (basic UX)
   ═══════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn--solid');
    const originalText = btn.textContent;

    // Simple feedback animation
    btn.textContent = '¡Mensaje enviado! ✓';
    btn.style.background = 'var(--c-card-stone)';
    btn.style.borderColor = 'var(--c-card-stone)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}
