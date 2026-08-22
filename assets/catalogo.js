(() => {
  const directFiles = {
    1: '/assets/images/catalogo-2025/agua-marina-forja-cruzada.avif',
    2: '/assets/images/catalogo-2025/agua-marina-tiffany-blanca.avif',
    3: '/assets/images/catalogo-2025/agua-marina-crossback-natural.avif',
    4: '/assets/images/catalogo-2025/agua-marina-napoleon.avif',
    5: '/assets/images/catalogo-2025/buganvilla-forja-palillos.avif',
    6: '/assets/images/catalogo-2025/buganvilla-crossback-natural.avif',
    7: '/assets/images/catalogo-2025/buganvilla-crossback-marron-ratan.avif',
    8: '/assets/images/catalogo-2025/cartuja-azul-crossback-blanca.avif',
    9: '/assets/images/catalogo-2025/cartuja-azul-forja-cruzada.avif',
    10: '/assets/images/catalogo-2025/empolvado-rosa-forja-cruzada.avif',
    11: '/assets/images/catalogo-2025/empolvado-rosa-forja-palillos.avif',
    12: '/assets/images/catalogo-2025/empolvado-rosa-crossback-natural.avif',
    13: '/assets/images/catalogo-2025/empolvado-rosa-napoleon-blanca.avif',
    14: '/assets/images/catalogo-2025/grego-forja-cruzada.avif',
    15: '/assets/images/catalogo-2025/grego-tiffany-blanca.avif',
    16: '/assets/images/catalogo-2025/lino-blanco-rustico-forja-cruzada.avif',
    17: '/assets/images/catalogo-2025/lino-blanco-rustico-crossback-blanca.avif',
    18: '/assets/images/catalogo-2025/lino-blanco-rustico-crossback-nogal.avif',
    19: '/assets/images/catalogo-2025/lino-blanco-rustico-crossback-marron-ratan.avif',
    20: '/assets/images/catalogo-2025/marmolado-crossback-blanca.avif',
    21: '/assets/images/catalogo-2025/marmolado-forja-palillos.avif',
    22: '/assets/images/catalogo-2025/marmolado-orbelina.avif',
    23: '/assets/images/catalogo-2025/marmolado-tiffany-oro.avif',
    24: '/assets/images/catalogo-2025/piedra-nuevo-forja-cruzada.avif',
    25: '/assets/images/catalogo-2025/piedra-nuevo-crossback-blanca.avif',
    26: '/assets/images/catalogo-2025/piedra-nuevo-crossback-nogal.avif',
    27: '/assets/images/catalogo-2025/piedra-nuevo-orbelina.avif',
    28: '/assets/images/catalogo-2025/tostado-crossback-blanca.avif',
    29: '/assets/images/catalogo-2025/tostado-crossback-nogal.avif',
    30: '/assets/images/catalogo-2025/tostado-tiffany-oro.avif',
    31: '/assets/images/catalogo-2025/tostado-forja-palillos.avif',
    32: '/assets/images/catalogo-2025/triana-crossback-marron-ratan.avif',
    33: '/assets/images/catalogo-2025/triana-crossback-blanca.avif',
    34: '/assets/images/catalogo-2025/triana-crossback-nogal.avif',
    35: '/assets/images/catalogo-2025/triana-orbelina.avif',
    36: '/assets/images/catalogo-2025/vainilla-crossback-marron-ratan.avif',
    37: '/assets/images/catalogo-2025/vainilla-crossback-blanca.avif',
    38: '/assets/images/catalogo-2025/vainilla-forja-palillos.avif',
    39: '/assets/images/catalogo-2025/venecia-azul-crossback-blanca.avif',
    40: '/assets/images/catalogo-2025/venecia-azul-crossback-natural.avif',
    41: '/assets/images/catalogo-2025/venecia-azul-forja-cruzada.avif',
    42: '/assets/images/catalogo-2025/venecia-maquillaje-crossback-nogal.avif',
    43: '/assets/images/catalogo-2025/venecia-maquillaje-forja-cruzada.avif',
    44: '/assets/images/catalogo-2025/venecia-maquillaje-orbelina.avif',
    45: '/assets/images/catalogo-2025/venecia-oro-nuevo-crossback-blanca.avif',
    46: '/assets/images/catalogo-2025/venecia-oro-nuevo-crossback-nogal.avif',
    47: '/assets/images/catalogo-2025/venecia-oro-nuevo-forja-palillos.avif',
    48: '/assets/images/catalogo-2025/venecia-verde-agua-crossback-marron-ratan.avif',
    49: '/assets/images/catalogo-2025/venecia-verde-agua-crossback-blanca.avif',
    50: '/assets/images/catalogo-2025/venecia-verde-agua-forja-palillos.avif',
    51: '/assets/images/catalogo-2025/venecia-verde-agua-orbelina.avif',
    52: '/assets/images/catalogo-2025/venecia-verde-oliva-crossback-marron-ratan.avif',
    53: '/assets/images/catalogo-2025/venecia-verde-oliva-forja-palillos.avif',
    54: '/assets/images/catalogo-2025/venecia-verde-oliva-napoleon-blanca.avif',
    55: '/assets/images/catalogo-2025/venecia-verde-oliva-tiffany-blanca.avif',
    56: '/assets/images/catalogo-2025/versalles-crossback-blanca.avif',
    57: '/assets/images/catalogo-2025/versalles-crossback-nogal.avif',
    58: '/assets/images/catalogo-2025/versalles-forja-palillos.avif',
    59: '/assets/images/catalogo-2025/vichy-camel-crossback-blanca.avif',
    60: '/assets/images/catalogo-2025/vichy-camel-crossback-nogal.avif',
    61: '/assets/images/catalogo-2025/vichy-camel-forja-palillos.avif',
    62: '/assets/images/catalogo-2025/vichy-camel-orbelina.avif',
    63: '/assets/images/catalogo-2025/vichy-celeste-crossback-natural.avif',
    64: '/assets/images/catalogo-2025/vichy-celeste-forja-cruzada.avif',
    65: '/assets/images/catalogo-2025/vichy-celeste-napoleon-blanca.avif',
    66: '/assets/images/catalogo-2025/vichy-negro-crossback-blanca.avif',
    67: '/assets/images/catalogo-2025/vichy-negro-crossback-nogal.avif',
    68: '/assets/images/catalogo-2025/vichy-negro-forja-cruzada.avif',
    69: '/assets/images/catalogo-2025/vichy-verde-crossback-nogal.avif',
    70: '/assets/images/catalogo-2025/vichy-verde-orbelina.avif',
    71: '/assets/images/catalogo-2025/vichy-verde-tiffany-blanca.avif',
    72: '/assets/images/catalogo-2025/visillo-crossback-marron-ratan.avif',
    73: '/assets/images/catalogo-2025/visillo-crossback-natural.avif',
    74: '/assets/images/catalogo-2025/visillo-forja-cruzada.avif',
    75: '/assets/images/catalogo-2025/visillo-tiffany-blanca.avif',
    76: '/assets/images/catalogo-2025/gasa-beig-forja-cruzada.avif',
    77: '/assets/images/catalogo-2025/gasa-beig-crossback-marron-ratan.avif',
    78: '/assets/images/catalogo-2025/gasa-beig-orbelina.avif',
    79: '/assets/images/catalogo-2025/gasa-verde-crossback-blanca.avif',
    80: '/assets/images/catalogo-2025/gasa-verde-crossback-blanca-2.avif',
    81: '/assets/images/catalogo-2025/rustica-forja-palillos.avif'
  };

  const loaded = new Set();
  const failed = new Set();
  const pending = new Map();

  function paint(node, url) {
    if (!node) return;
    node.style.setProperty('background-image', `url('${url}')`, 'important');
    node.style.setProperty('background-size', 'cover', 'important');
    node.style.setProperty('background-position', 'center', 'important');
    node.style.setProperty('background-repeat', 'no-repeat', 'important');
  }

  function applyDirect(node, page) {
    const pageNumber = Number(page);
    const url = directFiles[pageNumber];
    if (!node || !url || failed.has(url)) return false;
    if (loaded.has(url)) {
      paint(node, url);
      return true;
    }
    if (!pending.has(url)) {
      const image = new Image();
      pending.set(url, image);
      image.addEventListener('load', () => {
        loaded.add(url);
        pending.delete(url);
        document.querySelectorAll(`[data-catalog-page="${pageNumber}"]`).forEach(el => paint(el, url));
        refreshDialog();
      }, { once: true });
      image.addEventListener('error', () => {
        failed.add(url);
        pending.delete(url);
      }, { once: true });
      image.src = url;
    }
    return false;
  }

  function applyStatic() {
    document.querySelectorAll('[data-catalog-page]').forEach(node => applyDirect(node, node.dataset.catalogPage));
    const hero = document.querySelector('.catalog-v2-hero, .home-v2-hero');
    if (hero) applyDirect(hero, 5);
  }

  function refreshDialog() {
    const dialog = document.querySelector('[data-catalog-dialog]');
    if (!dialog || !Array.isArray(window.JuanLolaCatalogData)) return;
    const title = dialog.querySelector('[data-dialog-title]')?.textContent?.trim();
    if (!title) return;
    const item = window.JuanLolaCatalogData.find(entry => entry.name === title);
    if (!item) return;
    const indexText = dialog.querySelector('[data-dialog-index]')?.textContent || '';
    const match = indexText.match(/Montaje\s+(\d+)/i);
    const activeIndex = Math.max(0, Number(match?.[1] || 1) - 1);
    applyDirect(dialog.querySelector('[data-dialog-image]'), item.pages[activeIndex]);
    dialog.querySelectorAll('[data-dialog-thumbnails] button').forEach((button, i) => {
      applyDirect(button.querySelector('.catalog-v2-photo'), item.pages[i]);
    });
  }

  const original = document.createElement('script');
  original.src = '/assets/catalogo-original.js';
  original.async = false;
  original.addEventListener('load', () => {
    applyStatic();
    refreshDialog();
    const dialog = document.querySelector('[data-catalog-dialog]');
    if (dialog) {
      let queued = false;
      const schedule = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          applyStatic();
          refreshDialog();
        });
      };
      new MutationObserver(schedule).observe(dialog, { subtree: true, childList: true, characterData: true });
      document.addEventListener('click', schedule);
      document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') schedule();
      });
    }
  });
  document.head.appendChild(original);
})();
