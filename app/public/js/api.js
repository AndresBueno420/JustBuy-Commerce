// app/public/js/api.js

/**
 * Objeto 'api' que centraliza todas las llamadas AJAX (jQuery) al Back-end.
 * Utiliza las funciones de global.js (como getAuthToken)
 */
const api = {

    // ===================================
    // AUTH API
    // ===================================

    /**
     * Llama al Back-end para registrar un usuario.
     */
    register: function(email, username, password) {
        return $.ajax({
            url: '/api/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, username, password })
        });
    },

    /**
     * Llama al Back-end para iniciar sesión.
     */
    login: function(username, password) {
        return $.ajax({
            url: '/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password })
        });
    },

    // ===================================
    // CATALOG API
    // ===================================

    /**
     * Llama al Back-end para obtener productos (con o sin búsqueda).
     */
    getProducts: function(query) {
        let apiUrl = '/api/products';
        if (query && query.trim() !== '') {
            apiUrl += `?q=${encodeURIComponent(query)}`;
        }
        
        return $.ajax({
            url: apiUrl,
            method: 'GET'
        });
    },

    /**
     * Llama al Back-end para obtener el detalle de un solo producto.
     */
    getProductById: function(productId) {
        return $.ajax({
            url: `/api/products/${productId}`,
            method: 'GET'
        });
    },

    // ===================================
    // CART API
    // ===================================

    /**
     * Llama al Back-end para obtener los ítems del carrito de un usuario.
     * Requiere autenticación (Token).
     */
    getCartItems: function(userId) {
        return $.ajax({
            url: `/api/cart/${userId}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
    },

    /**
     * Llama al Back-end para añadir un producto al carrito.
     * Requiere autenticación (Token).
     */
    addToCart: function(productId, userId, quantity) {
        return $.ajax({
            url: '/api/cart/add',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ productId, userId, quantity }),
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
    },

    /**
     * Llama al Back-end para eliminar un ítem del carrito.
     * Requiere autenticación (Token).
     */
    removeItem: function(itemId) {
        return $.ajax({
            url: `/api/cart/remove/${itemId}`,
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
    },

    /**
     * Llama al Back-end para procesar el pago (simulado).
     * Requiere autenticación (Token).
     */
    checkout: function(userId) {
        return $.ajax({
            url: '/api/checkout',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ userId }),
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
    }
};