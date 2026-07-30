(() => {
  const form = document.querySelector('[data-contact-form]');
  const error = document.querySelector('[data-form-error]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const privacyAccepted = data.get('privacy') === 'accepted';

    if (!name || !phone) {
      error.textContent = 'Indica al menos tu nombre y teléfono para poder responderte.';
      return;
    }
    if (!privacyAccepted) {
      error.textContent = 'Debes confirmar que has leído la política de privacidad antes de continuar.';
      return;
    }

    error.textContent = '';
    const message = [
      'Hola, me gustaría pedir presupuesto para un evento.',
      '',
      `Nombre: ${name}`,
      `Teléfono: ${phone}`,
      `Correo: ${data.get('email') || 'No indicado'}`,
      `Fecha: ${data.get('date') || 'Por confirmar'}`,
      `Invitados: ${data.get('guests') || 'Por confirmar'}`,
      `Localidad: ${data.get('location') || 'Por confirmar'}`,
      '',
      `Material: ${data.get('material') || 'Necesito asesoramiento'}`
    ].join('\n');

    window.open(`https://wa.me/34659455344?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
})();
