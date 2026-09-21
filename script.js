const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');
const metaTheme = document.querySelector('meta[name="theme-color"]');
const storageKey = 'defffis-theme';

function preferredTheme() {
  const saved = localStorage.getItem(storageKey);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  const nextLabel = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
  themeToggle.textContent = nextLabel;
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  metaTheme.setAttribute('content', theme === 'dark' ? '#0c0e11' : '#f6f7f9');
}

applyTheme(preferredTheme());

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(storageKey, next);
  applyTheme(next);
});

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Закрыть' : 'Меню';
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Меню';
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(nav.querySelectorAll('a'));
let ticking = false;

function updateScrollState() {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
  const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 260);
  let current = sections[0];
  sections.forEach((section) => {
    if (section.offsetTop <= marker) current = section;
  });
  navLinks.forEach((link) => {
    const active = Boolean(current) && link.getAttribute('href') === '#' + current.id;
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Меню';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
updateScrollState();
