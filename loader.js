(() => {
  "use strict";
  const modules = window.ATLAS_MODULES;
  window.ATLAS_READY = (async () => {
    if (!Array.isArray(modules)) throw new Error("No se pudo leer modules.js.");
    const seen = new Set();
    for (const module of modules) {
      if (!module || !/^[a-z0-9-]+$/.test(module.id) || module.file !== module.id + ".json" || typeof module.available !== "boolean") {
        throw new Error("Entrada inválida en modules.js.");
      }
      if (seen.has(module.id)) throw new Error("Viaje duplicado: " + module.id);
      seen.add(module.id);
    }
    async function load(url) {
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) throw new Error("No se pudo cargar " + url + " (" + response.status + ").");
      return response.json();
    }
    const active = modules.filter(module => module.available);
    const [places, ...trips] = await Promise.all([
      load("data/places.json"),
      ...active.map(module => load("data/trips/" + module.file))
    ]);
    if (!places || typeof places !== "object" || Array.isArray(places)) {
      throw new Error("data/places.json no es un objeto válido.");
    }
    trips.forEach((trip, index) => {
      if (!trip || trip.id !== active[index].id || !Array.isArray(trip.days) ||
          !Array.isArray(trip.mapPoints) || !Array.isArray(trip.stays) || !trip.cover) {
        throw new Error("Contenido incompleto o identificador incorrecto en " + active[index].file);
      }
    });
    window.ATLAS = {
      places,
      trips,
      updated: "2026-10-01",
      edited: "2026-10-04"
    };
    window.ATLAS_MAP_POINTS = Object.fromEntries(trips.map(trip => [trip.id, trip.mapPoints]));
    return window.ATLAS;
  })();
})();
