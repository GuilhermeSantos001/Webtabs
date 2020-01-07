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
    var path = require('path');
    // Cria a base para o caminho local
    var base = (() => {
        if (remote && remote.process)
            return path.dirname(remote.process.mainModule.filename);
        if (process)
            return path.dirname(process.mainModule.filename);
    })();
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
        dir = '';
    p.split('/').map(path => {
        if (path.indexOf('.') == -1) {
            if (!localPathExists(dir += `${path}/`))
                fs.mkdirSync(localPath(dir));
        }
    });
};

module.exports = { localPath, localPathExists, localPathCreate };