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

  const main = document.getElementById('main-content'); // conteúdo que será desfocado

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

  header.style.position = 'fixed';
  header.style.width = '100%';

  // --- NAVBAR HIDE/SHOW ON SCROLL ---
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

  // --- Swiper infinito para a seção de resultados (mobile) ---
  const resultsScroll = document.querySelector('.results-scroll');
  let slider = null;

  function initResultsSlider() {
    if (!resultsScroll) return;
    if (window.innerWidth >= 1024) return; // ativa apenas no mobile
    if (resultsScroll.classList.contains('slider')) return; // já inicializado

    const slides = Array.from(resultsScroll.querySelectorAll('.result-card'));
    if (slides.length < 2) return; // não precisa quando há menos de 2

    resultsScroll.classList.add('slider');
    const track = document.createElement('div');
    track.className = 'results-track';

    // mover slides para dentro do track
    slides.forEach(s => track.appendChild(s));
    resultsScroll.appendChild(track);

    // clones para efeito infinito
    const firstClone = track.children[0].cloneNode(true);
    const lastClone = track.children[track.children.length - 1].cloneNode(true);
    track.insertBefore(lastClone, track.children[0]);
    track.appendChild(firstClone);

    let index = 1; // começa no primeiro slide real
    let isDragging = false;
    let startX = 0;
    let prevTranslate = 0; // valor atual de translate (px)
    let currentTranslate = 0;
    let trackPadding = parseFloat(getComputedStyle(track).paddingLeft) || 0;

    function recalc() {
      trackPadding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    }

    function getTargetForIndex(i) {
      const el = track.children[i];
      return el.offsetLeft - trackPadding; // posiciona com o espaçamento à esquerda do track
    }

    function setTranslate(target, animate = true) {
      if (animate) track.style.transition = 'transform 300ms ease';
      else track.style.transition = 'none';
      track.style.transform = `translateX(${-target}px)`;
      currentTranslate = -target;
    }

    function setPosition(i, animate = true) {
      index = i;
      const target = getTargetForIndex(index);
      setTranslate(target, animate);
    }

    function moveToNext() { setPosition(index + 1); }
    function moveToPrev() { setPosition(index - 1); }

    function onTransitionEnd() {
      // quando estiver em clones, salta para o slide real sem transição
      track.style.transition = 'none';
      if (index === 0) {
        index = track.children.length - 2;
        const target = getTargetForIndex(index);
        track.style.transform = `translateX(${-target}px)`;
        currentTranslate = -target;
      } else if (index === track.children.length - 1) {
        index = 1;
        const target = getTargetForIndex(index);
        track.style.transform = `translateX(${-target}px)`;
        currentTranslate = -target;
      }
    }

    function pointerDown(e) {
      isDragging = true;
      startX = e.type.includes('mouse') ? e.pageX : (e.touches ? e.touches[0].clientX : e.clientX);
      prevTranslate = currentTranslate;
      track.style.transition = 'none';
      resultsScroll.classList.add('dragging');
    }

    function pointerMove(e) {
      if (!isDragging) return;
      const currentX = e.type.includes('mouse') ? e.pageX : (e.touches ? e.touches[0].clientX : e.clientX);
      const diff = currentX - startX;
      // prevTranslate é negativo; somamos diff para mover corretamente sem 'rebote' pra direita
      track.style.transform = `translateX(${prevTranslate + diff}px)`;
    }

    function pointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      resultsScroll.classList.remove('dragging');
      const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const diff = endX - startX;
      const threshold = 50; // pixels necessários para trocar de slide
      if (diff < -threshold) moveToNext();
      else if (diff > threshold) moveToPrev();
      else setPosition(index, true);
    }

    // inicializa posições
    recalc();
    setPosition(1, false);

    // listeners
    window.addEventListener('resize', () => { recalc(); setPosition(index, false); });

    track.addEventListener('pointerdown', pointerDown, { passive: true });
    window.addEventListener('pointermove', pointerMove, { passive: true });
    window.addEventListener('pointerup', pointerUp);

    // touch fallback
    track.addEventListener('touchstart', pointerDown, { passive: true });
    track.addEventListener('touchmove', pointerMove, { passive: true });
    track.addEventListener('touchend', pointerUp);

    // --- Dots (indicadores) ---
    const slidesCount = slides.length;
    const dotsWrapper = document.createElement('div');
    dotsWrapper.className = 'results-dots';

    for (let i = 0; i < slidesCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'result-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para resultado ${i + 1}`);
      dot.dataset.index = i + 1; // corresponde ao índice no track (1..n)
      dot.addEventListener('click', () => {
        setPosition(i + 1, true);
      });
      dotsWrapper.appendChild(dot);
    }

    // insere os dots antes do botão 'Ver mais resultados' (ficam acima do botão no mobile)
    const btnResultsEl = resultsScroll.parentNode.querySelector('.btn-results');
    if (btnResultsEl) resultsScroll.parentNode.insertBefore(dotsWrapper, btnResultsEl);
    else resultsScroll.parentNode.appendChild(dotsWrapper);

    function updateDots() {
      const active = ((index - 1 + slidesCount) % slidesCount);
      Array.from(dotsWrapper.children).forEach((d, i) => d.classList.toggle('active', i === active));
    }

    // atualiza dots na transição e ao inicializar
    track.addEventListener('transitionend', () => { onTransitionEnd(); updateDots(); });

    // marca o dot inicial
    updateDots();

    slider = {
      destroy: () => {
        track.removeEventListener('transitionend', onTransitionEnd);
        window.removeEventListener('resize', () => { recalc(); setPosition(index, false); });

        // remove os dots
        if (dotsWrapper && dotsWrapper.parentNode) dotsWrapper.parentNode.removeChild(dotsWrapper);

        // devolve os slides reais para o container original
        const realChildren = Array.from(track.children).slice(1, -1);
        realChildren.forEach(c => resultsScroll.appendChild(c));
        resultsScroll.removeChild(track);
        resultsScroll.classList.remove('slider');
        slider = null;
      }
    };
  }

  function destroyResultsSlider() { if (slider && typeof slider.destroy === 'function') slider.destroy(); }

  function handleResponsiveSlider() {
    if (window.innerWidth < 1024) initResultsSlider(); else destroyResultsSlider();
  }

  // inicializa no load e em resize
  handleResponsiveSlider();
  window.addEventListener('resize', () => {
    handleResponsiveSlider();
  });

  // FAQ: comportamento accordion com animação ao abrir/fechar
  (function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems || faqItems.length === 0) return;

    faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      const answer = item.querySelector('.faq-answer');
      if (!summary || !answer) return;

      // prepara estado inicial e estilos
      answer.style.overflow = 'hidden';
      answer.style.transition = 'height 220ms ease, opacity 180ms ease, padding-bottom 180ms ease';
      answer.style.paddingBottom = item.open ? '1.25rem' : '0px';
      answer.style.opacity = item.open ? '1' : '0';
      answer.style.height = item.open ? 'auto' : '0px';

      function animateOpen() {
        // fechar outros com animação
        faqItems.forEach(other => {
          if (other !== item && other.open) animateCloseAndCloseDetail(other);
        });

        const full = answer.scrollHeight;
        // garante que o detalhe esteja aberto para mostrar o conteúdo
        item.open = true;

        // força estado inicial (0) antes de animar
        answer.style.height = '0px';
        answer.style.opacity = '0';
        answer.style.paddingBottom = '0px';

        requestAnimationFrame(() => {
          answer.style.transition = 'height 260ms ease, opacity 200ms ease, padding-bottom 200ms ease';
          answer.style.height = full + 'px';
          answer.style.opacity = '1';
          answer.style.paddingBottom = '1.25rem';
        });

        const onEnd = function (e) {
          if (e.propertyName !== 'height') return;
          answer.style.height = 'auto';
          answer.removeEventListener('transitionend', onEnd);
        };
        answer.addEventListener('transitionend', onEnd);
      }

      function animateCloseAndCloseDetail(detailItem) {
        const ans = detailItem.querySelector('.faq-answer');
        if (!ans) { detailItem.open = false; return; }

        const full = ans.scrollHeight;
        // assegura altura atual antes de fechar
        ans.style.height = full + 'px';
        ans.style.opacity = '1';
        ans.style.paddingBottom = '1.25rem';

        requestAnimationFrame(() => {
          ans.style.transition = 'height 220ms ease, opacity 180ms ease, padding-bottom 180ms ease';
          ans.style.height = '0px';
          ans.style.opacity = '0';
          ans.style.paddingBottom = '0px';
        });

        const fn = function (e) {
          if (e.propertyName !== 'height') return;
          // agora fecha realmente o detalhe
          detailItem.open = false;
          ans.style.transition = '';
          ans.style.height = '0px';
          ans.removeEventListener('transitionend', fn);
        };
        ans.addEventListener('transitionend', fn);
      }

      // quando o detalhe muda de estado por outros meios (ex.: programaticamente)
      item.addEventListener('toggle', () => {
        if (item.open) animateOpen();
        else {
          // se fechou programaticamente, garante estado visual fechado
          answer.style.height = '0px';
          answer.style.opacity = '0';
          answer.style.paddingBottom = '0px';
        }
      });

      // intercepta clique no summary para animar o fechamento (mantendo acessibilidade)
      summary.addEventListener('click', (e) => {
        if (item.open) {
          e.preventDefault(); // evita fechamento instantâneo
          animateCloseAndCloseDetail(item);
        } else {
          // abrindo: fecha outros com animação
          faqItems.forEach(other => {
            if (other !== item && other.open) animateCloseAndCloseDetail(other);
          });
          // deixe o toggle padrão abrir e o listener 'toggle' fará a animação de abertura
        }
      });

      // keyboard (Enter / Space) - captura para fechamento animado
      summary.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && item.open) {
          e.preventDefault();
          animateCloseAndCloseDetail(item);
        }
      });
    });
  })();

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

