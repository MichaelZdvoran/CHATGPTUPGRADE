const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a, .site-footer a[href^="#"]');
const sections = document.querySelectorAll('.section-reveal');
const form = document.getElementById('contact-form');
const yearSpan = document.getElementById('year');

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nav?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', false);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach((section) => observer.observe(section));

const validators = {
  name: (value) => value.trim().length >= 2 || 'Please enter your name.',
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Please enter a valid email address.',
  message: (value) => value.trim().length >= 10 || 'Message should be at least 10 characters.'
};

const setError = (field, message = '') => {
  const errorEl = document.getElementById(`${field}-error`);
  const input = document.getElementById(field);
  if (!errorEl || !input) return;

  errorEl.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
};

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let valid = true;
    Object.keys(validators).forEach((field) => {
      const input = document.getElementById(field);
      if (!input) return;
      const result = validators[field](input.value);
      const errorMessage = result === true ? '' : result;
      setError(field, errorMessage);
      if (errorMessage) valid = false;
    });

    const successMessage = document.getElementById('form-success');
    if (!successMessage) return;

    if (!valid) {
      successMessage.textContent = '';
      return;
    }

    successMessage.textContent = 'Thanks! Your message is ready to send. I will reply within 24 hours.';
    form.reset();
    Object.keys(validators).forEach((field) => setError(field, ''));
  });
}
