async function f(event) {
    event.request.method = 'POST';
    event.request.body = 'data';

    return event.request;
}

exports.handler = f;