revelar.reveal('.hidden-hero-buttons',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

// METHOD

revelar.reveal('.hidden-method-minititle',
  {
    duration: 1000,
    distance: '50px',
    delay: 150
  })

revelar.reveal('.hidden-method-title',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

revelar.reveal('.hidden-method-description',
  {
    duration: 1000,
    distance: '50px',
    delay: 450
  })

revelar.reveal('.hidden-method-card1',
  {
    duration: 1000,
    distance: '50px',
    delay: 600,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-method-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 750,
    origin: 'left',
    desktop: false,
  })

revelar.reveal('.hidden-method-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 900,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-method-card1',
  {
    duration: 1000,
    distance: '50px',
    delay: 600
  })

revelar.reveal('.hidden-method-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 750
  })

revelar.reveal('.hidden-method-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 900
  })

// ABOUT 

revelar.reveal('.hidden-about-img',
  {
    duration: 2000,
    distance: '100px',
    origin: 'left',
    delay: 150
  })

revelar.reveal('.hidden-about-minititle',
  {
    duration: 1000,
    distance: '100px',
    origin: 'right',
    delay: 150
  })

revelar.reveal('.hidden-about-title',
  {
    duration: 1000,
    distance: '100px',
    origin: 'right',
    delay: 300
  })

revelar.reveal('.hidden-about-item1',
  {
    duration: 1000,
    distance: '100px',
    origin: 'right',
    delay: 400
  })

