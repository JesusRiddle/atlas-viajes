'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { experienceWarnings } = require('../scripts/editorial-experience-audit.cjs');
test('experiencias: longitud recomendada y excepciones bajo revisión', () => {
  const intro = 'Recorrer el centro histórico, visitar su museo principal y explorar las plazas cercanas con un guía local que explique su arquitectura y acontecimientos importantes.';
  assert.deepEqual(experienceWarnings({ experiences: [{ city: 'Ciudad', description: intro }] }), []);
  assert.equal(experienceWarnings({ experiences: [{ description: 'Pasear.' }] })[0].code, 'too-short');
  assert.equal(experienceWarnings({ experiences: [{ description: Array(36).fill('gastronomía').join(' ') }] })[0].code, 'review-extension');
  assert.deepEqual(experienceWarnings({ experiences: [] }), []);
});
test('el auditor de experiencias tolera ediciones dinámicas en todos los viajes sin congelar conteos', () => {
  const window = {};
  vm.runInNewContext(fs.readFileSync('modules.js','utf8'), { window });
  const modules = window.ATLAS_MODULES.filter(m => m.available && m.homeGroup !== 'ideas');
  assert.ok(modules.length);
  for (const m of modules) {
    const trip = JSON.parse(fs.readFileSync('data/trips/' + m.file, 'utf8'));
    const issues = experienceWarnings(trip);
    assert.ok(Array.isArray(issues));
    assert.ok(issues.every(x => x.path.startsWith('experiences[')), m.file);
    const altered = structuredClone(trip);
    altered.experiences = [];
    assert.deepEqual(experienceWarnings(altered), [], m.file);
  }
});
