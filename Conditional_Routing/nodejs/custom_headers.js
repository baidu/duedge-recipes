const TAG = 'x-replace';

async function f(event) {
    const request = event.request;
    const headers = request.headers;

    let prefix = '';
    if (headers[TAG]) {
        prefix = '/' + headers[TAG].split(',')[0];
    }

    request.uri = prefix + request.uri;
    return request;

}

exports.handler = f;