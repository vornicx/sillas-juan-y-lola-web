(() => {
  const cards = [...document.querySelectorAll('[data-catalog-card]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const countNodes = [...document.querySelectorAll('[data-selection-count]')];
  const quoteLinks = [...document.querySelectorAll('[data-quote-link]')];
  const storageKey = 'juan-lola-selection';
  const maxAge = 30 * 24 * 60 * 60 * 1000;
  let selected = [];

  function functionalAllowed() {
    return Boolean(window.JuanLolaConsent?.has('functional'));
  }

  function readSavedSelection() {
    if (!functionalAllowed()) return [];
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (!saved || !Array.isArray(saved.items) || typeof saved.savedAt !== 'number') return [];
      if (Date.now() - saved.savedAt > maxAge) {
        localStorage.removeItem(storageKey);
        return [];
      }
      return saved.items;
    } catch {
      return [];
    }
  }

  selected = readSavedSelection().filter((id) => cards.some((card) => card.dataset.id === id));

  function selectedNames() {
    return cards.filter((card) => selected.includes(card.dataset.id)).map((card) => card.dataset.name);
  }

  function quoteUrl() {
    const names = selectedNames();
    const text = [
      'Hola, me gustaría consultar disponibilidad y pedir presupuesto para estas colecciones:',
      '',
      ...names.map((name) => `• ${name}`),
      '',
      'Fecha del evento:',
      'Localidad:',
      'Número de invitados:',
      '',
      'También necesito (sillas, mesas, menaje u otro material):'
    ].join('\n');
    return `https://wa.me/34659455344?text=${encodeURIComponent(text)}`;
  }

  function persist() {
    try {
      if (functionalAllowed()) {
        localStorage.setItem(storageKey, JSON.stringify({ items: selected, savedAt: Date.now() }));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch { /* selection still works during this page view */ }
  }

  function sync() {
    persist();
    countNodes.forEach((node) => { node.textContent = String(selected.length); });
    cards.forEach((card) => {
      const active = selected.includes(card.dataset.id);
      const button = card.querySelector('[data-add]');
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? '✓ En mi lista' : '+ Añadir a mi lista';
    });
    quoteLinks.forEach((link) => {
      const disabled = selected.length === 0;
      link.classList.toggle('is-disabled', disabled);
      link.setAttribute('aria-disabled', String(disabled));
      link.href = disabled ? '#' : quoteUrl();
      link.tabIndex = disabled ? -1 : 0;
    });
  }

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const family = filter.dataset.filter;
      filters.forEach((node) => {
        const active = node === filter;
        node.classList.toggle('is-active', active);
        node.setAttribute('aria-pressed', String(active));
      });
      cards.forEach((card) => { card.hidden = family !== 'Todo' && card.dataset.family !== family; });
    });
  });

  cards.forEach((card) => {
    card.querySelector('[data-add]').addEventListener('click', () => {
      const id = card.dataset.id;
      selected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
      sync();
    });
  });

  quoteLinks.forEach((link) => link.addEventListener('click', (event) => { if (selected.length === 0) event.preventDefault(); }));

  window.addEventListener('juanlola:consentchange', (event) => {
    if (event.detail?.functional) {
      persist();
    } else {
      try { localStorage.removeItem(storageKey); } catch { /* noop */ }
    }
  });

  sync();
})();
