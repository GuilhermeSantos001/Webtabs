//================================================================================
// Schema(ManagerFrame)
// Feito para o cadastro de comandos para gerenciar o frame
//================================================================================
/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o método mongoose
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
var managerFrameSchema = new Schema({
    id: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: [true, '{PATH} este campo é obrigatório']
    },
    type: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório']
    },
    value: {
        type: String,
        trim: true,
        required: [true, '{PATH} este campo é obrigatório']
    }
});

/**
 * @public Exportado pelo module.exports
 * @type {{}}
 * @description Define o Schema para criar os comandos
 * @default mongoose.model('managerFrame', managerFrameSchema)
 */
var ManagerFrame = mongoose.model('managerFrame', managerFrameSchema);

//================================================================================
// MODULO PARA EXPORTAR O SCRIPT
//================================================================================
module.exports = ManagerFrame;