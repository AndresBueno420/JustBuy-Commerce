// app/public/js/main.js

/**
 * Función principal de jQuery.
 * Se ejecuta cuando el documento HTML está completamente cargado.
 */
$(document).ready(function() {

    // Comprueba en qué página estamos y ejecuta la lógica correspondiente

    // -----------------------------------------------------------------
    // LÓGICA PARA: index.html (Catálogo y Búsqueda)
    // -----------------------------------------------------------------
    if ($('#product-list').length > 0) {
        console.log("Estamos en index.html (Catálogo)");
        
        // 1. Cargar todos los productos al inicio
        loadProducts(null);

        // 2. Escuchar el clic en el botón de búsqueda
        $('#search-button').on('click', function() {
            const query = $('#search-input').val();
            loadProducts(query);
        });

        // 3. Escuchar la tecla "Enter" en la búsqueda
        $('#search-input').on('keypress', function(e) {
            if (e.which === 13) { // 13 = Enter
                const query = $('#search-input').val();
                loadProducts(query);
            }
        });
    }

    // -----------------------------------------------------------------
    // LÓGICA PARA: product.html (Detalle de Producto)
    // -----------------------------------------------------------------
    if ($('#product-section').length > 0) {
        console.log("Estamos en product.html (Detalle)");
        
        // 1. Obtener el ID del producto de la URL (ej. product.html?id=123)
        const productId = getQueryParam('id');
        
        if (productId) {
            loadProductDetails(productId);
        } else {
            // Manejar error si no hay ID
            $('#product-section').html('<h1>Producto no encontrado.</h1>');
        }

        // 2. Escuchar el clic en "Añadir al Carrito"
        $('#add-to-cart-btn').on('click', function() {
            const userId = getUserId(); // Necesitamos saber qué usuario está comprando
            if (!userId) {
                alert("Por favor, inicia sesión para añadir productos al carrito.");
                window.location.href = 'login.html';
                return;
            }
            
            const quantity = parseInt($('#quantity-input').val());
            
            // Llamada a la API para añadir al carrito
            $.ajax({
                url: '/api/cart/add',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    productId: productId,
                    userId: userId,
                    quantity: quantity
                }),
                success: function(response) {
                    alert('¡Producto añadido al carrito!');
                    // (Aquí podrías actualizar el contador del carrito en el header)
                },
                error: function(err) {
                    alert('Error al añadir al carrito: ' + err.responseJSON.message);
                }
            });
        });
    }

    // -----------------------------------------------------------------
    // LÓGICA PARA: register.html (Registro)
    // -----------------------------------------------------------------
    if ($('#register-form').length > 0) {
        console.log("Estamos en register.html");

        $('#register-form').on('submit', function(e) {
            e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

            const email = $('#new-email').val();
            const username = $('#new-username').val();
            const password = $('#new-password').val();
            const confirmPassword = $('#confirm-password').val();

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            // Llamada a la API de registro
            $.ajax({
                url: '/api/register',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                }),
                success: function(response) {
                    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                    window.location.href = 'login.html'; // Redirigir al login
                },
                error: function(err) {
                    alert('Error en el registro: ' + err.responseJSON.message);
                }
            });
        });
    }

    // -----------------------------------------------------------------
    // LÓGICA PARA: login.html (Inicio de Sesión)
    // -----------------------------------------------------------------
    if ($('#login-form').length > 0) {
        console.log("Estamos en login.html");

        $('#login-form').on('submit', function(e) {
            e.preventDefault();

            const username = $('#username').val();
            const password = $('#password').val();

            // Llamada a la API de login
            $.ajax({
                url: '/api/login',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: username,
                    password: password
                }),
                success: function(response) {
                    // ¡ÉXITO! Guardamos el token y el ID del usuario
                    localStorage.setItem('authToken', response.token);
                    // (Necesitaríamos que la API de login devuelva el userId también)
                    // localStorage.setItem('userId', response.userId); 
                    
                    alert('¡Inicio de sesión exitoso!');
                    window.location.href = 'index.html'; // Redirigir al catálogo
                },
                error: function(err) {
                    alert('Error en el inicio de sesión: ' + err.responseJSON.message);
                }
            });
        });
    }

    // (Aquí iría la lógica para cart.html y checkout.html, siguiendo el mismo patrón)

});


// =========================================================================
// FUNCIONES AUXILIARES PARA index.html
// =========================================================================

/**
 * Carga productos desde la API (con o sin búsqueda).
 */
function loadProducts(query) {
    let apiUrl = '/api/products';

    if (query && query.trim() !== '') {
        apiUrl += `?q=${encodeURIComponent(query)}`;
    }

    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function(products) {
            renderProducts(products);
        },
        error: function(err) {
            console.error("Error al cargar productos:", err);
            $('#product-list').html('<p style="color: red;">Error al cargar los productos.</p>');
        }
    });
}

/**
 * Dibuja las cards de productos en el HTML.
 */
function renderProducts(products) {
    const productList = $('#product-list');
    productList.empty(); // Limpiar resultados anteriores

    if (products.length === 0) {
        productList.html('<p style="color: var(--color-grey-blue);">No se encontraron camisetas.</p>');
        return;
    }

    products.forEach(product => {
        const productCard = `
            <article class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                <div class="product-image-placeholder">
                    [Imagen de ${product.name}]
                </div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-info" style="color: var(--color-grey-blue);">${product.description.substring(0, 50)}...</p>
                <p class="product-price">$${product.price}</p>
                <button class="btn-primary">
                    <span data-feather="plus-circle" class="icon-feather"></span> Añadir
                </button>
            </article>
        `;
        productList.append(productCard);
    });

    // ¡Importante! Volver a llamar a feather.replace() 
    // después de añadir los nuevos íconos dinámicamente.
    feather.replace();
}


// =========================================================================
// FUNCIONES AUXILIARES PARA product.html
// =========================================================================

/**
 * Carga los detalles de un solo producto.
 */
function loadProductDetails(productId) {
    $.ajax({
        url: `/api/products/${productId}`,
        method: 'GET',
        success: function(product) {
            // Rellenar el HTML con los datos del producto
            $('#product-name').text(product.name);
            $('#product-price').text(`$${product.price}`);
            $('#product-description').text(product.description);
            // (Aquí rellenarías la imagen, tallas, etc.)
        },
        error: function(err) {
            console.error("Error al cargar el producto:", err);
            $('#product-section').html('<h1>Error 404: Producto no encontrado.</h1>');
        }
    });
}

// =========================================================================
// FUNCIONES AUXILIARES GLOBALES
// =========================================================================

/**
 * Obtiene un parámetro de la URL (ej. ?id=123)
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Obtiene el ID del usuario guardado en localStorage (simulado)
 */
function getUserId() {
    // En una app real, esto se saca del token JWT decodificado
    // Por ahora, simulamos que lo guardamos al hacer login
    return localStorage.getItem('userId') || '1'; // Devuelve 1 como fallback
}