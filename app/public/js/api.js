// app/public/js/api.js

const api = {
    // ===================================
    // AUTH API (Sin cambios)
    // ===================================
    register: function(email, username, password) {
        return $.ajax({
            url: '/api/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, username, password })
        });
    },
    login: function(username, password) {
        return $.ajax({
            url: '/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password })
        });
    },

    // ===================================
    // CATALOG API (Sin cambios)
    // ===================================
    getProducts: function(query) {
        let apiUrl = '/api/products';
        if (query && query.trim() !== '') {
            apiUrl += `?q=${encodeURIComponent(query)}`;
        }
        return $.ajax({ url: apiUrl, method: 'GET' });
    },
    getProductById: function(productId) {
        return $.ajax({
            url: `/api/products/${productId}`,
            method: 'GET'
        });
    },

    // ===================================
    // CART API (¡AQUÍ ESTÁN LOS CAMBIOS!)
    // ===================================

    getCartItems: function() { // <-- Ya no necesita 'userId'
        return $.ajax({
            url: '/api/cart', // <-- ¡CAMBIO! URL actualizada
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
    },

    addToCart: function(productId, quantity) { // <-- Ya no necesita 'userId'
        return $.ajax({
            url: '/api/cart/add',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ productId, quantity }), // <-- ¡CAMBIO! 'userId' eliminado
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
    },

    removeItem: function(itemId) { // (Sin cambios, ya usaba itemId)
        return $.ajax({
            url: `/api/cart/remove/${itemId}`,
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
    },

    checkout: function() { // <-- Ya no necesita 'userId'
        return $.ajax({
            url: '/api/checkout',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({}), // <-- ¡CAMBIO! 'userId' eliminado (se envía objeto vacío)
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
    },

    getOrderHistory: function() {
        return $.ajax({
            url: '/api/orders',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
    }

};