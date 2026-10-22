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
    const plainObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
    const clone = value => JSON.parse(JSON.stringify(value));
    // Defaults source: the same template used when creating a new trip.
    // Merge only missing/null structural containers; never replace supplied values, including 0 and false.
    function normalizeTrip(raw, module, template) {
      if (!plainObject(raw) || raw.id !== module.id ||
          typeof raw.name !== "string" || !raw.name.trim()) {
        throw new Error("Identidad inválida en " + module.file + ": id y name son obligatorios.");
      }
      const isMinimal = !Object.hasOwn(raw, "status") && !raw.cover;
      const normalized = clone(raw);
      const merge = (target, defaults) => {
        for (const [key, fallback] of Object.entries(defaults)) {
          if (!Object.hasOwn(target, key) || target[key] === null && (Array.isArray(fallback) || plainObject(fallback))) {
            target[key] = clone(fallback);
          } else if (plainObject(fallback) && plainObject(target[key])) {
            merge(target[key], fallback);
          }
        }
      };
      merge(normalized, template);
      // Existing full trips keep their normal renderer; partial new trips start as drafts.
      if (!Object.hasOwn(raw, "status")) normalized.status = isMinimal ? "draft" : null;
      if (!isMinimal && !Object.hasOwn(raw, "seasonality")) normalized.seasonality = null;
      const arrays = ["routeCities","bases","costs","experiences","days","reservations","expenses",
        "majorTransport","ticketNotes","attractionTerms","mapPoints","hotels","stays",
        "practicalIndicators","tips","sources","routeHighlights","cardHighlights",
        "introHighlights","knownCosts","railSummary"];
      for (const key of arrays) {
        if (!Array.isArray(normalized[key])) throw new Error("Campo " + key + " inválido en " + module.file + ": debe ser un array.");
      }
      for (const key of ["profile","exchangeRates","placeDescriptions"]) {
        if (!plainObject(normalized[key])) throw new Error("Campo " + key + " inválido en " + module.file + ": debe ser objeto.");
      }
      if (normalized.seasonality !== null && !plainObject(normalized.seasonality)) {
        throw new Error("seasonality inválido en " + module.file);
      }
      for (const key of ["start","end"]) {
        const value = normalized[key];
        if (value !== null && (typeof value !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
            Number.isNaN(Date.parse(value + "T12:00:00Z")) ||
            new Date(value + "T12:00:00Z").toISOString().slice(0, 10) !== value)) {
          throw new Error("Fecha " + key + " inválida en " + module.file);
        }
      }
      return normalized;
    }
    const active = modules.filter(module => module.available);
    const [places, template, ...loadedTrips] = await Promise.all([
      load("data/places.json"),
      load("data/trips/_template.json"),
      ...active.map(module => load("data/trips/" + module.file))
    ]);
    if (!plainObject(places)) throw new Error("data/places.json no es un objeto válido.");
    if (!plainObject(template) || !Array.isArray(template.days) ||
        !Array.isArray(template.mapPoints)) throw new Error("_template.json no es válido.");
    const trips = loadedTrips.map((trip, index) => normalizeTrip(trip, active[index], template));
    window.ATLAS = {
      places,
      trips,
      updated: "2026-10-01",
      edited: "2026-10-04"
    };
    window.PHOTOS = Object.fromEntries(Object.entries(places).map(([id, item]) => [id, item.photo]));
    window.ATLAS_MAP_POINTS = Object.fromEntries(trips.map(trip => [trip.id, trip.mapPoints]));
    return window.ATLAS;
  })();
})();
