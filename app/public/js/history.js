// app/public/js/history.js

$(document).ready(function() {
    // Asegurarnos de que estamos en la página de historial
    if ($('#order-history-list').length > 0) {
        loadOrderHistory();
    }
});

/**
 * Llama a la API y renderiza el historial de pedidos
 */
function loadOrderHistory() {
    const listElement = $('#order-history-list');
    
    api.getOrderHistory()
        .done(function(orders) {
            listElement.empty(); // Limpiar "Cargando..."

            if (orders.length === 0) {
                listElement.html('<p>No has realizado ningún pedido todavía.</p>');
                return;
            }

            // Iterar sobre cada orden
            orders.forEach(order => {
                const orderCard = $(`
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <span>PEDIDO REALIZADO:</span>
                                <span>${new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span>TOTAL:</span>
                                <span>$${order.totalAmount}</span>
                            </div>
                            <div>
                                <span>PEDIDO N.º:</span>
                                <span>${order.id}</span>
                            </div>
                        </div>
                        <div class="order-body">
                            </div>
                    </div>
                `);

                const orderBody = orderCard.find('.order-body');
                
                // Iterar sobre los ítems de esa orden
                order.OrderItems.forEach(item => {
                    orderBody.append(`
                        <div class="order-item">
                            <img src="${item.Product.imageUrl}" alt="${item.Product.name}">
                            <div>
                                <strong style="color: var(--color-deep-blue);">${item.Product.name}</strong>
                                <p style="margin: 2px 0; color: var(--color-grey-blue);">
                                    Cant: ${item.quantity} x $${item.price_at_purchase}
                                </p>
                            </div>
                        </div>
                    `);
                });

                listElement.append(orderCard);
            });

        })
        .fail(function(err) {
            listElement.html('<p style="color:red;">Error al cargar el historial de pedidos.</p>');
        });
}