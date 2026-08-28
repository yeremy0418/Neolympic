const ADMIN_EMAIL = 'admin@academia.test';
const ADMIN_PASSWORD = 'admin123';
let horarioEnEdicion = null;

const mostrarEstado = (element, texto, tipo = 'error') => {
    element.textContent = texto;
    element.className = `auth-message ${tipo}`;
};

const escapeHtml = (texto) => String(texto).replace(/[&<>'"]/g, (caracter) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[caracter]);

const cargarUsuarios = (select) => {
    const usuarios = window.authModel.obtenerUsuarios();
    select.innerHTML = usuarios.length
        ? usuarios.map((usuario) => `<option value="${escapeHtml(usuario.correo)}">${escapeHtml(usuario.nombre)} (${escapeHtml(usuario.correo)})</option>`).join('')
        : '<option value="">No hay usuarios registrados</option>';
    return usuarios;
};

const limpiarFormulario = (form) => {
    form.reset();
    horarioEnEdicion = null;
    form.querySelector('[type="submit"]').textContent = 'Crear horario';
};

const renderizarHorarios = (correo, cuerpo) => {
    const horarios = window.horariosModel.obtenerHorarios(correo);
    cuerpo.innerHTML = horarios.length
        ? horarios.map((horario) => `<tr><th scope="row">${escapeHtml(horario.dia)}</th><td>${escapeHtml(horario.actividad)}</td><td>${escapeHtml(horario.distancia)} m</td><td>${escapeHtml(horario.hora)}</td><td><button class="table-action" type="button" data-editar="${horario.id}">Editar</button><button class="table-action danger" type="button" data-eliminar="${horario.id}">Eliminar</button></td></tr>`).join('')
        : '<tr><td colspan="5">Este usuario todavía no tiene horarios asignados.</td></tr>';
};

window.iniciarAdmin = () => {
    const accessForm = document.querySelector('[data-admin-access]');
    const panel = document.querySelector('[data-admin-panel]');
    const scheduleForm = document.querySelector('[data-schedule-form]');
    const userSelect = document.querySelector('[data-user-select]');
    const tableBody = document.querySelector('[data-schedule-list]');
    const message = document.querySelector('[data-admin-message]');
    if (!accessForm || !panel || !scheduleForm || !userSelect || !tableBody || !message) return;

    accessForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(accessForm);
        if (data.get('correo') !== ADMIN_EMAIL || data.get('password') !== ADMIN_PASSWORD) {
            mostrarEstado(message, 'Credenciales de administrador incorrectas.');
            return;
        }
        panel.hidden = false;
        accessForm.hidden = true;
        cargarUsuarios(userSelect);
        renderizarHorarios(userSelect.value, tableBody);
        mostrarEstado(message, 'Acceso de administrador concedido.', 'success');
    });

    userSelect.addEventListener('change', () => renderizarHorarios(userSelect.value, tableBody));

    scheduleForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!userSelect.value) {
            mostrarEstado(message, 'Registra al menos un usuario antes de crear horarios.');
            return;
        }
        const data = new FormData(scheduleForm);
        const datos = { correo: userSelect.value, dia: data.get('dia'), actividad: data.get('actividad'), distancia: data.get('distancia'), hora: data.get('hora') };
        if (horarioEnEdicion) window.horariosModel.actualizarHorario(horarioEnEdicion, datos);
        else window.horariosModel.crearHorario(datos);
        limpiarFormulario(scheduleForm);
        renderizarHorarios(userSelect.value, tableBody);
        mostrarEstado(message, 'Horario guardado correctamente.', 'success');
    });

    tableBody.addEventListener('click', (event) => {
        const editar = event.target.closest('[data-editar]');
        const eliminar = event.target.closest('[data-eliminar]');
        if (editar) {
            const horario = window.horariosModel.obtenerHorarios(userSelect.value).find((item) => item.id === editar.dataset.editar);
            if (!horario) return;
            horarioEnEdicion = horario.id;
            scheduleForm.dia.value = horario.dia;
            scheduleForm.actividad.value = horario.actividad;
            scheduleForm.distancia.value = horario.distancia;
            scheduleForm.hora.value = horario.hora;
            scheduleForm.querySelector('[type="submit"]').textContent = 'Actualizar horario';
        }
        if (eliminar && window.confirm('¿Eliminar este horario?')) {
            window.horariosModel.eliminarHorario(eliminar.dataset.eliminar);
            renderizarHorarios(userSelect.value, tableBody);
            mostrarEstado(message, 'Horario eliminado.', 'success');
        }
    });
};
