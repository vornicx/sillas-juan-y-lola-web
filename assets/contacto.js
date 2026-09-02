(() => {
  const form = document.querySelector('[data-contact-form]');
  const error = document.querySelector('[data-form-error]');
  if (!form) return;

  const clean = (value, maxLength) => String(value || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);

  function fail(message, field) {
    error.textContent = message;
    field?.focus();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = clean(data.get('name'), 80);
    const phone = clean(data.get('phone'), 30);
    const email = clean(data.get('email'), 254);
    const emailField = form.elements.email;
    const privacyAccepted = data.get('privacy') === 'accepted';

    if (!name || !phone) {
      fail('Indica al menos tu nombre y teléfono para poder responderte.', !name ? form.elements.name : form.elements.phone);
      return;
    }
    if (email && emailField?.validity?.typeMismatch) {
      fail('Revisa el correo electrónico: parece que el formato no es correcto.', emailField);
      return;
    }
    if (!privacyAccepted) {
      fail('Debes confirmar que has leído la política de privacidad antes de continuar.', form.elements.privacy);
      return;
    }

    error.textContent = '';
    const message = [
      'Hola, me gustaría pedir presupuesto para un evento.',
      '',
      `Nombre: ${name}`,
      `Teléfono: ${phone}`,
      `Correo: ${email || 'No indicado'}`,
      `Fecha: ${clean(data.get('date'), 10) || 'Por confirmar'}`,
      `Invitados: ${clean(data.get('guests'), 6) || 'Por confirmar'}`,
      `Localidad: ${clean(data.get('location'), 120) || 'Por confirmar'}`,
      '',
      `Material: ${clean(data.get('material'), 1000) || 'Necesito asesoramiento'}`
    ].join('\n');

    const popup = window.open(`https://wa.me/34659455344?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  });
})();
