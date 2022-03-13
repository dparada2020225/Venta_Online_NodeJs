const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

//admin y cliente
api.post('/login', usuarioControlador.Login);// Login de Administrador y de Clientes
//admin
api.post('/nuevoUsuario',md_autenticacion.Auth, usuarioControlador.NuevoUsuario)// nuevos Usuario pasarle solo nombre,email, pasword y rol(ADMIN o CLIENTE)
api.put('/editarRolUsuario/:idUsuario',md_autenticacion.Auth, usuarioControlador.editarRolUser);// Editar rol del Usuario 
api.put('/editarUsuario/:idUsuario',md_autenticacion.Auth, usuarioControlador.EditarUserClientes);// Editar Usuario
api.delete('/eliminarUsuario/:idUsuario',md_autenticacion.Auth, usuarioControlador.EliminarUsuario);// Eliminar Usuario  
//cliente
api.post('/Registrar', usuarioControlador.RegistrarCliente)// registrar clientes
api.put('/EditarPerfil',md_autenticacion.Auth, usuarioControlador.EditarPerfilCliete)// editar perfil del cliente logueado
api.delete('/EliminarPerfil',md_autenticacion.Auth, usuarioControlador.EliminarPerfilCliete)// eliminar perfil del cliente logueado
module.exports = api;