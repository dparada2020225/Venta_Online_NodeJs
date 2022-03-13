const Productos = require('../models/Producto.model');


function ObtenerProductos (req, res) {
    Productos.find({}, (err, productosEncontrados) => {

        let tabla = []
            for (let i = 0; i < productosEncontrados.length; i++) {
                
                tabla.push(`Nombre: ${productosEncontrados[i].nombre}, Disponibles: ${productosEncontrados[i].stock},Precio Unitario: ${productosEncontrados[i].precioCU}, Categoria: ${productosEncontrados[i].IDcategoria.nombre}`)
            }
            //console.log(productosEncontrados)
        return res.status(200).send({ productos: tabla })
    }).populate('IDcategoria','nombre')
}


function AgregarProductos (req, res) {
    var parametros = req.body;
    var modeloProductos = new Productos();
    
    
    if (req.user.rol == "ADMIN") { 
        if( parametros.nombre && parametros.stock && parametros.precio && parametros.IDcategoria){
            modeloProductos.nombre = parametros.nombre;
            modeloProductos.stock = parametros.stock;
            modeloProductos.precioCU = parametros.precio;
            modeloProductos.IDcategoria = parametros.IDcategoria;
            
    
            modeloProductos.save((err, productoGuardado)=>{
                if(err) return res.status(500).send({message:"error en la peticion"})
                if(!productoGuardado) return res.status(500).send({message:"error al guardar el producto"})
                return res.status(200).send({ product: productoGuardado });   
            })
        
        } else {
            return res.send({ mensaje: "Debe enviar los parametros obligatorios."})
        }

    } else {
        return res.status(500).send({ mensaje: 'no puede egregar un producto, no es un administrador' })
    }

}

function EditarProductos(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;


    if (req.user.rol == "ADMIN") { 
        
        Productos.findByIdAndUpdate(idProd, parametros, { new : true } ,(err, productoEditado)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!productoEditado) return res.status(404).send({ mensaje: 'Error al Editar el Producto' });
    
            return res.status(200).send({ productos: productoEditado});
        })
    } else {
        return res.status(500).send({ mensaje: 'no puede egregar un producto, no es un administrador' })
    }
}

function stockProducto(req, res) {
    const productoId = req.params.idProducto;
    const parametros = req.body;
    if (req.user.rol == "ADMIN") { 
        
        if(parametros.stock){
        
            Productos.findByIdAndUpdate(productoId, { $inc : {stock : parametros.stock} }, {new : true},
                (err, stockModificado)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                    if(!stockModificado) return res.status(500).send({mensaje: 'Error incrementar la cantidad del producto'});
        
                    return res.status(200).send({ producto: stockModificado })
                })
            }else{
                return res.status(500).send({ mensaje: "envie los parametros obligatorios" })
            }

    } else {
        return res.status(500).send({ mensaje: 'no puede egregar un producto, no es un administrador' })
    }

}

module.exports = {
    AgregarProductos,
    EditarProductos,
    ObtenerProductos,
    stockProducto
}