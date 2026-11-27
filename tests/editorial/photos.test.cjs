'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {trips:scoped,read}=require('./catalog.cjs');
const trips=scoped.map(x=>x.trip),catalog=read('data/places.json');
test('portadas y actividades actuales tienen fotografía y descripción, sin fijar la cantidad', () => {
  for (const trip of trips) {
    const active = new Set([trip.cover, ...(trip.coverSlides || []),
      ...(trip.days||[]).flatMap(d => [...(d.places || []), ...(d.optionalPlaces || [])])].filter(Boolean));
    for (const key of active) {
      const src = catalog[key]?.photo?.src;
      assert.ok(src, trip.id + ': referencia fotográfica faltante: ' + key);
      if (/^https?:\/\//.test(src)) {
        assert.ok(src.startsWith('https://'),
          trip.id + ': las fotos externas deben cargarse por HTTPS: ' + key);
      } else {
        assert.ok(!src.startsWith('/') && !src.includes('..'),
          trip.id + ': ruta local de foto fuera del repositorio: ' + key);
        assert.ok(fs.existsSync(src) && fs.statSync(src).size > 100,
          trip.id + ': archivo fotográfico local inexistente o vacío: ' + src);
      }
    }
  }
});

