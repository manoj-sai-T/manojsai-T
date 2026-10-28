(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================================
  // CONTACT FORM → GOOGLE SHEETS
  // =========================================================

  const CONTACT_ENDPOINT =
    'https://script.google.com/macros/s/AKfycbxxgVhvZOk8Wqsrf_y8MSy1ZYKWMffrtmCLkUsiqNhL3Xz39mSju905dhM8LmAeWsi5/exec';

  const contactForm = document.getElementById('contact-form');
  const contactButton = document.getElementById('contact-submit');
  const formStatus = document.getElementById('form-status');

  if (contactForm && contactButton) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();

      const name = contactForm.elements.name.value.trim();
      const email = contactForm.elements.email.value.trim();
      const message = contactForm.elements.message.value.trim();

      if (!name || !email || !message) return;

      const buttonText = contactButton.querySelector('.button-text');
      const buttonArrow = contactButton.querySelector('.button-arrow');

      // Loading state
      contactButton.disabled = true;

      if (buttonText) buttonText.textContent = 'Sending...';
      if (buttonArrow) buttonArrow.textContent = '◌';

      if (formStatus) {
        formStatus.textContent = 'TRANSMITTING MESSAGE...';
        formStatus.className = 'form-status sending';
      }

      try {
        await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({
            name,
            email,
            message
          })
        });

        // Google Apps Script receives the request successfully.
        contactForm.reset();

        if (buttonText) buttonText.textContent = 'Message sent';
        if (buttonArrow) buttonArrow.textContent = '✓';

        if (formStatus) {
          formStatus.textContent =
            "MESSAGE RECEIVED — I'll get back to you soon.";
          formStatus.className = 'form-status success';
        }

      } catch (error) {
        console.error('Contact form error:', error);

        if (buttonText) buttonText.textContent = 'Try again';
        if (buttonArrow) buttonArrow.textContent = '↗';

        if (formStatus) {
          formStatus.textContent =
            'TRANSMISSION FAILED — Please try again.';
          formStatus.className = 'form-status error';
        }

      } finally {
        setTimeout(() => {
          contactButton.disabled = false;

          if (buttonText && buttonText.textContent !== 'Message sent') {
            buttonText.textContent = 'Send message';
          }

          if (buttonArrow && buttonArrow.textContent !== '✓') {
            buttonArrow.textContent = '↗';
          }
        }, 3500);
      }
    });
  }

  // Opening cinematic: Developer's Mind
  const curtain = document.getElementById('curtain');
  const curtainProgress = document.getElementById('curtainProgress');
  const curtainStatus = document.getElementById('curtainStatus');
  let introStart = performance.now();
  const introDuration = 2600;
  const dismissCurtain = () => curtain && curtain.classList.add('hide');
  const introLoop = now => {
    const progress = Math.min(1, (now - introStart) / introDuration);
    if (curtainProgress) curtainProgress.style.width = `${Math.round(progress * 100)}%`;
    if (curtainStatus) curtainStatus.textContent = `LOADING ${Math.round(progress * 100)}%`;
    if (progress < 1 && curtain && !curtain.classList.contains('hide')) requestAnimationFrame(introLoop);
  };
  requestAnimationFrame(introLoop);
  window.addEventListener('load', () => setTimeout(dismissCurtain, 2550));
  setTimeout(dismissCurtain, 4200);

  if (reduce) {
    document.querySelectorAll('.reveal-group,.reveal-on-scroll').forEach(el => el.classList.add('in-view'));
    return;
  }

  // Scroll progress
  const progress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  };

  // Cursor light
  const glow = document.getElementById('cursorGlow');
  let mouseX = innerWidth / 2, mouseY = innerHeight / 2, gx = mouseX, gy = mouseY;
  addEventListener('pointermove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  const cursorLoop = () => {
    gx += (mouseX - gx) * .09;
    gy += (mouseY - gy) * .09;
    if (glow) {
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
    }
    requestAnimationFrame(cursorLoop);
  };
  cursorLoop();

  // Hero cursor parallax
  const hero = document.querySelector('.hero');
  const heroGlow = document.getElementById('heroGlow');
  if (hero && heroGlow) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      heroGlow.style.transform = `translate(calc(-50% + ${x * 42}px), calc(-50% + ${y * 42}px))`;
    });
    hero.addEventListener('pointerleave', () => heroGlow.style.transform = 'translate(-50%,-50%)');
  }

  // Intersection reveals
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.classList.contains('reveal-group')) observer.unobserve(entry.target);
      }
    });
  }, { threshold: .16, rootMargin: '0px 0px -70px 0px' });

  document.querySelectorAll('.reveal-group,.reveal-on-scroll').forEach(el => observer.observe(el));

  // Active navigation based on section position
  const links = [...document.querySelectorAll('.topbar nav a')];
  const sections = [...document.querySelectorAll('header[id],section[id]')];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-42% 0px -48% 0px' });
  sections.forEach(s => navObserver.observe(s));

  // Smooth scroll with header offset
  links.forEach(link => link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  // Scroll cinematic parallax
  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  let ticking = false;
  const render = () => {
    const vh = innerHeight;
    parallaxItems.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const amount = Number(el.dataset.parallax || 0);
      const center = rect.top + rect.height / 2;
      const offset = (vh / 2 - center) * amount;
      el.style.transform = `translate3d(0,${offset.toFixed(1)}px,0)`;
    });
    updateProgress();
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(render);
      ticking = true;
    }
  }, { passive: true });
  addEventListener('resize', updateProgress);
  render();

  // Magnetic buttons
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * .14;
      const y = (e.clientY - r.top - r.height / 2) * .14;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('pointerleave', () => btn.style.transform = '');
  });

  // Card tilt
  document.querySelectorAll('.project-card,.panel,.cert-card,.service').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  // Add a subtle depth shift to sections while scrolling
  const cinematicSections = [...document.querySelectorAll('.cinematic-section')];
  const sectionLoop = () => {
    cinematicSections.forEach(section => {
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const progress = (innerHeight - r.top) / (innerHeight + r.height);
      section.style.setProperty('--section-progress', progress.toFixed(3));
    });
    requestAnimationFrame(sectionLoop);
  };
  sectionLoop();
})();
