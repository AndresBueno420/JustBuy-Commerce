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
 */
function updateCartCounter() {
    const userId = getUserId();
    if (!userId) {
        $('.cart-icon').text('0');
        return;
    }
    
    // Usamos la API (api.js) que ya está corregida
    api.getCartItems()
        .done(function(response) { // 1. Cambiamos 'items' por 'response' para más claridad
            
            // 2. ¡CORRECCIÓN! Accedemos al array *dentro* del objeto de respuesta
            const items = response.cartItems; 

            // 3. Ahora 'items' SÍ es un array y .reduce() funcionará
            const count = items.reduce((sum, item) => sum + item.quantity, 0);
            $('.cart-icon').text(count);
        })
        .fail(function() {
            $('.cart-icon').text('0');
        });
}

// Ejecutar funciones globales al cargar cualquier página
$(document).ready(function() {
    // Actualizar el contador del carrito en cada carga de página
    updateCartCounter();
});