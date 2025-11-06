// app/public/js/global.js

/**
 * Obtiene un parámetro de la URL (ej. ?id=123)
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Obtiene el ID del usuario guardado en localStorage
 */
function getUserId() {
    return localStorage.getItem('userId');
}

/**
 * Obtiene el Token de Autenticación guardado en localStorage
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Actualiza el contador del carrito en el header.
 * Debería llamarse en $(document).ready() en todas las páginas.
 */
function updateCartCounter() {
    const userId = getUserId(); // Lo usamos solo para saber si estamos logueados
    if (!userId) {
        $('.cart-icon').text('0');
        return;
    }
    
    // Hacemos una llamada rápida para contar los ítems
    $.ajax({
        // ==========================================================
        // ¡CORRECCIÓN!
        // La URL ya no necesita el userId, porque el Back-end
        // lo obtiene del token de autenticación (authMiddleware).
        // ==========================================================
        url: '/api/cart', // <-- RUTA CORREGIDA (antes era /api/cart/${userId})
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        success: function(items) {
            // Sumamos las cantidades de todos los ítems
            const count = items.reduce((sum, item) => sum + item.quantity, 0);
            $('.cart-icon').text(count);
        },
        error: function() {
            $('.cart-icon').text('0');
        }
    });
}

// Ejecutar funciones globales al cargar cualquier página
$(document).ready(function() {
    // Actualizar el contador del carrito en cada carga de página
    updateCartCounter();
});