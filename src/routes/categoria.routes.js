const express = require('express');
const CategoriaControlador = require('../controllers/categoria.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

//Admin 
api.post('/CrearCategoria',md_autenticacion.Auth, CategoriaControlador.CrearCategoria); // crear Categoria
api.get('/Categorias', CategoriaControlador.VerTodasLasCategorias); // ver categorias (admin y cliente)
api.put('/EditarCategoria/:idCategoria',md_autenticacion.Auth, CategoriaControlador.EditarCategoria) // editar Categoria po id
api.delete('/EliminarCategoria/:IdCategoria',md_autenticacion.Auth, CategoriaControlador.eliminarCategoriaADefault) // eliminar Categoria y si hay productos con esa categoria pasarlos a una categoria por default

//cliente (algunas rutas estan repetidas par tener un orden)
api.get('/Categorias', CategoriaControlador.VerTodasLasCategorias); // ver categorias (admin y cliente) 
module.exports = api;