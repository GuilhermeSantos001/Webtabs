/**
 * @description Retorna o caminho local para o arquivo/pasta
 */
function localPath(p) {
    // Retira uma parte da string
    if (p.substring(0, 1) === '/') p = p.substring(1);
    // Importa o modulo PATH do Node
    var path = require('path');
    // Cria a base para o caminho local
    var base = path.dirname(process.mainModule.filename);
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
 * @description Deleta varias pastas/arquivos dentro de uma pasta e por fim a pasta
 */
function localPathRemoveEx(path) {
    if (!localPathExists(path)) return;
    var fs = require('fs');
    var folderPath = localPath(path);
    if (fs.lstatSync(folderPath).isDirectory()) {
        fs.readdirSync(folderPath).forEach(function (dirOrFile) {
            var dirOrFilePath = folderPath + "/" + dirOrFile;
            if (fs.lstatSync(dirOrFilePath).isDirectory()) {
                var dirPath = path + "/" + dirOrFile;
                localPathRemoveEx(dirPath);
            } else {
                fs.unlinkSync(dirOrFilePath);
            }
        });
        try {
            fs.rmdirSync(folderPath);
        } catch (error) {
            localPathRemoveEx(path);
        }
    }
};

Array(
    'package-lock.json',
    'yarn.lock'
).map(file => {
    const fs = require('fs');
    file = localPath(file);
    if (fs.existsSync(file)) {
        if (fs.lstatSync(file).isFile())
            fs.unlinkSync(file);
    }
})

Array('node_modules').map(dir => { localPathRemoveEx(dir) })