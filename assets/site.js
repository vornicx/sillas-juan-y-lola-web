(() => {
  const CONSENT_KEY = 'juan-lola-consent-v1';
  const FUNCTIONAL_STORAGE_KEYS = Object.freeze(['juan-lola-selection', 'juan-lola-selection-v2']);
  const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;
  const DEFAULT_CONSENT = Object.freeze({ essential: true, functional: false, external: false });

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch { return false; }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); } catch { /* noop */ }
    }
  };

  function readConsent() {
    const raw = safeStorage.get(CONSENT_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1 || typeof parsed.savedAt !== 'number') return null;
      if (Date.now() - parsed.savedAt > CONSENT_MAX_AGE) {
        safeStorage.remove(CONSENT_KEY);
        return null;
      }
      return {
        essential: true,
        functional: Boolean(parsed.functional),
        external: Boolean(parsed.external),
        savedAt: parsed.savedAt,
        version: 1
      };
    } catch {
      safeStorage.remove(CONSENT_KEY);
      return null;
    }
  }

  let consent = readConsent();

  function publicConsent() {
    return consent ? { ...consent } : { ...DEFAULT_CONSENT, savedAt: null, version: 1 };
  }

  function saveConsent(next) {
    consent = {
      essential: true,
      functional: Boolean(next.functional),
      external: Boolean(next.external),
      savedAt: Date.now(),
      version: 1
    };
    safeStorage.set(CONSENT_KEY, JSON.stringify(consent));
    if (!consent.functional) FUNCTIONAL_STORAGE_KEYS.forEach((key) => safeStorage.remove(key));
    window.dispatchEvent(new CustomEvent('juanlola:consentchange', { detail: publicConsent() }));
    applyConsent();
    closeConsentUi();
  }

  window.JuanLolaConsent = {
    get: publicConsent,
    has(category) {
      if (category === 'essential') return true;
      return Boolean(publicConsent()[category]);
    },
    save: saveConsent,
    open: openPreferences
  };

  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-main-nav]');

  if (menuButton && nav) {
    const closeMenu = ({ restoreFocus = false } = {}) => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      if (restoreFocus) menuButton.focus();
    };

    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMenu();
        return;
      }
      menuButton.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      document.body.classList.add('menu-open');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu({ restoreFocus: true });
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760 && menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
    }, { passive: true });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const revealNodes = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealNodes.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }

  function consentMarkup() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <section class="cookie-banner" data-cookie-banner role="region" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-description">
        <div class="cookie-banner-copy">
          <p class="eyebrow">Tu privacidad</p>
          <h2 id="cookie-banner-title">Cookies y contenido externo</h2>
          <p id="cookie-banner-description">Usamos almacenamiento necesario para recordar tu elección. Las preferencias del catálogo y Google Maps permanecen desactivados hasta que los autorices. <a href="/cookies/">Más información</a>.</p>
        </div>
        <div class="cookie-banner-actions">
          <button type="button" class="cookie-action" data-cookie-reject>Rechazar todas</button>
          <button type="button" class="cookie-action" data-cookie-accept>Aceptar todas</button>
          <button type="button" class="cookie-action secondary" data-cookie-configure>Configurar</button>
        </div>
      </section>
      <div class="cookie-modal-backdrop" data-cookie-modal-backdrop hidden>
        <section class="cookie-modal" data-cookie-modal role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" aria-describedby="cookie-modal-description" tabindex="-1">
          <div class="cookie-modal-header">
            <div><p class="eyebrow">Centro de privacidad</p><h2 id="cookie-modal-title">Configurar cookies</h2></div>
            <button type="button" class="cookie-close" data-cookie-close aria-label="Cerrar configuración">×</button>
          </div>
          <p id="cookie-modal-description">Puedes cambiar esta decisión cuando quieras desde el pie de página.</p>
          <div class="cookie-options">
            <div class="cookie-option">
              <div><h3>Necesarias</h3><p>Recuerdan tu decisión y permiten funciones básicas de la web.</p></div>
              <span class="always-on">Siempre activas</span>
            </div>
            <label class="cookie-option">
              <div><h3>Preferencias funcionales</h3><p>Guardan durante un máximo de 30 días los artículos añadidos a “Mi lista”.</p></div>
              <input type="checkbox" data-consent-functional>
            </label>
            <label class="cookie-option">
              <div><h3>Contenido externo</h3><p>Permite cargar Google Maps en la página de contacto.</p></div>
              <input type="checkbox" data-consent-external>
            </label>
          </div>
          <div class="cookie-modal-actions">
            <button type="button" class="cookie-action" data-cookie-save>Guardar selección</button>
            <button type="button" class="cookie-action secondary" data-cookie-modal-reject>Rechazar todas</button>
          </div>
        </section>
      </div>`;
    document.body.append(...wrapper.children);
  }

  consentMarkup();

  const banner = document.querySelector('[data-cookie-banner]');
  const backdrop = document.querySelector('[data-cookie-modal-backdrop]');
  const modal = document.querySelector('[data-cookie-modal]');
  const functionalInput = document.querySelector('[data-consent-functional]');
  const externalInput = document.querySelector('[data-consent-external]');
  let lastFocused = null;

  function closePreferences({ restoreFocus = true } = {}) {
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove('cookie-modal-open');
    if (restoreFocus && lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  }

  function closeConsentUi() {
    if (banner) banner.hidden = true;
    closePreferences();
  }

  function openPreferences() {
    if (!backdrop || !modal) return;
    lastFocused = document.activeElement;
    const current = publicConsent();
    functionalInput.checked = Boolean(current.functional);
    externalInput.checked = Boolean(current.external);
    backdrop.hidden = false;
    document.body.classList.add('cookie-modal-open');
    modal.querySelector('button, input')?.focus();
  }

  function loadGoogleMaps() {
    document.querySelectorAll('[data-external-content="google-maps"]').forEach((container) => {
      if (container.dataset.loaded === 'true') return;
      const iframe = document.createElement('iframe');
      iframe.title = 'Ubicación de Sillas Juan y Lola en Écija';
      iframe.src = 'https://www.google.com/maps?q=C%2F%20Isla%20de%20Albor%C3%A1n%2022%2C%2041400%20%C3%89cija%2C%20Sevilla&output=embed';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      container.replaceChildren(iframe);
      container.dataset.loaded = 'true';
    });
  }

  function applyConsent() {
    const current = publicConsent();
    if (current.external) loadGoogleMaps();
  }

  document.querySelector('[data-cookie-reject]')?.addEventListener('click', () => saveConsent({ functional: false, external: false }));
  document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => saveConsent({ functional: true, external: true }));
  document.querySelector('[data-cookie-configure]')?.addEventListener('click', openPreferences);
  document.querySelector('[data-cookie-close]')?.addEventListener('click', () => closePreferences());
  document.querySelector('[data-cookie-save]')?.addEventListener('click', () => saveConsent({ functional: functionalInput.checked, external: externalInput.checked }));
  document.querySelector('[data-cookie-modal-reject]')?.addEventListener('click', () => saveConsent({ functional: false, external: false }));

  document.querySelectorAll('[data-cookie-settings]').forEach((button) => button.addEventListener('click', openPreferences));

  document.querySelectorAll('[data-load-map]').forEach((button) => {
    button.addEventListener('click', () => {
      const current = publicConsent();
      saveConsent({ functional: current.functional, external: true });
    });
  });

  backdrop?.addEventListener('click', (event) => {
    if (event.target === backdrop) closePreferences();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop && !backdrop.hidden) {
      closePreferences();
      return;
    }
    if (event.key === 'Tab' && backdrop && !backdrop.hidden && modal) {
      const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]')]
        .filter((element) => !element.hidden && element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        modal.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if (consent && banner) banner.hidden = true;
  applyConsent();
})();
