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
    12: '/assets/images/catalogo-2025/empolvado-rosa-crossback-natural.avif'
  };

  function applyDirect(node, page) {
    const url = directFiles[Number(page)];
    if (!node || !url) return false;
    node.style.setProperty('background-image', `url('${url}')`, 'important');
    node.style.setProperty('background-size', 'cover', 'important');
    node.style.setProperty('background-position', 'center', 'important');
    node.style.setProperty('background-repeat', 'no-repeat', 'important');
    return true;
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
        requestAnimationFrame(() => { queued = false; refreshDialog(); });
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
