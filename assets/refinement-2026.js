(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pathname = window.location.pathname;
  const onContact = pathname.startsWith('/contacto');
  const dock = document.createElement('nav');
  dock.className = 'mobile-conversion';
  dock.setAttribute('aria-label', 'Acciones rápidas');

  if (onContact) {
    dock.innerHTML = `
      <a href="tel:+34955905064">Llamar</a>
      <a href="https://wa.me/34659455344?text=Hola%2C%20quiero%20pedir%20presupuesto%20para%20un%20evento." target="_blank" rel="noreferrer">WhatsApp</a>
    `;
  } else {
    dock.innerHTML = `
      <a href="/catalogo/">Catálogo</a>
      <a href="/contacto/">Pedir presupuesto</a>
    `;
  }
  document.body.appendChild(dock);

  if (reducedMotion || !('IntersectionObserver' in window)) return;

  const candidates = document.querySelectorAll([
    '.home-v2-intro',
    '.home-v2-numbers',
    '.home-v2-catalog-head',
    '.home-v2-editorial-card',
    '.home-v2-services-head',
    '.home-v2-service-list article',
    '.home-v2-gallery-copy',
    '.home-v2-gallery-images',
    '.home-v2-faq',
    '.about-copy',
    '.about-images',
    '.gallery-grid figure',
    '.contact-details',
    '.contact-form',
    '.catalog-v2-summary',
    '.catalog-v2-chair-index',
    '.catalog-v2-card'
  ].join(','));

  candidates.forEach((element, index) => {
    element.classList.add('archic-reveal');
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  candidates.forEach((element) => observer.observe(element));
})();
