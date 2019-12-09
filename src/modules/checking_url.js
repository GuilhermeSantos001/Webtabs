import * as NormalizeUrl from 'normalize-url';
import * as ping from 'net-ping';
import * as request from 'resquest';

export default function chkurl(url, callback) {
    if (typeof url != 'string' ||
        typeof url === 'string' &&
        url.length <= 0) return;

    url = NormalizeUrl(url);

    var session = ping.createSession();

    session.pingHost(url, error => {
        if (error)
            callback(false);
        else {
            request({ method: 'HEAD', uri: url }, function (error, response) {
                if (!error && response.statusCode >= 200 && response.statusCode <= 205) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        }
    });
}