revelar.reveal('.hidden-about-item2',
  {
    duration: 1000,
    distance: '100px',
    origin: 'right',
    delay: 450
  })

revelar.reveal('.hidden-about-item3',
  {
    duration: 1000,
    distance: '100px',
    origin: 'right',
    delay: 500
  })

revelar.reveal('.hidden-about-item4',
  {
    duration: 1000,
    distance: '100px',
    origin: 'right',
    delay: 550
  })

// STEPS

revelar.reveal('.hidden-steps-title',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left'
  })

revelar.reveal('.hidden-steps-subtitle',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    delay: 150
  })

revelar.reveal('.hidden-steps-number1',
  {
    duration: 1000,
    distance: '50px',
    delay: 200
  })

revelar.reveal('.hidden-steps-title1',
  {
    duration: 1000,
    distance: '50px',
    delay: 300
  })

revelar.reveal('.hidden-steps-text1',
  {
    duration: 1000,
    distance: '50px',
    delay: 400
  })

revelar.reveal('.hidden-steps-number2',
  {
    duration: 1000,
    distance: '50px',
    delay: 400
  })

revelar.reveal('.hidden-steps-title2',
  {
    duration: 1000,
    distance: '50px',
    delay: 500
  })

revelar.reveal('.hidden-steps-text2',
  {
    duration: 1000,
    distance: '50px',
    delay: 600
  })

