// js/services/storageService.js
const storageService = {
    // Guardar datos
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    
    // Obtener datos
    get: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    
    // Eliminar datos
    remove: function(key) {
        localStorage.removeItem(key);
    },
    
    // Limpiar todo (útil para testing)
    clearAll: function() {
        localStorage.clear();
    }
};

export default storageService;