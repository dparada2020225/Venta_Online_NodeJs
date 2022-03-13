const Usuario = require('../models/usuario.model');
const Carrito = require('../models/Carrito.model');
const Factura = require('../models/Factura.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');



function UsuarioDefault(req, res) {
    var modeloUsuario = new Usuario();
    Usuario.find({ email: "ADMIN@gmail.com", nombre: "ADMIN" }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
            console.log({ mensaje: "ya se ha creado el usuario del Administrador" })
        } else {
            modeloUsuario.nombre = "ADMIN";
            modeloUsuario.email = "ADMIN@gmail.com";
            modeloUsuario.password = "123456";
            modeloUsuario.rol = "ADMIN";
            bcrypt.hash(modeloUsuario.password, null, null, (err, passwordEncryptada) => {
                modeloUsuario.password = passwordEncryptada
                modeloUsuario.save((err, usuarioGuardado) => {
                    if (err) console.log({ mensaje: 'error en la peticion ' })
                    if (!usuarioGuardado) console.log({ mensaje: 'error al crear usuario por defecto ' })
                    console.log({ Usuario: usuarioGuardado })

                })
            })
        }
    })

}
//admin
function Login(req, res) {
    var parametros = req.body;

    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion ' });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, Verificaciondepasswor) => {
                if (Verificaciondepasswor) {
                    if(usuarioEncontrado.rol == "CLIENTE"){
                        //{idUser: usuarioEncontrado._id}
                        Factura.find({idUser: usuarioEncontrado._id},(err, facturasEncontradas)=>{
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'})
                            if(!facturasEncontradas) return res.status(500).send({ mensaje: 'Error al encontrar facturas'})


                            let tabla = []
                            let numero = 0
                            tabla.push(`Nombre del Cliente: ${usuarioEncontrado.nombre}` )
                                for (let i = 0; i < facturasEncontradas.length; i++) {
                                    
                                    if(String(facturasEncontradas[i].IdUser) == String(usuarioEncontrado._id)){
                                        numero=numero+1
                                        tabla.push(`\n Factura #${numero}. Cantidad de productos comprados: ${facturasEncontradas[i].Productos.length}, Total de la factura: Q.${facturasEncontradas[i].total}.°°`)
                                        console.log(facturasEncontradas[i].IdUser)
                                    }
                                    
                                }
                                console.log(facturasEncontradas.length,facturasEncontradas,usuarioEncontrado._id)
                            
                            return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) ,Compras: tabla})
                        })
                        
                    }else{
                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) })}
                    
                } else {
                    return res.status(500).send({ mensaje: 'la contraseña no coincide' })
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'El usuario nose ha podido identificar' })
        }
    })
}
function NuevoUsuario(req, res) {
    
    var carritomodel = new Carrito();
    if (req.user.rol == "ADMIN") {
        var modelUser = new Usuario();
        var parametros = req.body;
        Usuario.find({ email: parametros.email, nombre: parametros.nombre }, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ error: "error en la peticion" })
            if (usuarioEncontrado.length > 0) {
                return res.status(200).send({ mensaje: "ya se ha existe el usuario" })
            } else {

                if (parametros.nombre && parametros.password && parametros.rol) {
                    if (parametros.rol == "ADMIN" || parametros.rol == "CLIENTE") {

                        modelUser.nombre = parametros.nombre
                        modelUser.email = parametros.email
                        modelUser.password = parametros.password
                        modelUser.rol = parametros.rol

                        bcrypt.hash(modelUser.password, null, null, (err, passwordEncryptada) => {
                            modelUser.password = passwordEncryptada
                            modelUser.save((err, usuarioGuardado) => {
                                if (err) return res.status(500).send({ mensaje: 'error en la peticion ' })
                                if (!usuarioGuardado) return res.status(500).send({ mensaje: 'error al crear usuario por defecto ' })
                                if(parametros.rol =="CLIENTE"){
                                carritomodel.IdUser = usuarioGuardado._id
                                carritomodel.total = 0
                                carritomodel.save((err, carritoCreado) => {
                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                if (!carritoCreado) return res.status(500).send({ mensaje: 'Error al crear carrito' });
                                return res.status(200).send({ usuario: usuarioGuardado, carrito: carritoCreado});
                            })
                                }
                                
                                

                            })
                        })
                    } else {
                        return res.status(500).send({ mensaje: 'Solo puede agregar rol tipo <<ADMIN>> o <<CLIENTE>>' })
                    }
                } else {
                    return res.status(500).send({ mensaje: 'agregue los parametros obligatorios' })
                }
            }
        })

    } else {
        return res.status(500).send({ mensaje: 'no puede egregar un usuario, no es un administrador' })
    }

}

