// ── Mobile menu toggle ──────────────────────────────
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

if (menuToggle && mobileMenu) {
  mobileMenu.classList.add('hidden');
  menuToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden');
    iconClose.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close mobile menu after tapping a link
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Scroll reveal animations ────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ── Active nav link highlighting ────────────────────
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('text-white', link.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((section) => navObserver.observe(section));
}

// ── Contact form: client-side validation + Formspree submit ──
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

if (form) {
  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('name-error') },
    email: { el: document.getElementById('email'), error: document.getElementById('email-error') },
    phone: { el: document.getElementById('phone'), error: document.getElementById('phone-error') },
    message: { el: document.getElementById('message'), error: document.getElementById('message-error') },
  };

  function validate() {
    let isValid = true;

    if (!fields.name.el.value.trim()) {
      fields.name.error.textContent = 'Please enter your name.';
      fields.name.error.classList.remove('hidden');
      isValid = false;
    } else {
      fields.name.error.classList.add('hidden');
    }

    const emailVal = fields.email.el.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      fields.email.error.textContent = 'Please enter a valid email address.';
      fields.email.error.classList.remove('hidden');
      isValid = false;
    } else {
      fields.email.error.classList.add('hidden');
    }

    if (!fields.phone.el.value.trim()) {
      fields.phone.error.textContent = 'Please enter a phone number.';
      fields.phone.error.classList.remove('hidden');
      isValid = false;
    } else {
      fields.phone.error.classList.add('hidden');
    }

    if (!fields.message.el.value.trim()) {
      fields.message.error.textContent = 'Please write a message.';
      fields.message.error.classList.remove('hidden');
      isValid = false;
    } else {
      fields.message.error.classList.add('hidden');
    }

    return isValid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert("Something went wrong sending your message. Please try emailing directly instead.");
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      alert("Something went wrong sending your message. Please try emailing directly instead.");
    }
  });
}
