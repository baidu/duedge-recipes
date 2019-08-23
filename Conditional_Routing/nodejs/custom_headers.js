const TAG = 'x-replace';

async function f(event) {
    const request = event.request;
    const headers = request.headers;

    let prefix = '';
    // 多值取第一个
    if (headers[TAG]) {
        prefix = '/' + headers[TAG].split(',')[0];
    }

    // 更新 uri
    request.uri = prefix + request.uri;

    // 自动回源
    return request;

}

exports.handler = f;