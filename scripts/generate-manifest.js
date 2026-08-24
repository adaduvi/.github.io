#!/usr/bin/env node
/**
 * Escanea la carpeta "extra/" y regenera "extra/manifest.json"
 * con la lista de imágenes disponibles (solo nombres de archivo).
 *
 * El texto de cada imagen se lee directamente desde su .txt hermano
 * en tiempo de ejecución en el navegador (ver index.html), no se
 * copia acá. Este script solo le avisa a la página qué imágenes existen.
 *
 * Uso: node scripts/generate-manifest.js
 */

const fs = require('fs');
const path = require('path');

const EXTRA_DIR = path.join(__dirname, '..', 'extra');
const MANIFEST_PATH = path.join(EXTRA_DIR, 'manifest.json');
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

function main() {
  if (!fs.existsSync(EXTRA_DIR)) {
    console.error(`No existe la carpeta: ${EXTRA_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(EXTRA_DIR);

  const images = files
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'es'));

  const previous = fs.existsSync(MANIFEST_PATH)
    ? fs.readFileSync(MANIFEST_PATH, 'utf8')
    : null;

  const next = JSON.stringify(images, null, 2) + '\n';

  if (previous === next) {
    console.log('Sin cambios: manifest.json ya está actualizado.');
    return;
  }

  fs.writeFileSync(MANIFEST_PATH, next, 'utf8');
  console.log(`manifest.json actualizado con ${images.length} imagen(es).`);
}

main();

