document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.getElementById('primary-navigation');
  const header = document.querySelector('header');
  const body = document.body;

  if (!btn || !nav || !header) return;

  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  body.appendChild(overlay);

  const main = document.getElementById('main-content');

  function closeMenu() {
    nav.setAttribute('data-visible', 'false');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
    header.classList.remove('nav-open');
    body.classList.remove('no-scroll');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (main) main.classList.remove('blurred');
    const icon = btn.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = 'menu';
  }

  function openMenu() {
    nav.setAttribute('data-visible', 'true');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fechar menu');
    header.classList.add('nav-open');
    body.classList.add('no-scroll');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    if (main) main.classList.add('blurred');
    const icon = btn.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = 'close';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.getAttribute('data-visible') === 'true';
    if (isOpen) closeMenu(); else openMenu();
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth < 1024 && nav.getAttribute('data-visible') === 'true') {
        closeMenu();
      }
    });
  });

  overlay.addEventListener('click', () => {
    if (nav.getAttribute('data-visible') === 'true') closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !btn.contains(e.target) && nav.getAttribute('data-visible') === 'true') {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.getAttribute('data-visible') === 'true') {
      closeMenu();
      btn.focus();
    }
  });

  // --- NAVBAR HIDE/SHOW ON SCROLL (CORRIGIDO) ---
  // Muda position para fixed temporariamente
  header.style.position = 'fixed';
  header.style.width = '100%';

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    const currentScrollY = window.scrollY;

    // Se rolar mais de 100px para baixo, esconde o navbar
    if (currentScrollY > 100 && currentScrollY > lastScrollY) {
      header.style.transform = 'translateY(-100%)';
    } else {
      // Ao rolar para cima, mostra o navbar
      header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
});

// Scroll Reveal

window.revelar = ScrollReveal({ reset: true });

// HERO

revelar.reveal('.hidden-hero-title',
  {
    duration: 1000,
    distance: '50px'
  })

revelar.reveal('.hidden-hero-subtitle',
  {
    duration: 1000,
    distance: '50px',
    delay: 150
  })

revelar.reveal('.hidden-hero-btn',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

// STATS

revelar.reveal('.hidden-stats-card1',
  {
    duration: 1000,
    distance: '50px'
  })

revelar.reveal('.hidden-stats-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 150
  })

revelar.reveal('.hidden-stats-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

// mobile

revelar.reveal('.hidden-stats-card1',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-stats-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 150,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-stats-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 300,
    origin: 'left',
    desktop: false
  })

// RESULTS

revelar.reveal('.hidden-results-title',
  {
    duration: 1000,
    distance: '50px',
    origin: 'right'
  })

revelar.reveal('.hidden-results-subtitle',
  {
    duration: 1000,
    distance: '50px',
    delay: 150,
    origin: 'right'
  })

revelar.reveal('.hidden-results-card1',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

revelar.reveal('.hidden-results-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 450
  })

revelar.reveal('.hidden-results-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 600
  })

revelar.reveal('.hidden-results-card4',
  {
    duration: 1000,
    distance: '50px',
    delay: 750
  })

revelar.reveal('.hidden-results-card5',
  {
    duration: 1000,
    distance: '50px',
    delay: 900
  })

revelar.reveal('.hidden-results-card6',
  {
    duration: 1000,
    distance: '50px',
    delay: 1050
  })

// mobile

revelar.reveal('.hidden-results-card1',
  {
    duration: 1000,
    distance: '50px',
    delay: 300,
    origin: 'right',
    desktop: false
  })

revelar.reveal('.hidden-results-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 450,
    origin: 'right',
    desktop: false
  })

revelar.reveal('.hidden-results-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 600,
    origin: 'right',
    desktop: false
  })

revelar.reveal('.hidden-results-card4',
  {
    duration: 1000,
    distance: '50px',
    delay: 750,
    origin: 'right',
    desktop: false
  })

revelar.reveal('.hidden-results-card5',
  {
    duration: 1000,
    distance: '50px',
    delay: 900,
    origin: 'right',
    desktop: false
  })

revelar.reveal('.hidden-results-card6',
  {
    duration: 1000,
    distance: '50px',
    delay: 1050,
    origin: 'right',
    desktop: false
  })

// TESTIMONIALS

revelar.reveal('.hidden-testimonials-title',
  {
    duration: 1000,
    distance: '50px'
  })

revelar.reveal('.hidden-testimonials-subtitle',
  {
    duration: 1000,
    distance: '50px',
    delay: 150
  })

revelar.reveal('.hidden-testimonials-card1',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

revelar.reveal('.hidden-testimonials-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 450
  })

revelar.reveal('.hidden-testimonials-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 600
  })

// mobile

revelar.reveal('.hidden-testimonials-title',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-testimonials-subtitle',
  {
    duration: 1000,
    distance: '50px',
    delay: 150,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-testimonials-card1',
  {
    duration: 1000,
    distance: '50px',
    delay: 300,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-testimonials-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 450,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-testimonials-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 600,
    origin: 'left',
    desktop: false
  })

// CTA

revelar.reveal('.hidden-cta-title',
  {
    duration: 1000,
    distance: '50px'
  })

revelar.reveal('.hidden-cta-text',
  {
    duration: 1000,
    distance: '50px',
    delay: 150
  })

revelar.reveal('.hidden-cta-btn',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })