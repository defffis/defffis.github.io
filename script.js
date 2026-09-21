const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');
const metaTheme = document.querySelector('meta[name="theme-color"]');
const storageKey = 'defffis-theme';
const mediaTheme = window.matchMedia('(prefers-color-scheme: dark)');

function storedTheme() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch (_) {
    return null;
  }
}

function preferredTheme() {
  return storedTheme() || (mediaTheme.matches ? 'dark' : 'light');
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (themeToggle) {
    const isEnglish = root.lang === 'en';
    const label = theme === 'dark'
      ? (isEnglish ? 'Light theme' : 'Светлая тема')
      : (isEnglish ? 'Dark theme' : 'Тёмная тема');
    themeToggle.textContent = label;
    themeToggle.setAttribute('aria-label', label);
  }
  metaTheme?.setAttribute('content', theme === 'dark' ? '#0c0e11' : '#f6f7f9');
}

applyTheme(preferredTheme());

themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(storageKey, next); } catch (_) {}
  applyTheme(next);
});

mediaTheme.addEventListener?.('change', (event) => {
  if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light');
});

menuToggle?.addEventListener('click', () => {
  if (!nav) return;
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? (root.lang === 'en' ? 'Close' : 'Закрыть') : (root.lang === 'en' ? 'Menu' : 'Меню');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = root.lang === 'en' ? 'Menu' : 'Меню';
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];
let ticking = false;

function updateScrollState() {
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
  if (sections.length && navLinks.length) {
    const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 260);
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= marker) current = section;
    });
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === '#' + current.id;
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth > 980 && nav) {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = root.lang === 'en' ? 'Menu' : 'Меню';
  }
});

document.querySelectorAll('[data-print]').forEach((button) => {
  button.addEventListener('click', () => window.print());
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
updateScrollState();
