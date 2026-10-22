// Estados compartidos para información no capturada y atributos no aplicables.
// El JSON guarda valores semánticos; los textos pertenecen exclusivamente a la vista.
window.AtlasEmptyState = (() => {
    'use strict';
    const esc = value => String(value).replace(/[&<>"']/g, char =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const isPending = value => value == null || value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);
    const kind = value => value === 'no_aplica' ? 'not-applicable' :
        isPending(value) ? 'pending' : 'defined';
    const render = (value, format = esc) => {
        const state = kind(value);
        if (state === 'pending') return '<span class="draft-pending">Por definir</span>';
        if (state === 'not-applicable') return '<span class="draft-na">No aplica</span>';
        return format(value);
    };
    return Object.freeze({ kind, isPending, render });
})();
