import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const notes = [];

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    if (name === '.git' || name === 'node_modules') return [];
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(root);
const htmlFiles = files.filter((path) => extname(path) === '.html');
const cssFiles = files.filter((path) => extname(path) === '.css');
const jsFiles = files.filter((path) => extname(path) === '.js' || extname(path) === '.mjs');

function fail(file, message) {
  failures.push(`${relative(root, file)}: ${message}`);
}

for (const file of cssFiles) {
  const css = readFileSync(file, 'utf8');
  for (const match of css.matchAll(/url\(['"]?([^'")]+)['"]?\)/gi)) {
    const target = localPath(file, match[1]);
    if (target && !existsSync(target)) fail(file, `recurso CSS inexistente: ${match[1]}`);
  }
}

function localPath(fromFile, reference) {
  const clean = reference.split(/[?#]/, 1)[0];
  if (!clean || /^(?:[a-z]+:|#|\/\/)/i.test(clean)) return null;
  if (clean.startsWith('/')) return join(root, clean.slice(1));
  return resolve(dirname(fromFile), clean);
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  if (!/^<!doctype html>/i.test(html.trim())) fail(file, 'falta <!doctype html>');
  if (!/<html\b[^>]*\blang="es"/i.test(html)) fail(file, 'falta lang="es"');
  if (!/<meta\b[^>]*name="viewport"/i.test(html)) fail(file, 'falta viewport');
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(file, 'falta un title no vacío');
  if (!/<main\b/i.test(html)) fail(file, 'falta el landmark <main>');

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) fail(file, `debe contener un único h1; encontrados ${h1Count}`);
  if (/\son[a-z]+\s*=/i.test(html)) fail(file, 'usa un manejador de evento inline');

  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attributes = match[1];
    if (/\btarget="_blank"/i.test(attributes) && !/\brel="[^"]*(?:noopener|noreferrer)[^"]*"/i.test(attributes)) {
      fail(file, 'enlace target="_blank" sin noopener/noreferrer');
    }
  }

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
    const target = localPath(file, match[1]);
    if (!target) continue;
    const candidate = target.endsWith('/') ? join(target, 'index.html') : target;
    if (!existsSync(candidate)) fail(file, `recurso local inexistente: ${match[1]}`);
  }

  for (const match of html.matchAll(/url\(['"]?([^'")]+)['"]?\)/gi)) {
    const target = localPath(file, match[1]);
    if (target && !existsSync(target)) fail(file, `imagen CSS inexistente: ${match[1]}`);
  }
}

for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (error) {
    fail(file, `JavaScript inválido: ${error.stderr?.toString().trim() || error.message}`);
  }
}

const vercelPath = join(root, 'vercel.json');
const vercel = JSON.parse(readFileSync(vercelPath, 'utf8'));
const securityHeaders = Object.fromEntries(vercel.headers[0].headers.map(({ key, value }) => [key.toLowerCase(), value]));
for (const header of ['content-security-policy', 'strict-transport-security', 'referrer-policy', 'permissions-policy', 'x-content-type-options', 'x-frame-options']) {
  if (!securityHeaders[header]) fail(vercelPath, `falta la cabecera ${header}`);
}
const csp = securityHeaders['content-security-policy'] || '';
for (const directive of ["default-src 'self'", "script-src-attr 'none'", "object-src 'none'", "base-uri 'none'", "form-action 'none'", "frame-ancestors 'none'"]) {
  if (!csp.includes(directive)) fail(vercelPath, `CSP sin ${directive}`);
}
if (/script-src[^;]*'unsafe-inline'/.test(csp)) fail(vercelPath, "CSP permite scripts inline sin control");

const home = readFileSync(join(root, 'index.html'), 'utf8');
const jsonLd = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (!jsonLd) {
  fail(join(root, 'index.html'), 'falta JSON-LD');
} else {
  JSON.parse(jsonLd);
  const hash = createHash('sha256').update(jsonLd).digest('base64');
  if (!csp.includes(`'sha256-${hash}'`)) fail(vercelPath, 'el hash CSP no coincide con el JSON-LD de inicio');
}

const catalogSandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'assets/catalogo-data.js'), 'utf8'), catalogSandbox);
const catalog = catalogSandbox.window.JuanLolaCatalogData;
if (!Array.isArray(catalog)) fail(join(root, 'assets/catalogo-data.js'), 'el catálogo no exporta una lista');
else {
  const ids = new Set();
  const allPages = [];
  for (const item of catalog) {
    if (!item.id || ids.has(item.id)) fail(join(root, 'assets/catalogo-data.js'), `id ausente o duplicado: ${item.id}`);
    ids.add(item.id);
    if (!item.name || !Array.isArray(item.pages) || !item.pages.length || !Array.isArray(item.chairs)) {
      fail(join(root, 'assets/catalogo-data.js'), `entrada incompleta: ${item.id || 'sin id'}`);
    }
    allPages.push(...item.pages);
  }
  const uniquePages = new Set(allPages);
  if (uniquePages.size !== 81 || Math.min(...uniquePages) !== 1 || Math.max(...uniquePages) !== 81) {
    fail(join(root, 'assets/catalogo-data.js'), 'los montajes deben cubrir exactamente las páginas 1–81');
  }
  notes.push(`${catalog.length} colecciones y ${uniquePages.size} montajes validados`);
}

const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
for (const route of ['/', '/catalogo/', '/galeria/', '/nosotros/', '/contacto/', '/aviso-legal/', '/privacidad/', '/cookies/', '/terminos-y-condiciones/']) {
  if (!sitemap.includes(`https://sillasjuanylola.com${route}`)) fail(join(root, 'sitemap.xml'), `falta la ruta ${route}`);
}

if (failures.length) {
  console.error(`\nQuality gate: ${failures.length} fallo(s)\n- ${failures.join('\n- ')}\n`);
  process.exit(1);
}

console.log(`Quality gate superado: ${htmlFiles.length} páginas, ${jsFiles.length} scripts, ${notes.join(', ')}.`);
