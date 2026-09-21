(() => {
  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  const getSavedTheme = () => {
    try { return localStorage.getItem('portfolio-theme'); } catch { return null; }
  };

  const applyTheme = (theme) => {
    const resolved = theme || (systemTheme.matches ? 'dark' : 'light');
    root.dataset.theme = resolved;
    themeToggle?.setAttribute('aria-label', resolved === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  };

  applyTheme(getSavedTheme());

  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('portfolio-theme', next); } catch { /* Storage may be unavailable. */ }
  });

  systemTheme.addEventListener?.('change', () => {
    if (!getSavedTheme()) applyTheme(null);
  });

  const closeMenu = () => {
    body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = body.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 1020) closeMenu(); });

  const updateHeader = () => siteHeader?.classList.toggle('scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px' });
    reveals.forEach((element) => revealObserver.observe(element));
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  let navFrameRequested = false;
  const updateActiveNav = () => {
    const marker = Math.min(180, window.innerHeight * 0.3);
    const current = sections.find((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= marker && bounds.bottom > marker;
    });

    navLinks.forEach((link) => {
      const active = Boolean(current) && link.getAttribute('href') === `#${current.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    navFrameRequested = false;
  };

  window.addEventListener('scroll', () => {
    if (navFrameRequested) return;
    navFrameRequested = true;
    window.requestAnimationFrame(updateActiveNav);
  }, { passive: true });
  updateActiveNav();

  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
