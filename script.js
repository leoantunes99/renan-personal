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

  header.style.position = 'fixed';
  header.style.width = '100%';

  // --- NAVBAR HIDE/SHOW ON SCROLL ---
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100 && currentScrollY > lastScrollY) {
      header.style.transform = 'translateY(-100%)';
    } else {
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
    if (window.innerWidth >= 1024) return;
    if (resultsScroll.classList.contains('slider')) return;

    const slides = Array.from(resultsScroll.querySelectorAll('.result-card'));
    if (slides.length < 2) return;2

    resultsScroll.classList.add('slider');
    const track = document.createElement('div');
    track.className = 'results-track';

    slides.forEach(s => track.appendChild(s));
    resultsScroll.appendChild(track);

    const firstClone = track.children[0].cloneNode(true);
    const lastClone = track.children[track.children.length - 1].cloneNode(true);
    track.insertBefore(lastClone, track.children[0]);
    track.appendChild(firstClone);

    let index = 1;
    let isDragging = false;
    let startX = 0;
    let prevTranslate = 0; 
    let currentTranslate = 0;
    let trackPadding = parseFloat(getComputedStyle(track).paddingLeft) || 0;

    function recalc() {
      trackPadding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    }

    function getTargetForIndex(i) {
      const el = track.children[i];
      return el.offsetLeft - trackPadding;
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
      track.style.transform = `translateX(${prevTranslate + diff}px)`;
    }

    function pointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      resultsScroll.classList.remove('dragging');
      const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const diff = endX - startX;
      const threshold = 50;
      if (diff < -threshold) moveToNext();
      else if (diff > threshold) moveToPrev();
      else setPosition(index, true);
    }

    recalc();
    setPosition(1, false);

    window.addEventListener('resize', () => { recalc(); setPosition(index, false); });

    track.addEventListener('pointerdown', pointerDown, { passive: true });
    window.addEventListener('pointermove', pointerMove, { passive: true });
    window.addEventListener('pointerup', pointerUp);

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
      dot.dataset.index = i + 1;
      dot.addEventListener('click', () => {
        setPosition(i + 1, true);
      });
      dotsWrapper.appendChild(dot);
    }

    const btnResultsEl = resultsScroll.parentNode.querySelector('.btn-results');
    if (btnResultsEl) resultsScroll.parentNode.insertBefore(dotsWrapper, btnResultsEl);
    else resultsScroll.parentNode.appendChild(dotsWrapper);

    function updateDots() {
      const active = ((index - 1 + slidesCount) % slidesCount);
      Array.from(dotsWrapper.children).forEach((d, i) => d.classList.toggle('active', i === active));
    }

    track.addEventListener('transitionend', () => { onTransitionEnd(); updateDots(); });

    updateDots();

    slider = {
      destroy: () => {
        track.removeEventListener('transitionend', onTransitionEnd);
        window.removeEventListener('resize', () => { recalc(); setPosition(index, false); });

        if (dotsWrapper && dotsWrapper.parentNode) dotsWrapper.parentNode.removeChild(dotsWrapper);

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

      answer.style.overflow = 'hidden';
      answer.style.transition = 'height 220ms ease, opacity 180ms ease, padding-bottom 180ms ease';
      answer.style.paddingBottom = item.open ? '1.25rem' : '0px';
      answer.style.opacity = item.open ? '1' : '0';
      answer.style.height = item.open ? 'auto' : '0px';

      function animateOpen() {
        faqItems.forEach(other => {
          if (other !== item && other.open) animateCloseAndCloseDetail(other);
        });

        const full = answer.scrollHeight;
        item.open = true;

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
          detailItem.open = false;
          ans.style.transition = '';
          ans.style.height = '0px';
          ans.removeEventListener('transitionend', fn);
        };
        ans.addEventListener('transitionend', fn);
      }

      item.addEventListener('toggle', () => {
        if (item.open) animateOpen();
        else {
          answer.style.height = '0px';
          answer.style.opacity = '0';
          answer.style.paddingBottom = '0px';
        }
      });

      summary.addEventListener('click', (e) => {
        if (item.open) {
          e.preventDefault();
          animateCloseAndCloseDetail(item);
        } else {
          faqItems.forEach(other => {
            if (other !== item && other.open) animateCloseAndCloseDetail(other);
          });
        }
      });

      summary.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && item.open) {
          e.preventDefault();
          animateCloseAndCloseDetail(item);
        }
      });
    });
  })();

});

// Altera o valor dos planos dependendo do período escolhido
 
const planos = {
  mensal: {
    sem: 169.90,
    com: 219.90,
    periodo: 'por mês'
  },
  trimestral: {
    sem: 449.90,
    com: 649.90,
    periodo: 'por trimestre'
  },
  semestral: {
    sem: 809.90,
    com: 1299.90,
    periodo: 'por semestre'
  }
};

const whatsappNumber = '5511981011022'; 

function updatePrices() {
  const periodo = document.getElementById('period').value;
  const plano = planos[periodo];

  document.getElementById('price-without').textContent =
    `R$${plano.sem.toFixed(2).replace('.', ',')}`;
  document.getElementById('price-with').textContent =
    `R$${plano.com.toFixed(2).replace('.', ',')}`;

  document.getElementById('period-without').textContent = plano.periodo;
  document.getElementById('period-with').textContent = plano.periodo;
}

function escolherPlano(tipo) {
  const periodo = document.getElementById('period').value;
  const plano = planos[periodo];
  const preco = tipo === 'sem' ? plano.sem : plano.com;
  const avaliacaoTexto = tipo === 'sem' ? 'sem avaliação física' : 'com avaliação física';

  const mensagem = `Olá, Renan! Tenho interesse no plano ${periodo} ${avaliacaoTexto} no valor de R$ ${preco.toFixed(2).replace('.', ',')}.`;

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;

  window.open(whatsappURL, '_blank');
}

updatePrices();


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

revelar.reveal('.hidden-about-btn',
  {
    duration: 1000,
    distance: '100px',
    origin: 'right',
    delay: 600
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

// PLANS

revelar.reveal('.hidden-plan-title',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left'
  })

revelar.reveal('.hidden-plan-subtitle',
  {
    duration: 1000,
    distance: '50px',
    origin: 'left',
    delay: 150
  })

revelar.reveal('.hidden-period-selector', 
  {
    duration: 1000,
    distance: '50px',
    origin: 'right',
  })

revelar.reveal('.hidden-plan-card1', 
  {
    duration: 1000,
    distance: '100px',
    origin: 'left',
    delay: 300
 })
 
revelar.reveal('.hidden-plan-card2', 
  {
    duration: 1000,
    distance: '100px',
    origin: 'right',
    delay: 300
 })
 
revelar.reveal('.hidden-divider', 
  {
    duration: 1000,
    distance: '50px',
    origin: 'bottom',
    delay: 300
})

// mobile

revelar.reveal('.hidden-plan-title',
  {
    duration: 1000,
    distance: '50px',
    origin: 'right',
    desktop: false
  })

revelar.reveal('.hidden-plan-subtitle',
  {
    duration: 1000,
    distance: '50px',
    origin: 'right',
    desktop: false
  })

revelar.reveal('.hidden-plan-card1', 
  {
    duration: 1000,
    distance: '100px',
    origin: 'right',
    delay: 300,
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

// mobile

revelar.reveal('.hidden-results-btn',
  {
    duration: 1000,
    distance: '50px',
    origin: 'bottom',
    desktop: false
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