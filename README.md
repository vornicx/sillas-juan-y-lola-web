# Sillas Juan y Lola — web profesional

Web estática, sin dependencias ni proceso de compilación, preparada para desplegar directamente en Vercel.

## Incluye

- Inicio, catálogo visual de sillas, mesas, menaje, equipamiento y 27 colecciones de mantelería, galería, nosotros y contacto.
- Diseño responsive para móvil, tablet y escritorio.
- Menú móvil accesible.
- Catálogo con 47 referencias, buscador por categorías, visor ampliado y lista de presupuesto.
- Persistencia opcional de la lista durante un máximo de 30 días.
- Formulario que prepara la solicitud en WhatsApp y muestra información básica de privacidad.
- Preguntas frecuentes con respuestas prudentes que no inventan condiciones comerciales.
- Enlaces oficiales a Instagram y Facebook.
- Mapa de Google bloqueado hasta que el usuario autoriza contenido externo.
- Aviso legal, política de privacidad, política de cookies y términos y condiciones.
- Gestor de consentimiento con **Aceptar todas**, **Rechazar todas** y configuración por categorías.
- Enlace permanente para cambiar las preferencias desde el pie de página.
- Fotografías alojadas localmente en `assets/images/`, descargadas de la web anterior.
- Sin Google Fonts, analítica ni publicidad de terceros cargadas automáticamente.
- SEO, Open Graph, datos estructurados, sitemap, robots y página 404.
- Cabeceras de seguridad para Vercel.

## Privacidad y cookies

La versión entregada solo utiliza:

- `juan-lola-consent-v1`: almacenamiento necesario para recordar la decisión de privacidad, máximo 12 meses.
- `juan-lola-selection-v2`: almacenamiento funcional opcional para recordar la lista del catálogo, máximo 30 días.
- Google Maps: no se carga hasta que se autoriza el contenido externo o se pulsa **Cargar mapa**.

No se han integrado herramientas de analítica, píxeles publicitarios ni formularios que envíen datos a un backend. El formulario abre WhatsApp con un borrador que el usuario revisa antes de enviarlo.

El catálogo visual se ha reconstruido a partir del PDF oficial de 2021 y de la biblioteca multimedia de la web anterior. La web avisa expresamente de que los nombres comerciales no publicados, la disponibilidad, las medidas y las variantes deben confirmarse en cada presupuesto.

## Ejecutar en local

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000`.

## Verificación de calidad

```bash
npm run check
```

El quality gate valida sintaxis JavaScript, rutas y recursos internos, enlaces externos seguros, estructura HTML, cobertura del sitemap, integridad de las 81 composiciones del catálogo y la política CSP/cabeceras de seguridad.

## Desplegar en Vercel

1. Subir esta carpeta a un repositorio.
2. Importar el repositorio en Vercel.
3. Framework preset: **Other**.
4. Build command: vacío.
5. Output directory: `.`

## Comprobaciones obligatorias antes de publicar

La documentación legal utiliza, como borrador, los siguientes datos encontrados en fuentes públicas vinculadas al domicilio del negocio:

- **VILLAR PEREZ ALQUILERES S.L.U.**
- **NIF B75437095**
- Pol. Ind. Maza y Marín, C/ Isla de Alborán, 24, 41400 Écija (Sevilla)
- Registro Mercantil de Sevilla, hoja SE-146757
- `sillasjuanylola@gmail.com`

El negocio debe confirmar por escrito que esa es la entidad que explotará la web, emitirá presupuestos y contratará con los clientes. También debe revisar las condiciones reales de reservas, señales, cancelaciones, daños, transporte y fianzas antes de usar los términos como condiciones contractuales definitivas.

Consulta `REVISION-ANTES-DE-PUBLICAR.md`.
