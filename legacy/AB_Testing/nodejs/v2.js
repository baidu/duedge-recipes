const http = require("http");

const COOKIE_EXPERIMENT_A = 'X-Experiment-Name=A';
const COOKIE_EXPERIMENT_B = 'X-Experiment-Name=B';
const REQUEST_A = 'http://test.demo.com/experiment-A';
const REQUEST_B = 'http://test.demo.com/experiment-B';
const ERROR_RESP = {
    "error": {
        "ignore": false,
        "message": "request failed"
    }
};

exports.handler = (event, context, callback) => {
    let req = event.req;

    if (req.uri !== '/experiment') {
        callback(null, {'skip':true});
        return;
    }

    let headers = req.headers;
    let request;
    if (headers.cookie) {
        // "cookie":["cookie1","cookie2", .... , "cookieN"]
        for (let i = 0; i < headers.cookie.length; i++) {
            if (headers.cookie[i].indexOf(COOKIE_EXPERIMENT_A) >= 0) {
                request = REQUEST_A;
                break;
            } else if (headers.cookie[i].indexOf(COOKIE_EXPERIMENT_B) >= 0) {
                request = REQUEST_B;
                break;
            }
        }
    }

    if (!request) {
        if (Math.random() < 0.75) {
            request = REQUEST_A;
        } else {
            request = REQUEST_B;
        }
    }

    http.get(request, (res) => {
        let resp = {};
        resp.status = res.statusCode;
        resp.headers = res.headers;

        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { rawData += chunk; }).on('end', () => {
            resp.body = rawData;
            callback(null, resp)
        });
    }).on('error', (e) => {
        callback(null, ERROR_RESP);
    });
};