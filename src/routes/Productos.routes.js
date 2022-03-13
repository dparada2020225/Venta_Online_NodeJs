// IMPORTACIONES
const express = require('express');
const productosControlador = require('../controllers/Producto.controller');
const md_autenticacion = require('../middlewares/autenticacion');

// RUTAS
const api = express.Router();

//Admin
api.get('/productos', productosControlador.ObtenerProductos); //ver productos (admin y cliente)
api.post('/agregarProductos',md_autenticacion.Auth, productosControlador.AgregarProductos); //Agregar un nuevo producto
api.put('/editarProducto/:idProducto',md_autenticacion.Auth, productosControlador.EditarProductos);//Editar un producto
api.put('/controlStock/:idProducto',md_autenticacion.Auth, productosControlador.stockProducto);// control del stock


module.exports = api;