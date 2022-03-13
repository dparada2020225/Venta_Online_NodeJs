const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({
    nombre: String  
})

module.exports = mongoose.model('Categorias', CategoriaSchema);