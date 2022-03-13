
const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuario.routes');
const CategoriaRutas = require('./src/routes/categoria.routes');
const ProductoRutas = require('./src/routes/Productos.routes');
const CarritoRutas = require('./src/routes/carrito.routes');
const FacturatoRutas = require('./src/routes/factura.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas, CategoriaRutas, ProductoRutas, CarritoRutas,FacturatoRutas);


module.exports = app;