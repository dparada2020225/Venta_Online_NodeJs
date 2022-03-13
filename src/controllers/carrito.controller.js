const Carrito = require('../models/Carrito.model');
const Productos = require('../models/Producto.model');


function añadirProductoAcarrito(req, res) {
    var idUsuarioLogueado = req.user.sub
    var parametros = req.body;
    if (parametros.nombre && parametros.cantidad) {

        Carrito.findOne({ IdUser: idUsuarioLogueado }, (err, encontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion1' });
            if (!encontrado) return res.status(500).send({ mensaje: 'Error al encontrar el carrito' });

            Carrito.findById(encontrado._id, (err, carrito) => {

                var si = false;
                var id = null;
                for (let i = 0; i < carrito.Productos.length; i++) {
                    if (parametros.nombre == carrito.Productos[i].idProducto.nombre) {
                        si = true
                        id = carrito.Productos[i]._id
                    } else {
                        si = false
                        id = null
                    }
                }
                if (si == true) {


                    Productos.findOne({ nombre: parametros.nombre }, (err, productoEncontrado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion2' });
                        if (!productoEncontrado) return res.status(500).send({ mensaje: 'El producto no existe' });



                        let cantidadsumada= carrito.Productos[0].cantidad
                        let cantidadsumada2= Number(parametros.cantidad)
                        let cantidadSumanda3 = cantidadsumada +cantidadsumada2 
                                if (productoEncontrado.stock >= cantidadSumanda3) {
                                    Carrito.findOneAndUpdate({ Productos: { $elemMatch: { _id: id } } }, { $inc: { "Productos.$.cantidad": parametros.cantidad } }, { new: true }, (err, CantidadActualiada) => {
                                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                        if (!CantidadActualiada) return res.status(500).send({ mensaje: 'Error al editar el empleado' });
                                        let cantidadsumada= carrito.Productos[0].cantidad+parametros.cantidad
                                        
            
                                            var BsubTotal = Number(CantidadActualiada.Productos[0].cantidad) * productoEncontrado.precioCU
                                            Carrito.findOneAndUpdate({ Productos: { $elemMatch: { _id: id } } }, { "Productos.$.subTotal": BsubTotal }, { new: true }, (err, ProductoAñadido) => {
                                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion3' });
                                                if (!ProductoAñadido) return res.status(500).send({ mensaje: 'Error al editar el carrit2' });
            
                                                let totalCarritoLocal = 0;
                                                for (let i = 0; i < ProductoAñadido.Productos.length; i++) {
                                                    totalCarritoLocal = totalCarritoLocal + ProductoAñadido.Productos[i].subTotal;
            
                                                }
            
                                                Carrito.findByIdAndUpdate(encontrado._id, { total: totalCarritoLocal }, { new: true }, (err, ProductoNuevo) => {
                                                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion4' });
                                                    if (!ProductoNuevo) return res.status(500).send({ mensaje: 'Error al agregar el total' });
            
                                                    return res.status(200).send({ ProductoAñadido: ProductoNuevo })
                                                })
                                            })
            
                                        
            
                                    })

                                } else {
                                return res.status(200).send({ mensaje: "no hay la cantidad suficiente en stock12" })
                            }
                        


                    })

                } else {

                    Productos.findOne({ nombre: parametros.nombre }, (err, productoEncontrado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion2' });
                        if (!productoEncontrado) return res.status(500).send({ mensaje: 'El producto no existe' });

                        if (productoEncontrado.stock >= parametros.cantidad) {

                            var BsubTotal = Number(parametros.cantidad) * productoEncontrado.precioCU
                            Carrito.findOneAndUpdate({ _id: encontrado._id }, { $push: { Productos: { idProducto: productoEncontrado._id, cantidad: parametros.cantidad, subTotal: BsubTotal } } }, { new: true }, (err, ProductoAñadido) => {
                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion3' });
                                if (!ProductoAñadido) return res.status(500).send({ mensaje: 'Error al editar el carrit2' });

                                let totalCarritoLocal = 0;
                                for (let i = 0; i < ProductoAñadido.Productos.length; i++) {
                                    totalCarritoLocal = totalCarritoLocal + ProductoAñadido.Productos[i].subTotal;

                                }

                                Carrito.findByIdAndUpdate(encontrado._id, { total: totalCarritoLocal }, { new: true }, (err, ProductoNuevo) => {
                                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion4' });
                                    if (!ProductoNuevo) return res.status(500).send({ mensaje: 'Error al agregar el total' });

                                    return res.status(200).send({ ProductoAñadido: ProductoNuevo })
                                })
                            })
                        } else {
                            return res.status(200).send({ mensaje: "no hay la cantidad suficiente en stock" })
                        }
                    })

                }
            }).populate('Productos.idProducto', 'nombre')

        })
    } else {
        return res.status(500).send({ mensaje: 'agregue los parametros obligatorios' });
    }
}

function eliminarProductoCarrito(req, res) {

    const IdProducto = req.params.IdProducto;

        Carrito.findOne({ Productos: { $elemMatch: { _id: IdProducto } } }, (err, CarritoEncontrado)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!CarritoEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el Producto' });
            if(CarritoEncontrado.IdUser == req.user.sub){
                Carrito.findOneAndUpdate({ Productos: { $elemMatch: { _id: IdProducto } } },
                    { $pull: { Productos: { _id: IdProducto } } }, { new: true } , (err, ProductoEliminado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if (!ProductoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el Proveedor' });
            
                        return res.status(200).send({ ProductoEliminado: ProductoEliminado.Productos })
                    })
            }else{
                return res.status(200).send({mensaje: "no puede eliminar productos de este carrito"})
            }

        })

        

}

module.exports = {
    añadirProductoAcarrito,
    eliminarProductoCarrito
};