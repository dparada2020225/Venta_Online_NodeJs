const express = require('express');
const FacturaControlador = require('../controllers/factura.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();
api.get('/factura',md_autenticacion.Auth,FacturaControlador.CarritoAFactura) // limpia el carrito y se crea la factura
api.get('/facturasExistentes',md_autenticacion.Auth,FacturaControlador.VerFacturasUser)// facturas que tienen los usuarios
api.get('/ProductosDeUnaFactura/:idFactura',md_autenticacion.Auth,FacturaControlador.ProductosFactura)// ver los productos de una factura
api.get('/ProductosAgotados',md_autenticacion.Auth,FacturaControlador.ProductosAgotados)// ver los productos agotados
api.get('/ProductosMasVendidos',FacturaControlador.ProductosMasVendidos)//productos mas vendidos

api.post('/ProductoPorNombre',FacturaControlador.BusquedaNombreProducto) // productos por nombre producto
api.post('/ProductosPorCategoria',FacturaControlador.ProductosPorCategoria)// productos por nombre de la categoria

//cliente
api.get('/ProductosMasVendidos',FacturaControlador.ProductosMasVendidos)//productos mas vendidos

module.exports = api;