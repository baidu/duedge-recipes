async function f(event) {
    // 指定 method
    event.request.method = 'POST';
    // 替换 body
    event.request.body = 'data';

    return event.request;
}

exports.handler = f;