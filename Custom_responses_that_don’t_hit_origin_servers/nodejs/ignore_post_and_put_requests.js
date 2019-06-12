async function f(event) {
    const request = event.request;

    if (request.method === 'POST' || request.method === 'PUT') {
        return {status: 403};
    } else {
        return request;
    }
}

exports.handler = f;