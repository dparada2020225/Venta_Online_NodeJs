const mongoose = require('mongoose');
const usuarioControlador = require('./src/controllers/usuario.controller');
const app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");

    app.listen(3000, function () {
        console.log("Esta corriendo en el puerto 3000!")
        usuarioControlador.UsuarioDefault();
        
    })

}).catch(error => console.log(error));
