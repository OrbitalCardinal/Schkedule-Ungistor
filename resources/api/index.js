const express = require("express");

// Database
const db = require('./utils/db');

// Routes imports
const usuariosRoute = require('./routes/usuarios');
const tablasRoute = require('./routes/tablas');
const tareasTablaRoute = require('./routes/tareas_tabla');
const tablerosKanban =  require('./routes/tableros_kanban');
const tareasKanban = require('./routes/tareas_kanban');
const diagramasGantt = require('./routes/diagramas_gantt');
const tareasGantt = require('./routes/tareas_gantt');
const horarios = require('./routes/horarios');
const actividadesHorario = require('./routes/actividades_horario');

// Init app
const app = express();
// Decode json
app.use(express.json());
// Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
// Routes declaration
app.use(usuariosRoute);
app.use(tablasRoute);
app.use(tareasTablaRoute);
app.use(tablerosKanban);
app.use(tareasKanban);
app.use(diagramasGantt);
app.use(tareasGantt);
app.use(horarios);
app.use(actividadesHorario);

const server = app.listen(3000);

module.exports = {app, server};