// app/public/js/catalog.js

$(document).ready(function() {

    // Lógica para index.html
    if ($('#product-list').length > 0) {
        loadProducts(null); // Carga inicial

        $('#search-button').on('click', function() {
            loadProducts($('#search-input').val());
        });

        $('#search-input').on('keypress', function(e) {
            if (e.which === 13) { loadProducts($('#search-input').val()); }
        });
    }

    // Lógica para product.html
    if ($('#product-section').length > 0) {
        const productId = getQueryParam('id');
        
        if (productId) {
            loadProductDetails(productId);
        } else {
            $('#product-section').html('<h1>Producto no encontrado.</h1>');
        }

        $('#add-to-cart-btn').on('click', function() {
            const userId = getUserId();
            if (!userId) {
                alert("Por favor, inicia sesión para añadir productos.");
                window.location.href = 'login.html';
                return;
            }
            
            // Llama a la función de la API
            api.addToCart(
                productId,
                parseInt($('#quantity-input').val())
            )
            .done(function(response) {
                alert('¡Producto añadido al carrito!');
                updateCartCounter();
            })
            .fail(function(err) {
                alert('Error al añadir: ' + err.responseJSON.message);
            });
        });
    }

});

// --- Funciones de Catálogo ---

function loadProducts(query) {
    // Llama a la función de la API
    api.getProducts(query)
        .done(renderProducts) // .done(fn) pasa la respuesta a la función 'renderProducts'
        .fail((err) => $('#product-list').html('<p>Error al cargar productos.</p>'));
}

function loadProductDetails(productId) {
    // Llama a la función de la API
    api.getProductById(productId)
        .done(function(product) {
            // Cargar textos
            $('#product-name').text(product.name);
            $('#product-price').text(`$${product.price}`);
            $('#product-description').text(product.description);
            
            // ¡CORRECCIÓN! Cargar la imagen
            const imageUrl = product.imageUrl || '/img/placeholder.jpg';
            $('#main-image').html(
                `<img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain;">`
            );
        })
        .fail(() => $('#product-section').html('<h1>Producto no encontrado.</h1>'));
}

// ==========================================================
// FUNCIÓN CORREGIDA
// ==========================================================
function renderProducts(products) {
    const productList = $('#product-list');
    productList.empty();
    if (products.length === 0) {
        productList.html('<p>No se encontraron camisetas.</p>');
        return;
    }
    products.forEach(product => {
        productList.append(`
            <article class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                
                <div class="product-image-placeholder" style="padding: 10px; height: 280px;">
                    <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                
                <h3 class="product-title">${product.name}</h3>
                
                <p class="product-info" style="color: var(--color-grey-blue); padding: 0 15px;">
                    ${product.description.substring(0, 50)}...
                </p>
                
                <p class="product-price">$${product.price}</p>
                
                <button class="btn-primary"><span data-feather="plus-circle"></span> Añadir</button>
            </article>
        `);
    });
    
    // Volver a llamar a feather.replace() para que renderice los nuevos íconos
    feather.replace();
}