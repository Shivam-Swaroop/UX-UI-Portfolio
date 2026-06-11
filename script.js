(() => {
  'use strict';

  // Header scroll state
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Cursor glow (desktop only)
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    let raf;
    document.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    }, { passive: true });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Workflow step interaction
  const steps = document.querySelectorAll('.workflow-step');
  let activeIndex = 0;
  let autoInterval;

  const setActiveStep = (index) => {
    activeIndex = index;
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });
  };

  steps.forEach((step, i) => {
    step.addEventListener('click', () => {
      setActiveStep(i);
      resetAutoCycle();
    });
  });

  const cycleSteps = () => {
    setActiveStep((activeIndex + 1) % steps.length);
  };

  const startAutoCycle = () => {
    autoInterval = setInterval(cycleSteps, 5000);
  };

  const resetAutoCycle = () => {
    clearInterval(autoInterval);
    startAutoCycle();
  };

  if (steps.length) {
    startAutoCycle();

    const workflowSection = document.querySelector('.workflow');
    const workflowObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAutoCycle();
        } else {
          clearInterval(autoInterval);
        }
      },
      { threshold: 0.3 }
    );
    workflowObserver.observe(workflowSection);
  }

  // Smooth anchor offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
