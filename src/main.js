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
  initTiltCards();
  initWorkSwiper();
  initServiceAccordion();
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

/* ═══════════════════════════════════════════
   TILT CARDS — Vanilla JS port of
   motion-primitives/tilt + spotlight
   Uses spring physics for smooth animation
   ═══════════════════════════════════════════ */
function initTiltCards() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  if (!tiltElements.length) return;

  tiltElements.forEach(el => {
    const card = el.querySelector('.team__card');
    const spotlight = el.querySelector('.team__spotlight');
    if (!card) return;

    // Config from data attributes
    const rotationFactor = parseFloat(el.dataset.tiltRotation) || 15;
    const isReverse = el.hasAttribute('data-tilt-reverse');

    // Spring physics config (matching framer-motion defaults)
    const spring = {
      stiffness: 26.7,
      damping: 4.1,
      mass: 0.2,
    };

    // State
    const state = {
      targetX: 0,    // Mouse-driven target (-0.5 to 0.5)
      targetY: 0,
      currentX: 0,   // Spring-animated current
      currentY: 0,
      velocityX: 0,
      velocityY: 0,
      spotlightX: 0, // Spotlight position in px
      spotlightY: 0,
      spotTargetX: 0,
      spotTargetY: 0,
      spotVelX: 0,
      spotVelY: 0,
      isHovering: false,
      animating: false,
    };

    // Spring step function
    function springStep(current, target, velocity, config) {
      const { stiffness, damping, mass } = config;
      const springForce = -stiffness * (current - target);
      const dampingForce = -damping * velocity;
      const acceleration = (springForce + dampingForce) / mass;
      const newVelocity = velocity + acceleration * (1 / 60);
      const newCurrent = current + newVelocity * (1 / 60);
      return { value: newCurrent, velocity: newVelocity };
    }

    // Animation loop
    function animate() {
      // Tilt spring
      const xResult = springStep(state.currentX, state.targetX, state.velocityX, spring);
      const yResult = springStep(state.currentY, state.targetY, state.velocityY, spring);
      state.currentX = xResult.value;
      state.velocityX = xResult.velocity;
      state.currentY = yResult.value;
      state.velocityY = yResult.velocity;

      // Spotlight spring
      const sxResult = springStep(state.spotlightX, state.spotTargetX, state.spotVelX, spring);
      const syResult = springStep(state.spotlightY, state.spotTargetY, state.spotVelY, spring);
      state.spotlightX = sxResult.value;
      state.spotVelX = sxResult.velocity;
      state.spotlightY = syResult.value;
      state.spotVelY = syResult.velocity;

      // Compute rotations
      const rotateX = isReverse
        ? rotationFactor * state.currentY
        : -rotationFactor * state.currentY;
      const rotateY = isReverse
        ? -rotationFactor * state.currentX
        : rotationFactor * state.currentX;

      // Apply transform
      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Move spotlight
      if (spotlight) {
        spotlight.style.left = `${state.spotlightX}px`;
        spotlight.style.top = `${state.spotlightY}px`;
      }

      // Continue animation until settled
      const isSettled =
        Math.abs(state.velocityX) < 0.001 &&
        Math.abs(state.velocityY) < 0.001 &&
        Math.abs(state.currentX - state.targetX) < 0.001 &&
        Math.abs(state.currentY - state.targetY) < 0.001;

      if (!isSettled || state.isHovering) {
        state.animating = true;
        requestAnimationFrame(animate);
      } else {
        state.animating = false;
        card.style.transform = '';
      }
    }

    function startAnimation() {
      if (!state.animating) {
        state.animating = true;
        requestAnimationFrame(animate);
      }
    }

    // Touch and Mouse shared handler
    function handlePointerMove(clientX, clientY) {
      const rect = card.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      // Normalized position (-0.5 to 0.5)
      state.targetX = mouseX / rect.width - 0.5;
      state.targetY = mouseY / rect.height - 0.5;

      // Spotlight absolute position within card
      state.spotTargetX = mouseX;
      state.spotTargetY = mouseY;

      state.isHovering = true;
      card.classList.add('is-active');
      startAnimation();
    }

    function handlePointerLeave() {
      state.targetX = 0;
      state.targetY = 0;
      state.isHovering = false;
      card.classList.remove('is-active');
      startAnimation();
    }

    // Mouse handlers
    card.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
    card.addEventListener('mouseleave', handlePointerLeave);

    // Touch handlers — non-passive so we can preventDefault and block scroll
    card.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    }, { passive: false });

    card.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    }, { passive: false });

    card.addEventListener('touchend', handlePointerLeave);
  });
}


