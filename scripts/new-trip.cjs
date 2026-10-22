#!/usr/bin/env node
// Usage: node scripts/new-trip.cjs <new-id> <name> [--from <old-id>]
// Creates an inactive new trip without altering the original.
const fs = require('node:fs');
const path = require('node:path');
const [id, name, flag, originId] = process.argv.slice(2);
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data/trips');
const catalogPath = path.join(root, 'modules.js');
const valid = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

function create() {
  if (!valid(id) || !name?.trim() || (flag && flag !== '--from') || (flag === '--from' && !originId) || (!flag && originId)) {
    throw new Error('Uso: node scripts/new-trip.cjs <nuevo-id> <nombre> [--from <id-antiguo>]');
  }
  const catalog = fs.readFileSync(catalogPath, 'utf8');
  const registry = [...catalog.matchAll(/"id":\s*"([^"]+)"/g)].map(match => match[1]);
  const destination = path.join(dataDir, id + '.json');
  if (registry.includes(id) || fs.existsSync(destination)) throw new Error('El ID ya existe: ' + id);
  const sourceFile = originId ? path.join(dataDir, originId + '.json') : null;
  if (originId && (!valid(originId) || !registry.includes(originId) || !fs.existsSync(sourceFile))) {
    throw new Error('Viaje antiguo no encontrado: ' + originId);
  }
  const trip = { id, name: name.trim(), status: 'draft' };
  if (sourceFile) {
    const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
    if (Array.isArray(source.routeCities)) trip.routeCities = source.routeCities.filter(city => typeof city === 'string');
    if (Array.isArray(source.experiences)) trip.experiences = source.experiences.filter(item => typeof item === 'string');
  }
  const insertion = /\n\];\s*$/;
  if (!insertion.test(catalog)) throw new Error('modules.js no tiene el formato esperado');
  const entry = '  {\n    "id": ' + JSON.stringify(id) + ',\n    "file": ' + JSON.stringify(id + '.json') + ',\n    "available": false\n  }';
  const last = catalog.replace(insertion, '\n];');
  const index = last.lastIndexOf('\n];');
  const rewritten = last.slice(0, index).replace(/\s*$/, '') + ',\n' + entry + last.slice(index);
  fs.writeFileSync(destination, JSON.stringify(trip, null, 2) + '\n', { flag: 'wx' });
  try { fs.writeFileSync(catalogPath, rewritten); }
  catch (error) { fs.unlinkSync(destination); throw error; }
  console.log('Borrador creado (oculto): ' + id + (originId ? ' a partir de ' + originId : ' desde cero'));
}
try { create(); }
catch (error) { console.error(error.message); process.exitCode = 1; }
