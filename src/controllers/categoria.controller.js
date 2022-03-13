const Categorias = require('../models/Categoria.model');
const Productos = require('../models/Producto.model');

function CrearCategoria(req,res) {
    var modeloCategoria = new Categorias();
    var parametros = req.body;

    if (req.user.rol == "ADMIN") {
    
        if( parametros.nombre ){
            modeloCategoria.nombre = parametros.nombre;
    
            modeloCategoria.save((err, CategoriaGuardada) => {
                if(err) return res.status(500).send({error: "error en la peticion"})
                if(!CategoriaGuardada) return res.status(500).send({error: "error al crear la categoria"})
                return res.send({ Categoria: CategoriaGuardada});
            });
        } else {
            return res.send({ mensaje: "Debe enviar los parametros obligatorios."})
        }
    } else {
        return res.status(500).send({ mensaje: 'no puede egregar una categoria, no es un administrador' })
    }
      
}
function VerTodasLasCategorias(req,res) {
    
    Categorias.find({},(err,CategoriasGuardadas) => {
        if (err) return res.status(500).send({error: "error en la peticion"})
        if(!CategoriasGuardadas) return res.status(500).send({mensaje: "error al obtener las categorias"})

        let tabla = []
            for (let i = 0; i < CategoriasGuardadas.length; i++) {
                
                tabla.push(`Nombre: ${CategoriasGuardadas[i].nombre}`)
            }


        return res.status(200).send({Categorias: tabla})
    })
}
function EditarCategoria(req,res) {
    var IdCat = req.params.idCategoria;
    var parametros = req.body;  

    if (req.user.rol == "ADMIN") {
    
        Categorias.findByIdAndUpdate(IdCat, parametros, { new : true } , (err,categoriaEditada) => {
            if (err) return res.status(500).send({error: "error en la peticion"})
            if(!categoriaEditada) return res.status(500).send({mensaje: "error al editar esta categoria"})

            return res.status(200).send({CategoriaEditada: categoriaEditada})
        })
    } else {
        return res.status(500).send({ mensaje: 'no puede editar una categoria, no es un administrador' })
    }
      
}

function eliminarCategoriaADefault(req, res) {
    
    if (req.user.rol == "ADMIN") {
        const categoriaId = req.params.IdCategoria;
        Categorias.findOne({ _id: categoriaId}, (err, CategoriaEncontrada)=>{
            if(err) return res.status(500).send({ message:"error en la peticion"})
            if(!CategoriaEncontrada){
                return res.status(400).send({ mensaje: 'Error al encontrar la categoria'});
            } else {
                Categorias.findOne({ nombre : 'Por Defecto' }, (err, CategoriaEncontrado) => {
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion'})
                    if(!CategoriaEncontrado){
    
                        const modelCategoria = new Categorias();
                        modelCategoria.nombre = 'Por Defecto';
    
                        modelCategoria.save((err, categoriaGuardada)=>{
                            if(err) return res.status(400).send({ mensaje: 'Error en la peticion de Guardar Curso'});
                            if(!categoriaGuardada) return res.status(400).send({ mensaje: 'Error al guardar el curso'});
    
                            Productos.updateMany({ IDcategoria: categoriaId }, { IDcategoria: categoriaGuardada._id }, 
                                (err, CategoriasEditadas) => {
                                    if(err) return res.status(400).send({ mensaje: 'Error en la peticion de actualizar asignaciones'});
                                    
                                        Categorias.findByIdAndDelete(categoriaId, (err, CategoriaEliminada)=>{
                                        if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar curso"});
                                        if(!CategoriaEliminada) return res.status(400).send({ mensaje: 'Error al eliminar el curso'});
    
                                        return res.status(200).send({ 
                                            editado: CategoriasEditadas,
                                            eliminado: CategoriaEliminada
                                        })
                                    })
                                })
                        })
    
                    } else {
                        Categorias.findOne({nombre:"Por Defecto"},(err,categoriaGuardada)=>{
                            if(err) return res.status(500).send({error: "error en la peticion"})
                            if(!categoriaGuardada) return res.status(500).send({error: "error al encontrar la categoria por defecto"})

                            Productos.updateMany({ IDcategoria: categoriaId }, { IDcategoria: categoriaGuardada._id }, 
                                (err, CategoriasEditadas) => {
                                    if(err) return res.status(400).send({ mensaje: 'Error en la peticion de actualizar asignaciones'});
                                    
                                        Categorias.findByIdAndDelete(categoriaId, (err, CategoriaEliminada)=>{
                                        if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar curso"});
                                        if(!CategoriaEliminada) return res.status(400).send({ mensaje: 'Error al eliminar el curso'});
    
                                        return res.status(200).send({ 
                                            editado: CategoriasEditadas,
                                            eliminado: CategoriaEliminada
                                    })
                                })
                            })
                        })
    
                        
    
                    }
                })
            }
        })

    } else {
        return res.status(500).send({ mensaje: 'no puede eliminar una categoria, no es un administrador' })
    }

}


module.exports = {
    CrearCategoria,
    VerTodasLasCategorias,
    EditarCategoria,
    eliminarCategoriaADefault
};