function editarRolUser(req, res) {
    if (req.user.rol == "ADMIN") {

    var idUser = req.params.idUsuario;
    var parametros = req.body;
    if (parametros.rol == "ADMIN" || parametros.rol == "CLIENTE"){
        Usuario.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al editar el Usuario' });

            return res.status(200).send({ usuario: usuarioActualizado })
        })
    }else{
        return res.status(200).send({ error: "solo puede asignar roles tipo ADMIN y CLIENTE"})

    }
    
    } else {
        return res.status(500).send({ mensaje: 'no puede editar un usuario, no es un administrador' })
    }


}

function EditarUserClientes(req, res) {
    if (req.user.rol == "ADMIN") {
        var idUser = req.params.idUsuario;
        var parametros = req.body;

    Usuario.findById(idUser, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el usuario el Usuario' });

        if (usuarioEncontrado.rol == "CLIENTE") {
            Usuario.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioActualizado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al editar el Usuario' });

                return res.status(200).send({ usuario: usuarioActualizado })
            })
        } else {
            return res.status(200).send({ error: "no puede editar este usuario ya que es un ADMIN" })
        }
    })

    } else {
        return res.status(500).send({ mensaje: 'no puede editar un usuario, no es un administrador' })
    }

}


function EliminarUsuario(req, res) {
    if (req.user.rol == "ADMIN") {
        var idUser = req.params.idUsuario;

    Usuario.findById(idUser, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el usuario el Usuario' });

        if (usuarioEncontrado.rol == "CLIENTE") {
            Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al editar el Usuario' });

                Carrito.findOneAndDelete({idUser:usuarioEliminado._id},(err, CarritoEliminado)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if(!CarritoEliminado) return res.status(500).send({ mensaje: 'Error al editar el Usuario'});
                    return res.status(200).send({usuarioEliminado : usuarioEliminado, CarritoEliminado : CarritoEliminado})
                })
            })
        } else {
            return res.status(200).send({ error: "no puede editar este usuario ya que es un ADMIN" })
        }
    })
    

    } else {
        return res.status(500).send({ mensaje: 'no puede editar un usuario, no es un administrador' })
    }

}

function RegistrarCliente(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();
    var carritomodel = new Carrito();

    if(parametros.nombre && parametros.email && parametros.password) {
            usuarioModel.nombre = parametros.nombre;
            usuarioModel.email = parametros.email;
            usuarioModel.rol = 'CLIENTE';

            Usuario.find({ email : parametros.email, nombre : parametros.nombre}, (err, usuarioEncontrado) => {
                if(err) return res.status(500).send({ error: "error en la peticion"})
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al agregar el Usuario'});
                            
                            carritomodel.IdUser = usuarioGuardado._id
                            carritomodel.total = 0
                            carritomodel.save((err, carritoCreado) => {
                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                if (!carritoCreado) return res.status(500).send({ mensaje: 'Error al crear carrito' });
                                return res.status(200).send({ usuario: usuarioGuardado, carrito: carritoCreado});
                            })

                            
                        });
                    });  
                } else {
                    return res.status(500).send({ mensaje: 'Este usuario ya  se encuentra utilizado, cambie el nombre o e email' });
                }
            })
    }else{
        return res.status(500).send({ mensaje: 'agregue los parametros obligatorios' });
    }
}

function EditarPerfilCliete(req, res) {
    var parametros = req.body;    
    var id = req.user.sub
    if(!parametros.rol){ 
    Usuario.findByIdAndUpdate(id, parametros, {new : true},
        
        (err, usuarioActualizado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al editar el Usuario'});
            
            return res.status(200).send({usuario : usuarioActualizado})
        })
    }else{ return res.status(200).send({mensaje: "no tiene permisos para editar su rol"})}
    }

function EliminarPerfilCliete(req, res) {   
        var id = req.user.sub
        var parametros = req.body;
        if(parametros.eliminar=="true"){
        
        Carrito.findOne({IdUser:id},(err, encontrado)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!encontrado) return res.status(500).send({ mensaje: 'Error al encontrar el carrito'});

                Usuario.findByIdAndDelete(id,(err, Eliminado)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if(!Eliminado) return res.status(500).send({ mensaje: 'Error al encontrar el Usuario'});
                    
                    Carrito.findByIdAndDelete(encontrado._id,(err, CarritoEliminado)=>{
                        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if(!CarritoEliminado) return res.status(500).send({ mensaje: 'Error al editar el Usuario'});
     
                        return res.status(200).send({usuarioEliminado : Eliminado, CarritoEliminado : CarritoEliminado})
                    })
                })             
        })}else{
            return res.status(200).send({mensaje :"mande el parametro eliminar con el valor true"})
        }
        
        }

module.exports = {
    UsuarioDefault,
    Login,
    NuevoUsuario,
    editarRolUser,
    EditarUserClientes,
    EliminarUsuario,
    RegistrarCliente,
    EditarPerfilCliete,
    EliminarPerfilCliete
}