revelar.reveal('.hidden-steps-number3',
  {
    duration: 1000,
    distance: '50px',
    delay: 600
  })

revelar.reveal('.hidden-steps-title3',
  {
    duration: 1000,
    distance: '50px',
    delay: 700
  })

revelar.reveal('.hidden-steps-text3',
  {
    duration: 1000,
    distance: '50px',
    delay: 800
  })

// mobile

revelar.reveal('.hidden-steps-number1',
  {
    duration: 1000,
    distance: '50px',
    delay: 200,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-steps-title1',
  {
    duration: 1000,
    distance: '50px',
    delay: 300,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-steps-text1',
  {
    duration: 1000,
    distance: '50px',
    delay: 400,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-steps-number2',
  {
    duration: 1000,
    distance: '50px',
    delay: 400,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-steps-title2',
  {
    duration: 1000,
    distance: '50px',
    delay: 500,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-steps-text2',
  {
    duration: 1000,
    distance: '50px',
    delay: 600,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-steps-number3',
  {
    duration: 1000,
    distance: '50px',
    delay: 600,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-steps-title3',
  {
    duration: 1000,
    distance: '50px',
    delay: 700,
    origin: 'left',
    desktop: false
  })

revelar.reveal('.hidden-steps-text3',
  {
    duration: 1000,
    distance: '50px',
    delay: 800,
    origin: 'left',
    desktop: false
  })

// RESULTS

revelar.reveal('.hidden-results-title',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left'
  })

revelar.reveal('.hidden-results-subtitle',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    delay: 150
  })

revelar.reveal('.hidden-results-btn',
  {
    duration: 1000,
    distance: '50px',
    origin: 'right',
    delay: 300
  })

revelar.reveal('.hidden-results-card1',
  {
    duration: 1000,
    distance: '50px',
    delay: 350,
    mobile: false
  })

revelar.reveal('.hidden-results-card2',
  {
    duration: 1000,
    distance: '50px',
    delay: 450,
    mobile: false
  })

revelar.reveal('.hidden-results-card3',
  {
    duration: 1000,
    distance: '50px',
    delay: 550,
    mobile: false
  })

// FAQ

revelar.reveal('.hidden-faq-title',
  {
    duration: 1000,
    distance: '50px'
  })

revelar.reveal('.hidden-faq-item1',
  {
    duration: 1000,
    distance: '50px',
    delay: 150
  })

revelar.reveal('.hidden-faq-item2',
  {
    duration: 1000,
    distance: '50px',
    delay: 250
  })

revelar.reveal('.hidden-faq-item3',
  {
    duration: 1000,
    distance: '50px',
    delay: 350
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