// app/public/js/cart.js

$(document).ready(function() {

    // Lógica para cart.html
    if ($('#cart-items-list').length > 0) {
        const userId = getUserId();
        if (userId) {
            loadCartItems();
        } else {
            alert("Necesitas iniciar sesión para ver tu carrito.");
            window.location.href = 'login.html';
        }

        // Evento para el botón de eliminar
        $('#cart-items-list').on('click', '.btn-remove', function() {
            const itemId = $(this).data('item-id');
            if (confirm('¿Estás seguro de que quieres eliminar este ítem?')) {
                removeItemFromCart(itemId);
            }
        });
    }

    // Lógica para checkout.html
    if ($('#checkout-form').length > 0) {
        const userId = getUserId();
        if (!userId) {
            alert("Necesitas iniciar sesión para pagar.");
            window.location.href = 'login.html';
            return;
        }

        // Carga el resumen del carrito Y el balance del usuario
        loadCheckoutSummary();

        // Evento para el formulario de pago
        $('#checkout-form').on('submit', function(e) {
            e.preventDefault();
            
            // Validar que la dirección esté llena
            if ($('#address').val().trim() === '') {
                alert('Por favor, ingresa una dirección de envío.');
                return;
            }

            if (confirm('¿Confirmas el pago con tus créditos?')) {
                api.checkout() // Llama a la API (ya no envía userId)
                    .done(function(response) {
                        alert(`¡Pago exitoso! ${response.message}`);
                        updateCartCounter(); // Actualiza el contador del header a 0
                        window.location.href = `confirmation.html?orderId=${response.orderId}`;
                    })
                    .fail(function(err) {
                        alert('Error en el pago: ' + err.responseJSON.message);
                    });
            }
        });
    }
    
    // Lógica para confirmation.html
    if ($('#order-id').length > 0) {
        const orderId = getQueryParam('orderId');
        if (orderId) {
            $('#order-id').text(orderId);
        }
    }
});

// --- Funciones de Carrito y Checkout ---

function loadCartItems() {
    api.getCartItems() // Llama a la API (devuelve { cartItems, userBalance })
        .done(function(response) {
            // Pasamos solo los ítems al renderizador del carrito
            renderCartItems(response.cartItems);
        })
        .fail((err) => {
            console.error(err);
            $('#cart-items-list').html('<p style="color:red;">Error al cargar el carrito.</p>');
        });
}

function removeItemFromCart(itemId) {
    api.removeItem(itemId)
        .done(function(response) {
            alert(response.message);
            loadCartItems(); // Recargar carrito
            updateCartCounter(); // Actualizar contador del header
        })
        .fail(() => alert('Error al eliminar el ítem.'));
}

/**
 * Función CORREGIDA: Carga los datos para la página de checkout.
 */
function loadCheckoutSummary() {
    // Hacemos la llamada a la API para obtener los ítems Y el balance
    api.getCartItems()
        .done(function(response) {
            // Cuando la llamada es exitosa, procesamos AMBOS datos
            renderCheckoutSummary(response.cartItems, response.userBalance);
        })
        .fail(function(err) {
            console.error(err);
            $('#checkout-cart-summary').html('<p style="color:red;">Error al cargar el resumen.</p>');
        });
}

/**
 * Función CORREGIDA: Dibuja el resumen en la página de checkout.
 * Ahora recibe el balance real desde la API.
 */
function renderCheckoutSummary(items, userBalance) {
    const summaryList = $('#checkout-cart-summary');
    summaryList.empty(); // Limpiar el "Cargando..."

    let subtotal = 0;

    if (items.length === 0) {
        summaryList.html('<p>No tienes ítems para pagar.</p>');
    } else {
        items.forEach(item => {
            const product = item.Product;
            const itemTotal = item.quantity * item.price_at_purchase;
            subtotal += itemTotal;

            summaryList.append(`
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${product.imageUrl}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px;">
                        <div>
                            <strong style="color: var(--color-deep-blue);">${product.name}</strong>
                            <p style="margin: 2px 0; color: var(--color-grey-blue);">Cant: ${item.quantity} x $${item.price_at_purchase}</p>
                        </div>
                    </div>
                    <strong style="font-size: 1.1rem;">$${itemTotal.toFixed(2)}</strong>
                </div>
            `);
        });
    }

    // Calcula y muestra los totales (AHORA CON DATOS REALES)
    const shipping = 15.00; // Envío fijo
    const orderTotal = subtotal + shipping;
    
    // ¡Eliminamos la simulación! Usamos el balance real de la API.
    const remainingBalance = parseFloat(userBalance) - orderTotal;

    // Actualizamos el HTML con los valores correctos
    $('#user-balance').text(`$${parseFloat(userBalance).toFixed(2)}`);
    $('#order-total').text(`$${orderTotal.toFixed(2)}`);
    $('#remaining-balance').text(`$${remainingBalance.toFixed(2)}`);
}


/**
 * Dibuja los ítems en la página del carrito (cart.html).
 */
function renderCartItems(items) {
    const cartList = $('#cart-items-list');
    cartList.empty();
    
    if (items.length === 0) {
        $('#empty-cart-message').css('display', 'block');
        $('#subtotal-amount').text(`$0.00`);
        $('#total-amount').text(`$0.00`); // Si no hay ítems, el total es 0
        return;
    }

    $('#empty-cart-message').css('display', 'none');
    let subtotal = 0;
    
    items.forEach(item => {
        const product = item.Product;
        const itemTotal = item.quantity * item.price_at_purchase;
        subtotal += itemTotal;

        cartList.append(`
            <div class="cart-item" style="display: flex; gap: 20px; padding: 20px 0; border-bottom: 1px solid #eee;">
                <div style="width: 100px; height: 100px; background-color: #f0f0f0; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
                     <img src="${product.imageUrl}" alt="${product.name}" style="width:100%; height:100%; object-fit: contain;">
                </div>
                <div style="flex-grow: 1;">
                    <h3 style="margin: 0; font-size: 1.1rem; color: var(--color-deep-blue);">${product.name}</h3>
                    <p style="color: var(--color-grey-blue); margin: 5px 0 10px;">Precio Unitario: $${item.price_at_purchase}</p>
                    
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <label style="font-size: 0.9rem;">Cantidad:</label>
                        <input type="number" value="${item.quantity}" min="1" style="width: 60px; padding: 5px; border: 1px solid var(--color-grey-blue); border-radius: 5px;" disabled>
                        
                        <button class="btn-remove" data-item-id="${item.id}" style="background: none; border: none; color: #E74C3C; cursor: pointer; font-size: 0.9rem; font-weight: 600;">
                            <span data-feather="trash-2" class="icon-feather" style="width: 16px; height: 16px; margin-right: 0;"></span>
                            Eliminar
                        </button>
                    </div>
                </div>
                <div style="font-weight: 700; color: var(--color-medium-blue); font-size: 1.2rem;">
                    $${itemTotal.toFixed(2)}
                </div>
            </div>
        `);
    });

    const shipping = 15.00;
    const total = subtotal + shipping;
    $('#subtotal-amount').text(`$${subtotal.toFixed(2)}`);
    $('#total-amount').text(`$${total.toFixed(2)}`);
    
    feather.replace();
}