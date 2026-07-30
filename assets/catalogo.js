(() => {
  const cards = [...document.querySelectorAll('[data-catalog-card]')];
  if (!cards.length) return;

  const filters = [...document.querySelectorAll('[data-filter]')];
  const searchInput = document.querySelector('[data-catalog-search]');
  const resultCount = document.querySelector('[data-result-count]');
  const emptyMessage = document.querySelector('[data-catalog-empty]');
  const countNodes = [...document.querySelectorAll('[data-selection-count]')];
  const quoteLinks = [...document.querySelectorAll('[data-quote-link]')];
  const dialog = document.querySelector('[data-catalog-dialog]');
  const dialogImage = dialog?.querySelector('[data-dialog-image]');
  const dialogTitle = dialog?.querySelector('[data-dialog-title]');
  const dialogIndex = dialog?.querySelector('[data-dialog-index]');
  const dialogThumbnails = dialog?.querySelector('[data-dialog-thumbnails]');
  const dialogAdd = dialog?.querySelector('[data-dialog-add]');
  const dialogWhatsapp = dialog?.querySelector('[data-dialog-whatsapp]');
  const storageKey = 'juan-lola-selection';
  const maxAge = 30 * 24 * 60 * 60 * 1000;
  const collectionTags = {
    'venecia-oro': ['claras', 'estampadas'],
    'venecia-maquillaje': ['rosas'],
    espiral: ['claras', 'estampadas'],
    'venecia-azul': ['azules'],
    versalles: ['claras', 'estampadas'],
    'geometrico-rosa': ['rosas', 'estampadas'],
    triana: ['claras', 'estampadas'],
    'adan-rosa': ['rosas', 'estampadas'],
    'venecia-buganvilla': ['rosas'],
    real: ['rosas', 'estampadas'],
    genil: ['claras', 'estampadas'],
    'vichy-camel': ['claras', 'estampadas'],
    'cartuja-azul': ['azules', 'estampadas'],
    'cartuja-burdeos': ['rosas', 'estampadas'],
    romantica: ['rosas', 'estampadas'],
    'flores-malva': ['rosas', 'estampadas'],
    tropical: ['azules', 'estampadas'],
    nazareno: ['rosas'],
    luna: ['oscuras'],
    mezquita: ['oscuras', 'estampadas'],
    'terciopelo-rosa': ['rosas'],
    'lino-blanco': ['claras'],
    alboran: ['azules', 'estampadas'],
    'lino-natural': ['claras'],
    mediterraneo: ['azules'],
    'venecia-lino': ['claras'],
    pino: ['claras']
  };
  let selected = [];
  let activeFilter = 'all';
  let activeCard = null;
  let activeImage = 0;
  let opener = null;

  function normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function imagePaths(card) {
    const base = `/assets/images/catalogo-2021/${card.dataset.id}`;
    return [`${base}.jpg`, `${base}-2.jpg`, `${base}-3.jpg`];
  }

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
    const text = [
      'Hola, me gustaría consultar disponibilidad y pedir presupuesto para estas colecciones:',
      '',
      ...selectedNames().map((name) => `• ${name}`),
      '',
      'Fecha del evento:',
      'Localidad:',
      'Número de invitados:',
      '',
      'También necesito (sillas, mesas, menaje u otro material):'
    ].join('\n');
    return `https://wa.me/34659455344?text=${encodeURIComponent(text)}`;
  }

  function singleCollectionUrl(name) {
    const text = [
      `Hola, me gustaría consultar la colección ${name}.`,
      '',
      'Fecha del evento:',
      'Localidad:',
      'Número de invitados:'
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
    } catch {
      /* La selección sigue disponible durante esta visita. */
    }
  }

  function updateSelectionButton(button, active, compact = false) {
    if (!button) return;
    button.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? '✓ En mi lista' : compact ? 'Añadir a mi lista' : '+ Añadir a mi lista';
  }

  function syncSelection() {
    persist();
    countNodes.forEach((node) => { node.textContent = String(selected.length); });
    cards.forEach((card) => {
      updateSelectionButton(card.querySelector('[data-add]'), selected.includes(card.dataset.id));
    });
    if (activeCard) {
      updateSelectionButton(dialogAdd, selected.includes(activeCard.dataset.id), true);
    }
    quoteLinks.forEach((link) => {
      const disabled = selected.length === 0;
      link.classList.toggle('is-disabled', disabled);
      link.setAttribute('aria-disabled', String(disabled));
      link.href = disabled ? '#' : quoteUrl();
      link.tabIndex = disabled ? -1 : 0;
    });
  }

  function toggleSelection(card) {
    const id = card.dataset.id;
    selected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    syncSelection();
  }

  function applyFilters() {
    const query = normalize(searchInput?.value || '');
    let visible = 0;
    cards.forEach((card) => {
      const matchesText = !query || normalize(`${card.dataset.name} ${card.dataset.id}`).includes(query);
      const matchesFilter = activeFilter === 'all' || collectionTags[card.dataset.id]?.includes(activeFilter);
      card.hidden = !(matchesText && matchesFilter);
      if (!card.hidden) visible += 1;
    });
    if (resultCount) resultCount.textContent = String(visible);
    if (emptyMessage) emptyMessage.hidden = visible !== 0;
  }

  function renderDialogImage() {
    if (!activeCard || !dialogImage) return;
    const paths = imagePaths(activeCard);
    dialogImage.src = paths[activeImage];
    dialogImage.alt = `${activeCard.dataset.name}: fotografía ${activeImage + 1} de ${paths.length}`;
    if (dialogIndex) dialogIndex.textContent = `${activeImage + 1} / ${paths.length}`;
    [...(dialogThumbnails?.querySelectorAll('button') || [])].forEach((button, index) => {
      const current = index === activeImage;
      button.classList.toggle('is-active', current);
      button.setAttribute('aria-pressed', String(current));
    });
  }

  function showImage(index) {
    if (!activeCard) return;
    const paths = imagePaths(activeCard);
    activeImage = (index + paths.length) % paths.length;
    renderDialogImage();
  }

  function openCollection(card, trigger) {
    if (!dialog || !dialogImage || !dialogTitle || !dialogThumbnails || !dialogWhatsapp) return;
    activeCard = card;
    activeImage = 0;
    opener = trigger;
    const paths = imagePaths(card);
    dialogTitle.textContent = card.dataset.name;
    dialogWhatsapp.href = singleCollectionUrl(card.dataset.name);
    dialogThumbnails.replaceChildren(...paths.map((path, index) => {
      const button = document.createElement('button');
      const image = document.createElement('img');
      button.type = 'button';
      button.setAttribute('aria-label', `Ver fotografía ${index + 1} de ${card.dataset.name}`);
      button.setAttribute('aria-pressed', String(index === 0));
      if (index === 0) button.classList.add('is-active');
      image.src = path;
      image.alt = '';
      button.append(image);
      button.addEventListener('click', () => showImage(index));
      return button;
    }));
    renderDialogImage();
    syncSelection();
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.classList.add('catalog-dialog-open');
  }

  function closeCollection() {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      resetDialogState();
    }
  }

  function resetDialogState() {
    document.body.classList.remove('catalog-dialog-open');
    activeCard = null;
    opener?.focus();
    opener = null;
  }

  cards.forEach((card) => {
    const imageArea = card.querySelector('.catalog-image');
    const description = card.querySelector('.catalog-body > p:not(.eyebrow)');
    const hint = document.createElement('span');
    hint.className = 'catalog-image-hint';
    hint.textContent = 'Ver 3 fotos';
    imageArea.setAttribute('role', 'button');
    imageArea.setAttribute('tabindex', '0');
    imageArea.setAttribute('aria-label', `Ver fotografías de la colección ${card.dataset.name}`);
    imageArea.append(hint);
    if (description) description.textContent = 'Montaje completo y detalles de mesa.';
    imageArea.addEventListener('click', () => openCollection(card, imageArea));
    imageArea.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCollection(card, imageArea);
      }
    });
    card.querySelector('[data-add]').addEventListener('click', () => toggleSelection(card));
  });

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      activeFilter = filter.dataset.filter;
      filters.forEach((node) => {
        const active = node === filter;
        node.classList.toggle('is-active', active);
        node.setAttribute('aria-pressed', String(active));
      });
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', applyFilters);
  quoteLinks.forEach((link) => link.addEventListener('click', (event) => {
    if (selected.length === 0) event.preventDefault();
  }));

  dialog?.querySelector('[data-dialog-close]')?.addEventListener('click', closeCollection);
  dialog?.querySelector('[data-dialog-previous]')?.addEventListener('click', () => showImage(activeImage - 1));
  dialog?.querySelector('[data-dialog-next]')?.addEventListener('click', () => showImage(activeImage + 1));
  dialogAdd?.addEventListener('click', () => {
    if (activeCard) toggleSelection(activeCard);
  });
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeCollection();
  });
  dialog?.addEventListener('close', resetDialogState);
  document.addEventListener('keydown', (event) => {
    if (!dialog?.open) return;
    if (event.key === 'ArrowLeft') showImage(activeImage - 1);
    if (event.key === 'ArrowRight') showImage(activeImage + 1);
  });

  window.addEventListener('juanlola:consentchange', (event) => {
    if (event.detail?.functional) {
      persist();
    } else {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        /* Sin almacenamiento funcional. */
      }
    }
  });

  applyFilters();
  syncSelection();
})();
