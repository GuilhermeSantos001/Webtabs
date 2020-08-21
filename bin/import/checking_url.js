function direct(url, callback) {
    if (
        typeof url != 'string' ||
        typeof url === 'string' &&
        url.length <= 0
    ) return;
    let http;
    if (url.substring(0, 5).match(/https/)) {
        http = require('https');
    } else {
        http = require('http');
    }

    if (!http) return callback(false);

    if (url.substring(0, 5).match(/htt/) === null) {
        url = `http://${url}`;
    }

    if (url.match(/\.com/) === null) {
        console.log(url);
    }

    try {
        http.get(url, res => {
            const {
                statusCode
            } = res;
            if (statusCode >= 100 && statusCode <= 308) {
                return callback(url);
            } else {
                return callback(false);
            }
        }).on('error', (e) => {
            return callback(false);
        });
    } catch (e) {
        return callback(false);
    }
};

function getDomain(url, callback) {
    if (
        typeof url != 'string' ||
        typeof url === 'string' &&
        url.length <= 0
    ) return;
    let http;
    if (url.substring(0, 5).match(/https/)) {
        http = require('https');
    } else {
        http = require('http');
    }

    if (!http) return callback(false);

    if (url.substring(0, 5).match(/htt/) === null) {
        url = `http://${url}`;
    }

    try {
        const {
            URL
        } = require('url');
        const {
            hostname
        } = new URL(url);
        callback(hostname);
    } catch (e) {
        return callback(false);
    }
};

module.exports = {
    direct,
    getDomain
}