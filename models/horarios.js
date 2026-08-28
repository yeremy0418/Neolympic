(function () {
const SCHEDULES_KEY = 'academia_horarios';

const obtenerTodos = () => JSON.parse(localStorage.getItem(SCHEDULES_KEY) || '[]');
const guardarTodos = (horarios) => localStorage.setItem(SCHEDULES_KEY, JSON.stringify(horarios));

const obtenerHorarios = (correo) => obtenerTodos().filter((horario) => horario.correo === correo);

const crearHorario = (datos) => {
    const horario = { ...datos, id: Date.now().toString() };
    guardarTodos([...obtenerTodos(), horario]);
    return horario;
};

const actualizarHorario = (id, datos) => {
    const horarios = obtenerTodos().map((horario) => horario.id === id ? { ...horario, ...datos } : horario);
    guardarTodos(horarios);
};

const eliminarHorario = (id) => guardarTodos(obtenerTodos().filter((horario) => horario.id !== id));

window.horariosModel = { obtenerHorarios, crearHorario, actualizarHorario, eliminarHorario };
})();
