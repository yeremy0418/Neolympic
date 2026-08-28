(function () {
const USERS_KEY = 'academia_nadadores';
const SESSION_KEY = 'academia_sesion';

const obtenerUsuarios = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

const registrarUsuario = ({ nombre, correo, password }) => {
    const usuarios = obtenerUsuarios();
    const correoNormalizado = correo.trim().toLowerCase();

    if (usuarios.some((usuario) => usuario.correo === correoNormalizado)) {
        throw new Error('Ya existe una cuenta con este correo.');
    }

    const usuario = { nombre: nombre.trim(), correo: correoNormalizado, password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...usuarios, usuario]));
    iniciarSesion(usuario);
};

const iniciarSesion = ({ correo, password, nombre }) => {
    const sesion = { nombre, correo: correo.trim().toLowerCase() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
};

const autenticarUsuario = (correo, password) => {
    const usuario = obtenerUsuarios().find((item) => item.correo === correo.trim().toLowerCase() && item.password === password);
    if (!usuario) throw new Error('El correo o la contraseña no son correctos.');
    iniciarSesion(usuario);
    return usuario;
};

const cerrarSesion = () => localStorage.removeItem(SESSION_KEY);

const obtenerSesion = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

window.authModel = { registrarUsuario, autenticarUsuario, cerrarSesion, obtenerSesion, obtenerUsuarios };
})();
