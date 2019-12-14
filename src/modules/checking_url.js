import * as Electron from 'electron';

export default function chkurl(url, callback) {
    if (typeof url != 'string' ||
        typeof url === 'string' &&
        url.length <= 0) return;

    let http;
    if (url.substring(0, 5).match(/https/)) {
        http = Electron.remote.require('https');
    } else {
        http = Electron.remote.require('http');
    }

    if (!http) return callback(false);

    http.get(url, res => {
        const { statusCode } = res;
        if (statusCode >= 200 && statusCode <= 205) {
            return callback(true);
        } else {
            return callback(false);
        }
    }).on('error', (e) => {
        return callback(false);
    });
}