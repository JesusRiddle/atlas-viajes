#!/usr/bin/env node
// Usage: node scripts/new-trip.cjs <new-id> <name>
// Creates an inactive blank trip; old trips are reference material for manual AI planning.
const fs = require('node:fs');
const path = require('node:path');
const [id, name, ...extra] = process.argv.slice(2);
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data/trips');
const catalogPath = path.join(root, 'modules.js');
const valid = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

function create() {
  if (!valid(id) || !name?.trim() || extra.length) {
    throw new Error('Uso: node scripts/new-trip.cjs <nuevo-id> <nombre>');
  }
  const catalog = fs.readFileSync(catalogPath, 'utf8');
  const registry = [...catalog.matchAll(/"id":\s*"([^"]+)"/g)].map(match => match[1]);
  const destination = path.join(dataDir, id + '.json');
  if (registry.includes(id) || fs.existsSync(destination)) throw new Error('El ID ya existe: ' + id);
  const trip = { id, name: name.trim(), status: 'draft' };
  const insertion = /\];\s*$/;
  if (!insertion.test(catalog)) throw new Error('modules.js no tiene el formato esperado');
  const entry = '  {\n    "id": ' + JSON.stringify(id) + ',\n    "file": ' + JSON.stringify(id + '.json') + ',\n    "available": false\n  }';
  const last = catalog.replace(insertion, '];');
  const index = last.lastIndexOf('];');
  const rewritten = last.slice(0, index).replace(/\s*$/, '') + ',\n' + entry + last.slice(index);
  fs.writeFileSync(destination, JSON.stringify(trip, null, 2) + '\n', { flag: 'wx' });
  try { fs.writeFileSync(catalogPath, rewritten); }
  catch (error) { fs.unlinkSync(destination); throw error; }
  console.log('Borrador vacío creado (oculto): ' + id);
}
try { create(); }
catch (error) { console.error(error.message); process.exitCode = 1; }
