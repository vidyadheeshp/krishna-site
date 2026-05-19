/* ============================================================
   main.js — Core page functionality
   ============================================================ */
(function () {
  'use strict';

  /* ---- Back to Top ---- */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll Reveal (AOS-like) ---- */
  const aosElements = document.querySelectorAll('[data-aos]');

  if (aosElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-aos-delay') || '0');
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    aosElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    aosElements.forEach(el => el.classList.add('aos-animate'));
  }

  /* ---- Animated Counter ---- */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target || el.textContent, 10);
    const duration = 1800;
    const step     = 16;
    const steps    = duration / step;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
      }
    }, step);
  }

  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---- Contact Form Validation ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = document.getElementById('form-msg');

      // Clear previous messages
      if (msg) { msg.className = 'form-msg'; msg.textContent = ''; }

      // Collect fields
      const name    = (this.querySelector('[name="name"]')?.value || '').trim();
      const email   = (this.querySelector('[name="email"]')?.value || '').trim();
      const phone   = (this.querySelector('[name="phone"]')?.value || '').trim();
      const message = (this.querySelector('[name="message"]')?.value || '').trim();

      // Validate
      const errors = [];
      if (!name)                              errors.push('Name is required.');
      if (!email)                             errors.push('Email is required.');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
      if (phone && !/^[+\d\s\-()]{7,15}$/.test(phone))    errors.push('Please enter a valid phone number.');
      if (!message)                           errors.push('Message cannot be empty.');
      if (message.length > 1000)              errors.push('Message must be under 1000 characters.');

      if (errors.length > 0) {
        if (msg) {
          msg.className   = 'form-msg error';
          msg.textContent = errors[0];
        }
        return;
      }

      // Simulate submission (static site — no backend)
      const btn = this.querySelector('.form-btn');
      if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Sending…'; }

      setTimeout(() => {
        if (msg) {
          msg.className   = 'form-msg success';
          msg.textContent = '✓ Thank you! Your message has been received. We will get back to you soon.';
        }
        this.reset();
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; }
      }, 1200);
    });
  }

  /* ---- Testimonial Slider (auto-rotate on mobile) ---- */
  const slider     = document.querySelector('.testimonials-grid');
  let sliderTimer  = null;

  function startSlider() {
    if (!slider || window.innerWidth > 768) return;
    // Simple CSS-based snap scroll fallback — nothing needed in JS
  }
  startSlider();
  window.addEventListener('resize', startSlider);

  /* ---- Countdown Timer ---- */
  const countdownEl = document.getElementById('festival-countdown');
  if (countdownEl) {
    const targetDate = new Date(countdownEl.dataset.date || '2026-08-16T00:00:00');

    function updateCountdown() {
      const now  = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        countdownEl.innerHTML = '<p style="color:var(--gold);font-weight:600;">Today is the festival! 🎉</p>';
        return;
      }

      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const fmt = n => String(n).padStart(2, '0');
      countdownEl.innerHTML = `
        <div class="cd-unit"><span class="cd-num">${fmt(days)}</span><span class="cd-lbl">Days</span></div>
        <div class="cd-unit"><span class="cd-num">${fmt(hours)}</span><span class="cd-lbl">Hours</span></div>
        <div class="cd-unit"><span class="cd-num">${fmt(minutes)}</span><span class="cd-lbl">Mins</span></div>
        <div class="cd-unit"><span class="cd-num">${fmt(seconds)}</span><span class="cd-lbl">Secs</span></div>`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---- Category tabs (Services page) ---- */
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category || 'all';
      document.querySelectorAll('.service-full-card').forEach(card => {
        const cat = card.dataset.category || '';
        card.style.display = (category === 'all' || cat === category) ? '' : 'none';
      });
    });
  });

})();
