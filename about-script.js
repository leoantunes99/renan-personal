// about-script.js - COPIADO E ADAPTADO DO script.js DO INDEX.HTML

document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.getElementById('primary-navigation');
  const header = document.querySelector('header');
  const body = document.body;

  if (!btn || !nav || !header) return;

  // cria overlay dinamicamente
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

  // Fecha ao clicar em um link (útil em dispositivos móveis)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth < 1024 && nav.getAttribute('data-visible') === 'true') {
        closeMenu();
      }
    });
  });

  // Fecha ao clicar no overlay
  overlay.addEventListener('click', () => {
    if (nav.getAttribute('data-visible') === 'true') closeMenu();
  });

  // Fecha ao clicar fora do menu (clique em documento)
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !btn.contains(e.target) && nav.getAttribute('data-visible') === 'true') {
      closeMenu();
    }
  });

  // Fecha com Esc
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

revelar.reveal('.hidden-hero-minititle',
  {
    duration: 1000,
    distance: '50px'
  })

revelar.reveal('.hidden-hero-title',
  {
    duration: 1000,
    distance: '50px',
    delay: 150
  })

revelar.reveal('.hidden-hero-description',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

// STORY

revelar.reveal('.hidden-story-img',
  {
    duration: 1000,
    distance: '100px',
    delay: 300,
    origin: 'left'
  })

revelar.reveal('.hidden-story-title',
  {
    duration: 1000,
    distance: '50px',
    origin: 'right',
    delay: 150
  })

revelar.reveal('.hidden-story-text1',
  {
    duration: 1000,
    distance: '50px',
    origin: 'right',
    delay: 300
  })

revelar.reveal('.hidden-story-text2',
  {
    duration: 1000,
    distance: '50px',
    origin: 'right',
    delay: 450
  })

revelar.reveal('.hidden-story-text3',
  {
    duration: 1000,
    distance: '50px',
    origin: 'right',
    delay: 600
  })

// COMPETITION

revelar.reveal('.hidden-competition-img',
  {
    duration: 1000,
    distance: '100px',
    delay: 300,
    origin: 'right'
  })

revelar.reveal('.hidden-competition-title',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    delay: 150
  })

revelar.reveal('.hidden-competition-text1',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    delay: 300
  })

revelar.reveal('.hidden-competition-text2',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    delay: 450
  })

revelar.reveal('.hidden-competition-card1',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    delay: 750
  })

revelar.reveal('.hidden-competition-card2',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    delay: 600
  })

// PILLARS

revelar.reveal('.hidden-pillars-title',
  {
    duration: 1000,
    distance: '50px',
  })

revelar.reveal('.hidden-pillars-description',
  {
    duration: 1000,
    distance: '50px',
    delay: 150
  })

revelar.reveal('.hidden-pillars-card1',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

revelar.reveal('.hidden-pillars-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 450
  })

revelar.reveal('.hidden-pillars-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 600
  })

// mobile

revelar.reveal('.hidden-pillars-card1',
  {
    duration: 1000,
    distance: '50px',
    delay: 300,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-pillars-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 450,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-pillars-card3',
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
    distance: '50px',
  })

revelar.reveal('.hidden-cta-text',
  {
    duration: 1000,
    distance: '50px',
    delay: 150
  })

revelar.reveal('.hidden-cta-btn1',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

revelar.reveal('.hidden-cta-btn2',
  {
    duration: 1000,
    distance: '50px',
    delay: 450
  })