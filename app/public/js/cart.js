// app/public/js/cart.js

$(document).ready(function() {

    // Lógica para cart.html
    if ($('#cart-items-list').length > 0) {
        const userId = getUserId();
        if (userId) {
            loadCartItems(userId);
        } else {
            alert("Necesitas iniciar sesión para ver tu carrito.");
            window.location.href = 'login.html';
        }

        $('#cart-items-list').on('click', '.btn-remove', function() {
            const itemId = $(this).data('item-id');
            if (confirm('¿Estás seguro?')) {
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

        loadCheckoutSummary(userId);

        $('#checkout-form').on('submit', function(e) {
            e.preventDefault();
            if (confirm('¿Confirmas el pago con tus créditos?')) {
                
                // Llama a la función de la API
                api.checkout(userId)
                    .done(function(response) {
                        alert(`¡Pago exitoso! ${response.message}`);
                        window.location.href = `confirmation.html?orderId=${response.orderId}`;
                    })
                    .fail(function(err) {
                        alert('Error en el pago: ' + err.responseJSON.message);
                    });
            }
        });
    }
    
    // Lógica para confirmation.html (se mantiene igual)
    if ($('#order-id').length > 0) {
        const orderId = getQueryParam('orderId');
        if (orderId) {
            $('#order-id').text(orderId);
        }
    }
});

// --- Funciones de Carrito y Checkout ---

function loadCartItems(userId) {
    // Llama a la función de la API
    api.getCartItems(userId)
        .done(renderCartItems)
        .fail((err) => $('#cart-items-list').html('<p>Error al cargar el carrito.</p>'));
}

function removeItemFromCart(itemId) {
    // Llama a la función de la API
    api.removeItem(itemId)
        .done(function(response) {
            alert(response.message);
            loadCartItems(getUserId()); // Recargar carrito
        })
        .fail(() => alert('Error al eliminar el ítem.'));
}

function loadCheckoutSummary(userId) {
    // Llama a la función de la API
    api.getCartItems(userId)
        .done(function(items) {
            let subtotal = 0;
            items.forEach(item => {
                subtotal += (item.quantity * item.price_at_purchase);
            });
            const shipping = 15.00;
            const total = subtotal + shipping;
            $('#final-total').text(`$${total.toFixed(2)}`);
        });
}

// renderCartItems() se mantiene igual (no hace llamadas a la API)
function renderCartItems(items) {
    // ... (El código de renderCartItems no cambia) ...
    // ... (recuerda pegar el código que teníamos de renderCartItems aquí) ...
    const cartList = $('#cart-items-list');
    cartList.empty();
    
    if (items.length === 0) {
        $('#empty-cart-message').show();
        return;
    }

    let subtotal = 0;
    items.forEach(item => {
        const product = item.Product; 
        const itemTotal = item.quantity * item.price_at_purchase;
        subtotal += itemTotal;

        cartList.append(`
            <div class="cart-item" style="display: flex; gap: 20px; padding: 20px 0; border-bottom: 1px solid #eee;">
                <div style="width: 100px; height: 100px; background-color: #f0f0f0;"></div>
                <div style="flex-grow: 1;">
                    <h3 style="margin: 0;">${product.name} (Talla: M)</h3>
                    <p>Precio Unitario: $${item.price_at_purchase}</p>
                    <button class="btn-remove" data-item-id="${item.id}" style="background:none; border:none; color:red; cursor:pointer;">
                        <span data-feather="trash-2"></span> Eliminar
                    </button>
                </div>
                <div style="font-weight: 700; font-size: 1.2rem;">
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