$(document).ready(function() {
  
  // --- Lógica de Página ---
  // Detectar en qué página estamos y ejecutar la lógica correspondiente
  if (window.location.pathname.endsWith('login.html') || window.location.pathname === '/') {
    // Estamos en la página de Login/Registro
    $('#login-form').on('submit', handleLogin);
  }
  if (window.location.pathname.endsWith('register.html')) {
    // Solo lógica de REGISTRO
    $('#register-form').on('submit', handleRegister);
  }
  
  if (window.location.pathname.endsWith('catalog.html')) {
    // Estamos en el catálogo
    loadProducts();
    // Asignar evento al botón de logout (si existe)
    $('#logout-btn').on('click', handleLogout);
  }

  if (window.location.pathname.endsWith('cart.html')) {
    // Estamos en el carrito
    loadCart();
    $('#logout-btn').on('click', handleLogout);
    
    // El botón de pago se conectará en Fase 5
    $('#payment-btn').on('click', handlePayment);
  }
  if (window.location.pathname.endsWith('history.html')) {
    loadHistory();
    $('#logout-btn').on('click', handleLogout);
  }

  // --- Manejadores de Eventos ---
  
  // 1. Registro
  function handleRegister(e) {
    e.preventDefault();
    const email = $('#register-email').val();
    const password = $('#register-password').val();

    $.ajax({
      url: '/auth/register',
      method: 'POST',
      data: { email, password },
      success: function(response) {
        alert('¡Registro exitoso! Serás redirigido al catálogo.');
        window.location.href = '/catalog.html';
      },
      error: function(xhr) {
        alert('Error: ' + xhr.responseJSON.message);
      }
    });
  }

  // 2. Login
  function handleLogin(e) {
    e.preventDefault();
    const email = $('#login-email').val();
    const password = $('#login-password').val();

    $.ajax({
      url: '/auth/login',
      method: 'POST',
      data: { email, password },
      success: function(response) {
        // Redirigir al catálogo al iniciar sesión
        window.location.href = '/catalog.html';
      },
      error: function(xhr) {
        alert('Error: ' + xhr.responseJSON.message);
      }
    });
  }

  // 3. Logout
  function handleLogout() {
    $.ajax({
      url: '/auth/logout',
      method: 'GET',
      success: function() {
        alert('Sesión cerrada.');
        window.location.href = '/login.html';
      },
      error: function() {
        alert('Error al cerrar sesión.');
      }
    });
  }

  // 4. Cargar Productos (Catálogo)
  function loadProducts() {
    $.ajax({
      url: '/api/products', // API protegida
      method: 'GET',
      success: function(products) {
        const $productList = $('#product-list');
        $productList.empty(); // Limpiar lista
        
        products.forEach(product => {
          const productCard = `
            <div class="product-card">
              <img src="${product.imageUrl}" alt="${product.name}">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <div class="price">$${product.price.toFixed(2)}</div>
              <button class="add-to-cart-btn" data-id="${product.id}">
                Añadir al carrito
              </button>
            </div>
          `;
          $productList.append(productCard);
        });

        // Asignar evento a los botones "Añadir al carrito"
        $('.add-to-cart-btn').on('click', addToCart);
      },
      error: function(xhr) {
        // Si hay error 401 (No autorizado), redirigir al login
        if (xhr.status === 401) {
          alert('Debes iniciar sesión para ver el catálogo.');
          window.location.href = '/login.html';
        }
      }
    });
  }

  // 5. Añadir al Carrito
  function addToCart(e) {
    const productId = $(this).data('id');
    
    $.ajax({
      url: '/api/cart/add',
      method: 'POST',
      data: { productId: productId },
      success: function(response) {
        alert('Producto añadido al carrito');
      },
      error: function(xhr) {
        alert('Error: ' + xhr.responseJSON.message);
      }
    });
  }

  // 6. Cargar Carrito (Página del Carrito)
  function loadCart() {
    $.ajax({
      url: '/api/cart',
      method: 'GET',
      success: function(cartItems) {
        const $cartList = $('#cart-items-list');
        $cartList.empty();
        let total = 0;

        if (cartItems.length === 0) {
          $cartList.html('<p>Tu carrito está vacío.</p>');
          $('#payment-btn').hide();
          return;
        }

        cartItems.forEach(item => {
          const itemHtml = `
            <div class="cart-item">
              <img src="${item.Product.imageUrl}" alt="${item.Product.name}" width="50">
              <div class="cart-item-details">
                <strong>${item.Product.name}</strong>
                <p>Cantidad: ${item.quantity}</p>
                <p>Precio: $${item.Product.price.toFixed(2)}</p>
              </div>
              <button class="remove-from-cart-btn" data-id="${item.id}">Eliminar</button>
            </div>
          `;
          $cartList.append(itemHtml);
          total += item.quantity * item.Product.price;
        });

        $('#cart-total').text(`Total: $${total.toFixed(2)}`);
        
        // Asignar evento a botones de eliminar
        $('.remove-from-cart-btn').on('click', removeFromCart);
      },
      error: function(xhr) {
        if (xhr.status === 401) {
          alert('Debes iniciar sesión para ver tu carrito.');
          window.location.href = '/login.html';
        }
      }
    });
  }
  
  // 7. Eliminar del Carrito
  function removeFromCart() {
    const itemId = $(this).data('id'); // Este es el ID del CartItem
    
    $.ajax({
      url: `/api/cart/item/${itemId}`,
      method: 'DELETE',
      success: function(response) {
        alert(response.message);
        loadCart(); // Recargar el carrito
      },
      error: function(xhr) {
        alert('Error: ' + xhr.responseJSON.message);
      }
    });
  }
  // 8. Manejar el Pago (Redirección a Mercado Pago)
  function handlePayment() {
    // Deshabilitar botón para evitar doble click
    $(this).prop('disabled', true).text('Procesando...');

    $.ajax({
      url: '/api/payment/create-preference',
      method: 'POST',
      success: function(response) {
        // Redirigir al checkout de Mercado Pago
        window.location.href = response.init_point;
      },
      error: function(xhr) {
        alert('Error: ' + xhr.responseJSON.message);
        // Habilitar el botón de nuevo si hay un error
        $('#payment-btn').prop('disabled', false).text('Proceder al Pago');
      }
    });
  }
  
  function loadHistory() {
    $.ajax({
      url: '/api/history', // API protegida
      method: 'GET',
      success: function(orders) {
        const $orderList = $('#order-list');
        $orderList.empty();

        if (orders.length === 0) {
          $orderList.html('<p>No has realizado ningún pedido todavía.</p>');
          return;
        }

        orders.forEach(order => {
          // Formatear la fecha
          const date = new Date(order.createdAt).toLocaleDateString('es-CO');
          const statusClass = `order-status-${order.status}`;
          
          let itemsHtml = '';
          order.OrderItems.forEach(item => {
            itemsHtml += `
              <li>
                ${item.quantity} x ${item.Product.name} 
                ($${(item.price * item.quantity).toFixed(2)})
              </li>
            `;
          });

          const orderHtml = `
            <div class="order">
              <div class="order-header">
                <div>
                  <strong>Pedido #${order.id}</strong><br>
                  Fecha: ${date}
                </div>
                <div class_="${statusClass}">
                  ${order.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                </div>
              </div>
              <div class="order-body">
                <strong>Items:</strong>
                <ul>${itemsHtml}</ul>
                <strong>Total: $${order.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          `;
          $orderList.append(orderHtml);
        });

      },
      error: function(xhr) {
        if (xhr.status === 401) {
          alert('Debes iniciar sesión para ver tu historial.');
          window.location.href = '/login.html';
        }
      }
    });
  }

});