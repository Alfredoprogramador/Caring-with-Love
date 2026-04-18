/* ============================================================
   Caring with Love – Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM References ---------- */
  const header     = document.getElementById('header');
  const navToggle  = document.getElementById('navToggle');
  const mainNav    = document.getElementById('mainNav');
  const navLinks   = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
  const backToTop  = document.getElementById('backToTop');
  const yearSpan   = document.getElementById('currentYear');
  const contactForm = document.getElementById('contactForm');

  /* ---------- Current Year ---------- */
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ---------- Header: scroll shadow ---------- */
  function onScroll() {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('scrolled', scrolled);

    // Back to top visibility
    if (backToTop) {
      backToTop.hidden = window.scrollY < 400;
    }

    // Active nav link
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile Nav Toggle ---------- */
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (mainNav.classList.contains('is-open') &&
          !mainNav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeNav();
      }
    });

    // Close nav on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  function closeNav() {
    if (!mainNav) return;
    mainNav.classList.remove('is-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
    }
    document.body.style.overflow = '';
  }

  /* ---------- Active Nav Link on Scroll ---------- */
  const sections = document.querySelectorAll('main [id]');

  function updateActiveNavLink() {
    let currentId = '';
    sections.forEach(function (section) {
      const top    = section.getBoundingClientRect().top;
      const offset = 100;
      if (top <= offset) {
        currentId = section.id;
      }
    });
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  }

  /* ---------- Contact Form Validation ---------- */
  if (contactForm) {
    const fields = {
      name:    { el: document.getElementById('name'),    err: document.getElementById('nameError') },
      email:   { el: document.getElementById('email'),   err: document.getElementById('emailError') },
      message: { el: document.getElementById('message'), err: document.getElementById('messageError') },
    };
    const successMsg = document.getElementById('formSuccess');

    // Live validation on blur
    Object.values(fields).forEach(function (field) {
      if (field.el) {
        field.el.addEventListener('blur', function () {
          validateField(field.el, field.err);
        });
        field.el.addEventListener('input', function () {
          if (field.el.classList.contains('error')) {
            validateField(field.el, field.err);
          }
        });
      }
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      Object.values(fields).forEach(function (field) {
        if (!validateField(field.el, field.err)) {
          valid = false;
        }
      });

      if (valid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando…';

        setTimeout(function () {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar Mensagem';
          if (successMsg) {
            successMsg.hidden = false;
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(function () { successMsg.hidden = true; }, 6000);
          }
        }, 1200);
      }
    });
  }

  function validateField(input, errorEl) {
    if (!input || !errorEl) return true;
    let message = '';

    if (input.required && !input.value.trim()) {
      message = 'Este campo é obrigatório.';
    } else if (input.type === 'email' && input.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value.trim())) {
        message = 'Insira um endereço de e-mail válido.';
      }
    }

    input.classList.toggle('error', Boolean(message));
    errorEl.textContent = message;
    return !message;
  }

  /* ---------- Animate elements on scroll (Intersection Observer) ---------- */
  if ('IntersectionObserver' in window) {
    const animatedEls = document.querySelectorAll(
      '.service-card, .why-item, .team-card, .testimonial-card, .plan-card, .stat-card'
    );

    const observerOpts = { threshold: 0.15 };
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOpts);

    animatedEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });

    // Trigger for elements already in view on load
    setTimeout(function () {
      animatedEls.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add('is-visible');
        }
      });
    }, 100);
  }

  // Apply visible class styles via JS (since CSS can't know when class is added by JS)
  document.addEventListener('DOMContentLoaded', function () {
    const style = document.createElement('style');
    style.textContent = '.is-visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
  });

  /* ---------- Init ---------- */
  onScroll();

}());
