const mostrarMensaje = (element, message, type = 'error') => {
    element.textContent = message;
    element.className = `auth-message ${type}`;
};

const configurarPestanas = () => {
    const buttons = document.querySelectorAll('[data-auth-tab]');
    const forms = document.querySelectorAll('[data-auth-form]');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            buttons.forEach((item) => item.classList.toggle('is-active', item === button));
            forms.forEach((form) => form.hidden = form.dataset.authForm !== button.dataset.authTab);
        });
    });
};

window.iniciarAutenticacion = () => {
    const loginForm = document.querySelector('[data-login-form]');
    const registerForm = document.querySelector('[data-register-form]');
    const message = document.querySelector('[data-auth-message]');
    if (!loginForm || !registerForm || !message) return;

    configurarPestanas();

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(loginForm);
        try {
            const usuario = window.authModel.autenticarUsuario(data.get('correo'), data.get('password'));
            mostrarMensaje(message, `Bienvenido, ${usuario.nombre}.`, 'success');
            loginForm.reset();
        } catch (error) {
            mostrarMensaje(message, error.message);
        }
    });

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(registerForm);
        if (data.get('password') !== data.get('confirmPassword')) {
            mostrarMensaje(message, 'Las contraseñas no coinciden.');
            return;
        }
        if (data.get('password').length < 6) {
            mostrarMensaje(message, 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        try {
            window.authModel.registrarUsuario({ nombre: data.get('nombre'), correo: data.get('correo'), password: data.get('password') });
            mostrarMensaje(message, `Cuenta creada. Bienvenido, ${data.get('nombre')}.`, 'success');
            registerForm.reset();
        } catch (error) {
            mostrarMensaje(message, error.message);
        }
    });

    const session = window.authModel.obtenerSesion();
    if (session) mostrarMensaje(message, `Sesión activa para ${session.nombre}.`, 'success');
};
