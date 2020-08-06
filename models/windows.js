//================================================================================
// Schema(Windows)
// Feito para o cadastro de janelas
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
const webPreferencesSchema = new mongoose.Schema({
    nodeIntegrationInSubFrames: {
        type: Boolean,
        required: [true, '{PATH} este campo é obrigatório']
    },
    nodeIntegrationInWorker: {
        type: Boolean,
        required: [true, '{PATH} este campo é obrigatório']
    },
    nodeIntegration: {
        type: Boolean,
        required: [true, '{PATH} este campo é obrigatório']
    },
    webviewTag: {
        type: Boolean,
        required: [true, '{PATH} este campo é obrigatório']
    },
    webSecurity: {
        type: Boolean,
        required: [true, '{PATH} este campo é obrigatório']
    }
});

/**
 * @private Restrito ao escopo global
 * @type object
 * @description Cria uma instancia da classe Schema
 * @default new Schema({})
 */
var windowsSchema = new Schema({
    id: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: [true, '{PATH} este campo é obrigatório']
    },
    width: {
        type: Number,
        required: [true, '{PATH} este campo é obrigatório']
    },
    height: {
        type: Number,
        required: [true, '{PATH} este campo é obrigatório']
    },
    x: {
        type: Number,
        required: [true, '{PATH} este campo é obrigatório']
    },
    y: {
        type: Number,
        required: [true, '{PATH} este campo é obrigatório']
    },
    webPreferences: {
        type: webPreferencesSchema,
        default: {}
    }
});

/**
 * @public Exportado pelo module.exports
 * @type {{}}
 * @description Define o Schema para criar as janelas
 * @default mongoose.model('windows', windowsSchema)
 */
var Windows = mongoose.model('windows', windowsSchema);

//================================================================================
// MODULO PARA EXPORTAR O SCRIPT
//================================================================================
module.exports = Windows;