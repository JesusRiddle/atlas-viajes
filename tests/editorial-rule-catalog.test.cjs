'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const rules = require('../scripts/editorial-rule-catalog.cjs');

const areas = ['transversal', 'plan', 'mapa', 'temporadas', 'experiencias',
  'reservas', 'traslados', 'alojamientos', 'dias', 'costes'];
const statuses = new Set(['automated', 'partial', 'missing', 'manual']);

test('cada obligación editorial tiene ID, sección, cobertura y descripción únicos', () => {
  assert.ok(rules.length >= 9);
  assert.deepEqual(new Set(rules.map(rule => rule.id)).size, rules.length);
  for (const rule of rules) {
    assert.match(rule.id, /^[A-Z]{3}-\d{2}$/);
    assert.ok(areas.includes(rule.section), rule.id + ': sección desconocida');
    assert.ok(statuses.has(rule.coverage), rule.id + ': estado de cobertura desconocido');
    assert.ok(typeof rule.requirement === 'string' && rule.requirement.length > 15, rule.id);
  }
  for (const area of areas) assert.ok(rules.some(rule => rule.section === area),
    area + ': no puede quedar fuera del inventario');
});

test('coberturas declaradas como automáticas o parciales apuntan a pruebas existentes', () => {
  for (const rule of rules) {
    if (!['automated', 'partial'].includes(rule.coverage)) {
      assert.equal(rule.evidence, undefined, rule.id + ': estado sin prueba no debe fingir evidencia');
      continue;
    }
    assert.ok(rule.evidence?.file && rule.evidence?.contains,
      rule.id + ': falta identificar el archivo y el criterio verificado');
    assert.ok(rule.evidence.file.startsWith('tests/') ||
      rule.evidence.file.startsWith('.github/workflows/'), rule.id);
    const target = path.join(__dirname, '..', rule.evidence.file);
    assert.ok(fs.existsSync(target), rule.id + ': archivo de evidencia inexistente');
    const source = fs.readFileSync(target, 'utf8');
    assert.ok(source.includes(rule.evidence.contains),
      rule.id + ': prueba o condición referenciada ya no existe: ' + rule.evidence.contains);
  }
});

test('el inventario no confunde ejecución de CI con cobertura editorial exhaustiva', () => {
  assert.ok(rules.some(rule => rule.coverage === 'missing'));
  assert.ok(rules.some(rule => rule.coverage === 'manual'));
  assert.ok(rules.some(rule => rule.coverage === 'partial'));
  const coverage = rules.reduce((result, rule) => {
    result[rule.coverage] = (result[rule.coverage] || 0) + 1;
    return result;
  }, {});
  assert.equal(Object.values(coverage).reduce((a, b) => a + b, 0), rules.length);
});
