/**
 * Variables
 */
const [
    { remote }
] = [
        require('electron')
    ]

/**
* @description Retorna o caminho local para o arquivo/pasta
*/
function localPath(p) {
    // Retira uma parte da string
    if (p.substring(0, 1) === '/')
        p = p.substring(1);
    // Importa o modulo PATH do Node
    var path = require('path'),
        // Cria a base para o caminho local
        mainModule = remote.process.mainModule,
        base = mainModule.path.substr(0, mainModule.path.substr(0, mainModule.path.search('.webpack')));
    // Retorna a base do caminho associado ao caminho
    return path.join(base, p);
};

/**
 * @description Verifica se o caminho local existe
 */
function localPathExists(p) {
    var fs = require('fs'),
        i = 0,
        length = p.length,
        path = false,
        paths = [],
        pathString = '';
    for (; i < length; i++) {
        let letter = String(p[i]);
        if (letter != '/') {
            pathString += letter;
        }
        if (letter == '/' || i == length - 1) {
            paths.push(pathString);
            var pathsJoin = paths.join("/");
            if (fs.existsSync(localPath(pathsJoin))) {
                path = true;
            } else {
                path = false;
            }
            pathString = '';
        }
    }
    return path;
};

/**
 * @description Cria o caminho local
 */
function localPathCreate(p) {
    var fs = require('fs'),
        i = 0,
        length = p.length,
        path = { str: '', dir: [] },
        pathString = '';
    for (; i < length; i++) {
        let letter = String(p[i]);
        if (letter != '\\') {
            path.str += letter;
            pathString += letter;
        }
        if (letter == '\\' || i == length - 1) {
            if (letter == '\\') {
                pathString += '\\';
                path.str += '\\';
            };
            path.dir.push(path.str), path.str = '';
            if (!fs.existsSync(pathString) && path.dir[path.dir.length - 1].indexOf('\\') != -1) {
                fs.mkdirSync(pathString);
            }
        }
    }
};

module.exports = { localPath, localPathExists, localPathCreate };