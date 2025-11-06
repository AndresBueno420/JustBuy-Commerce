// app/public/js/auth.js

$(document).ready(function() {

    // Lógica para register.html
    if ($('#register-form').length > 0) {
        $('#register-form').on('submit', function(e) {
            e.preventDefault();
            const password = $('#new-password').val();

            if (password !== $('#confirm-password').val()) {
                alert("Las contraseñas no coinciden.");
                return;
            }
            
            // Llama a la función de la API
            api.register(
                $('#new-email').val(),
                $('#new-username').val(),
                password
            )
            .done(function(response) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                window.location.href = 'login.html';
            })
            .fail(function(err) {
                alert('Error en el registro: ' + err.responseJSON.message);
            });
        });
    }

    // Lógica para login.html
    if ($('#login-form').length > 0) {
        $('#login-form').on('submit', function(e) {
            e.preventDefault();
            
            // Llama a la función de la API
            api.login(
                $('#username').val(),
                $('#password').val()
            )
            .done(function(response) {
                console.log("Respuesta del servidor al loguearse:", response);
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userId', response.userId); 
                alert('¡Inicio de sesión exitoso!');
                window.location.href = 'index.html';
            })
            .fail(function(err) {
                alert('Error: ' + err.responseJSON.message);
            });
        });
    }

});