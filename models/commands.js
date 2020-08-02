//================================================================================
// Schema(Commands)
// Feito para o cadastro de usuarios
//================================================================================
/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o metodo mongoose
 * @default require('mongoose')
 */
var mongoose = require('mongoose');

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa a classe Schema do mongoose
 * @default mongoose.Schema
 */
var Schema = mongoose.Schema;

/**
 * @private Restrito ao escopo global
 * @type object
 * @description Cria uma instancia da classe Schema
 * @default new Schema({})
 */
var commandsSchema = new Schema({
    id: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: [true, '{PATH} este campo é obrigatório']
    },
    value: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório']
    }
});

/**
 * @public Exportado pelo module.exports
 * @type {{}}
 * @description Define o Schema para criar os usuarios
 * @default mongoose.model('commands', commandsSchema)
 */
var Commands = mongoose.model('commands', commandsSchema);

//================================================================================
// MODULO PARA EXPORTAR O SCRIPT
//================================================================================
module.exports = Commands;