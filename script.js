/* =============================================================
   script.js  —  Swarali Warade Portfolio
   Modules: mobile menu · scroll reveal · active nav · contact form
   ============================================================= */

   document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollReveal();
    initActiveNav();
    initContactForm();
    initTypedRole();
  });
  
  /* ── Mobile menu ──────────────────────────────────────────── */
  function initMobileMenu() {
    const toggle    = document.getElementById('menu-toggle');
    const menu      = document.getElementById('mobile-menu');
    const iconOpen  = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
  
    if (!toggle || !menu) return;
  
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      iconOpen?.classList.toggle('hidden',  isOpen);
      iconClose?.classList.toggle('hidden', !isOpen);
    });
  
    // Close on any link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        iconOpen?.classList.remove('hidden');
        iconClose?.classList.add('hidden');
      });
    });
  }
  
  /* ── Scroll reveal (IntersectionObserver) ─────────────────── */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!elements.length) return;
  
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
  
    elements.forEach(el => observer.observe(el));
  }
  
  /* ── Active nav link (section spy) ───────────────────────── */
  function initActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link[data-section]');
  
    if (!sections.length || !navLinks.length) return;
  
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.dataset.section === id);
            });
          }
        });
      },
      { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' }
    );
  
    sections.forEach(section => observer.observe(section));
  }
  
  /* ── Contact form (client-side validation + Formspree submit) ── */
  function initContactForm() {
    const form       = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    if (!form) return;
  
    form.addEventListener('submit', async e => {
      e.preventDefault();
  
      const name    = form.querySelector('#name');
      const email   = form.querySelector('#email');
      const phone   = form.querySelector('#phone');
      const message = form.querySelector('#message');
      let valid = true;
  
      // Clear all errors first
      [name, email, phone, message].forEach(clearError);
  
      // Required checks
      [name, email, phone, message].forEach(field => {
        if (!field.value.trim()) {
          showError(field, 'This field is required.');
          valid = false;
        }
      });
  
      // Format checks (only if value present)
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
      }
  
      if (phone.value.trim() && !/^[+\d\s\-()\u00A0]{7,20}$/.test(phone.value)) {
        showError(phone, 'Please enter a valid phone number.');
        valid = false;
      }
  
      if (!valid) {
        // Move focus to the first field with an error
        const firstError = form.querySelector('.contact-input.border-red-400');
        firstError?.focus();
        return;
      }
  
      // Submit to Formspree
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
  
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
  
        if (response.ok) {
          if (successMsg) {
            successMsg.classList.remove('hidden');
            setTimeout(() => successMsg.classList.add('hidden'), 6000);
          }
          form.reset();
        } else {
          alert("Something went wrong sending your message. Please try emailing directly instead.");
        }
      } catch (err) {
        alert("Something went wrong sending your message. Please try emailing directly instead.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
  
  /* ── Typed role animation ─────────────────────────────────── */
  function initTypedRole() {
    const el   = document.getElementById('typed-role');
    if (!el) return;

    const roles = [
      'Full-Stack Developer',
      'AI Enthusiast',
      'Hackathon Finalist',
      'DSA Enthusiast',
      'PICT Student',
    ];

    const typeSpeed   = 100;  // ms per char – typing
    const deleteSpeed = 55;   // ms per char – deleting
    const pauseEnd    = 1200; // pause after a full word before deleting
    const pauseStart  = 500;  // pause after deleting before typing next word

    let roleIdx   = 0;
    let charIdx   = 0;
    let phase     = 'typing'; // typing | pause | deleting | idle
    let timeoutId = null;

    function tick() {
      const current = roles[roleIdx];

      if (phase === 'typing') {
        // ---- type one character ----
        if (charIdx < current.length) {
          charIdx++;
          el.textContent = current.slice(0, charIdx);
          timeoutId = setTimeout(tick, typeSpeed);
        } else {
          // ---- fully typed – pause then delete ----
          phase = 'pause';
          timeoutId = setTimeout(tick, pauseEnd);
        }
      } else if (phase === 'pause') {
        // ---- start deleting ----
        phase = 'deleting';
        tick();
      } else if (phase === 'deleting') {
        // ---- delete one character ----
        if (charIdx > 0) {
          charIdx--;
          el.textContent = current.slice(0, charIdx);
          timeoutId = setTimeout(tick, deleteSpeed);
        } else {
          // ---- done deleting – next role ----
          phase = 'idle';
          roleIdx = (roleIdx + 1) % roles.length;
          timeoutId = setTimeout(tick, pauseStart);
        }
      } else {
        // ---- idle – start typing next word ----
        phase = 'typing';
        tick();
      }
    }

    // Kick off the loop
    tick();
  }

  function showError(field, message) {
    field.classList.add('border-red-400', '!border-red-400');
    // Use the element whose id matches field.id + '-error'
    const errorEl = document.getElementById(`${field.id}-error`)
                    ?? field.parentElement.querySelector('.field-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }
  
  function clearError(field) {
    field.classList.remove('border-red-400', '!border-red-400');
    const errorEl = document.getElementById(`${field.id}-error`)
                    ?? field.parentElement.querySelector('.field-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }