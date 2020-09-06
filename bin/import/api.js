// showLastCommitMessageForThisLibrary.js
const {
    create
} = require('apisauce');

function _serverURL() {
    let path = require('./localPath'),
        fs = require('fs');

    const filePath = path.localPath('configs/global.json'),
        fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    return `${fileData['CONNECTIONTYPE']}://${fileData['SERVERIP']}:${fileData['SERVERPORT']}`;
};

function _apiSystemCode() {
    let path = require('./localPath'),
        fs = require('fs');

    const filePath = path.localPath('configs/global.json'),
        fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    return fileData['APISYSTEMCODE'];
};

function get(
    url = _serverURL(),
    path = '',
    headers = {}
) {
    const api = create({
        baseURL: url,
        headers: Object.assign({
            "content-type": 'application/json',
            "system-code": _apiSystemCode()
        }, headers)
    });
    
    return new Promise((resolve, reject) => {
        api
            .get(path)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
};

function post(
    url = _serverURL(),
    path = '',
    headers = {},
    data = {}
) {
    const api = create({
        baseURL: url,
        headers: Object.assign({
            "content-type": 'application/json',
            "system-code": _apiSystemCode()
        }, headers)
    });

    return new Promise((resolve, reject) => {
        api
            .post(path, data)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
};

module.exports = {
    get,
    post
};