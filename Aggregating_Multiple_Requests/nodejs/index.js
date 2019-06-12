const http = require("http");

const HOST = 'test.demo.com';
const API_LIST = ['apiA', 'apiB', 'apiC'];
const ERROR_RESP = {
    "error": {
        "ignore": false,
        "message": "request failed"
    }
};

function fetch(host, list)
{
    let result = {};
    let path = list.shift();

    http.get({host: host, path: '/' + path}, (res) => {
        let tb = {
            error: 0,
            status: res.statusCode,
            headers: res.headers
        };
        let rawData = '';

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            rawData += chunk;
        }).on('end', () => {
            tb.body = rawData;
            result[path] = tb
        }).on('end', () => {
            if (list.length) {
                fetch(host, list);
            } else {
                callback(null, {status: 200, body: JSON.stringify(result)});
            }
        });
    }).on('error', (e) => {
        callback(null, ERROR_RESP);
    });
}

exports.handler = (event, context, callback) => {
    fetch(HOST, API_LIST);
};