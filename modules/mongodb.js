//================================================================================
// MongoDB
// Banco de dados
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
 * @description Importa as configurações do mongoDB
 * @default require('../configs/mongodb')
 */
var configMongoDB = require('../configs/mongodb') || {
    "user": {}
};

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Importa o modulo para criar o Schema de comandos
 * @default require('../models/commands')
 */
var Schema_Commands = require('../models/commands');

/**
 * @private Restrito ao escopo global
 * @type {{}}
 * @description Endereço de DNS do mongoDB
 * @default `mongodb://${configMongoDB.user.name}:${configMongoDB.user.password}@${configMongoDB.address}:${configMongoDB.port}/${configMongoDB.db}?authSource=admin`
 */
var uri = `mongodb://${configMongoDB.user.name}:${configMongoDB.user.password}@${configMongoDB.address}:${configMongoDB.port}/${configMongoDB.db}?authSource=admin`;

//================================================================================
// EVENTOS DE CONEXÂO COM O MONGODB
//================================================================================
/**
 * @description Se a conexão for estabelecida
 */
mongoose.connection.on('connected', function () {
    console.log(`A conexão com o mongoDB foi estabelecida em ${uri}`);
});

/**
 * @description Se o correr erros com a conexão
 */
mongoose.connection.on('error', function (err) {
    console.error(`A conexão com o mongoDB teve um erro ${err}`);
});

/**
 * @description Quando a conexão é desconectada
 */
mongoose.connection.on('disconnected', function () {
    console.log(`A conexão com o mongoDB foi fechada`);
});

/**
 * @description Quando a conexão está aberta
 */
mongoose.connection.on('open', function () {
    console.log(`A conexão com o mongoDB foi aberta`);
});

/**
 * @description Se o aplicativo fechar, feche a conexão
 */
process.on('SIGINT', function () {
    mongoose.connection.close(function (error) {
        if (error) {
            return console.error(error);
        }

        if (mongoose.connection.readyState == 1) {
            console.log(`A conexão com o mongoDB foi fechada, devido ao encerramento do servidor`);
        }

        process.exit(0);
    });
});

//================================================================================
// MODULOS DO BANCO DE DADOS
//================================================================================
/**
 * @description Cria um novo comando
 * @param {string} id Identificador do comando
 * @param {string} value O valor do comando
 * @param {function} callback Função a ser retornada com uma array de resposta
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function createCommand(id, value, callback) {
    mongoose.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }, (err, db) => {
        if (err) {
            callback([
                `Não foi possivel conectar com o mongoDB (Database ${db})`,
                err
            ])
            return mongoose.connection.close();
        }
        mongooseConnected();
    });

    function mongooseConnected() {
        var command = new Schema_Commands({
            id: String(id),
            value: String(value)
        });
        command.validate((err) => {
            if (err) {
                console.error(`Não é possivel criar o novo comando com o identificador(${id})`);
                console.error(err);
                return mongoose.connection.close();
            }
            Schema_Commands.find({
                id: String(id)
            }, (err, list) => {
                if (err) {
                    callback([
                        `Não foi possivel verificar se o comando com o identificador(${id}) já foi salvo`,
                        err
                    ]);
                    return mongoose.connection.close();
                }

                if (list instanceof Array !== true) list = [];

                let items = list.filter(item => item.id == id);

                if (items.length <= 0) {
                    command.save(function (err) {
                        if (err) {
                            callback([
                                `Erro na hora de salvar o novo comando com o identificador(${id})`,
                                err
                            ]);
                            return mongoose.connection.close();
                        }
                        callback(`Comando com o identificador(${id}) salvo no banco de dados`);
                        return mongoose.connection.close();
                    });
                } else {
                    callback(`O comando com o identificador(${id}) já foi salvo no banco de dados`);
                    return mongoose.connection.close();
                }
            });
        });
    }
};

/**
 * @description Retorna o comando
 * @param {string} id Identificador do comando
 * @param {function} callback Função a ser retornada com uma array de resposta
 * @author GuilhermeSantos
 * @version 1.0.0
 */
function getCommand(id, callback) {
    mongoose.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }, (err, db) => {
        if (err) {
            callback([
                `Não foi possivel conectar com o mongoDB (Database ${db})`,
                err
            ])
            return mongoose.connection.close();
        }
        mongooseConnected();
    });

    function mongooseConnected() {
        Schema_Commands.find(id.length <= 0 ? {} : {
            id: String(id)
        }, (err, list) => {
            if (err) {
                callback([
                    `Não foi possivel verificar se o comando com o identificador(${id}) já foi salvo`,
                    err
                ]);
                return mongoose.connection.close();
            }

            if (list instanceof Array !== true) list = [];

            let items = id != '' ? list.filter(item => {
                if (item.id == id)
                    return {
                        id: item.id,
                        value: item.value,
                        valid: item.valid
                    }
            }) : list.map(item => {
                return {
                    id: item.id,
                    value: item.value,
                    valid: item.valid
                }
            });

            if (items.length <= 0) {
                callback(`Comando com o identificador(${id}) não existe no banco de dados`);
                return mongoose.connection.close();
            } else {
                callback(items);
                return mongoose.connection.close();
            }
        });
    }
};

/**
 * @description Limpa os comandos
 * @author GuilhermeSantos
 * @param {string} id Identificador do comando
 * @param {function} callback Função a ser retornada com uma array de resposta
 * @version 1.1.0
 */
function clearCommands(id, callback) {
    mongoose.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }, (err, db) => {
        if (err) {
            callback([
                `Não foi possivel conectar com o mongoDB (Database ${db})`,
                err
            ])
            return mongoose.connection.close();
        }
        mongooseConnected();
    });

    function mongooseConnected() {
        Schema_Commands.remove(id.length <= 0 ? {} : {
            id: String(id)
        }, (err) => {
            if (err) {
                callback([
                    id.length <= 0 ? `Não foi possivel remover os comandos` :
                    `Não é possivel remover o comando com o ID(${id}) do banco de dados`,
                    err
                ]);
                return mongoose.connection.close();
            }
            callback(
                id.length <= 0 ? `Comandos removidos do banco de dados` :
                `Comando com o ID(${id}) removido do banco de dados`,
            );
            return mongoose.connection.close();
        });
    }
};

//================================================================================
// MODULO PARA EXPORTAR O SCRIPT
//================================================================================
module.exports = {
    createCommand,
    getCommand,
    clearCommands
};