/* ═══════════════════════════════════════════
   WORK SWIPER — Mobile card stack
   ═══════════════════════════════════════════ */
function initWorkSwiper() {
  const stack = document.getElementById('workSwiperStack');
  if (!stack) return;

  let isSwiping = false;
  let startX = 0;
  let currentX = 0;
  let rafId = null;

  const THRESHOLD = 50;
  const SWAP_DURATION = 300;

  function getCards() {
    return [...stack.querySelectorAll('.swiper-card')];
  }

  function updatePositions() {
    const cards = getCards();
    const total = cards.length;
    cards.forEach((card, i) => {
      card.style.setProperty('--i', (i + 1).toString());
      card.style.setProperty('--swipe-x', '0px');
      card.style.setProperty('--swipe-rotate', '0deg');
      card.style.opacity = '1';
      card.style.zIndex = total - i;
      card.style.transition = `transform ${SWAP_DURATION}ms ease, opacity ${SWAP_DURATION}ms ease`;
    });
  }

  function applySwipeStyles(deltaX) {
    const card = getCards()[0];
    if (!card) return;
    card.style.setProperty('--swipe-x', `${deltaX}px`);
    card.style.setProperty('--swipe-rotate', `${deltaX * 0.2}deg`);
    card.style.opacity = (1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75).toString();
  }

  function handleStart(clientX) {
    if (isSwiping) return;
    isSwiping = true;
    startX = clientX;
    currentX = clientX;
    const card = getCards()[0];
    if (card) card.style.transition = 'none';
  }

  function handleEnd() {
    if (!isSwiping) return;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    const deltaX = currentX - startX;
    const card = getCards()[0];

    if (card) {
      card.style.transition = `transform ${SWAP_DURATION}ms ease, opacity ${SWAP_DURATION}ms ease`;

      if (Math.abs(deltaX) > THRESHOLD) {
        const dir = Math.sign(deltaX);
        card.style.setProperty('--swipe-x', `${dir * 300}px`);
        card.style.setProperty('--swipe-rotate', `${dir * 20}deg`);
        card.style.opacity = '0.2';

        setTimeout(() => {
          stack.appendChild(card);
          updatePositions();
        }, SWAP_DURATION);
      } else {
        applySwipeStyles(0);
      }
    }

    isSwiping = false;
    startX = 0;
    currentX = 0;
  }

  function handleMove(clientX) {
    if (!isSwiping) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      currentX = clientX;
      const deltaX = currentX - startX;
      applySwipeStyles(deltaX);

      if (Math.abs(deltaX) > THRESHOLD) {
        handleEnd();
      }
    });
  }

  stack.addEventListener('pointerdown', (e) => handleStart(e.clientX));
  stack.addEventListener('pointermove', (e) => handleMove(e.clientX));
  stack.addEventListener('pointerup', () => handleEnd());
  stack.addEventListener('pointerleave', () => {
    if (isSwiping) handleEnd();
  });

  updatePositions();
}


/* ═══════════════════════════════════════════
   SERVICE ACCORDION — Interactive image panels
   ═══════════════════════════════════════════ */
function initServiceAccordion() {
  const container = document.getElementById('serviceAccordion');
  if (!container) return;

  const items = container.querySelectorAll('.accordion__item');

  // Load background images from data-image attributes
  items.forEach((item) => {
    const imgUrl = item.dataset.image;
    if (imgUrl) {
      item.style.backgroundImage = `url(${imgUrl})`;
    }
  });

  // Handle hover (desktop) and click/tap (mobile)
  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      items.forEach((el) => el.classList.remove('is-active'));
      item.classList.add('is-active');
    });

    item.addEventListener('click', () => {
      items.forEach((el) => el.classList.remove('is-active'));
      item.classList.add('is-active');
    });
  });
}
