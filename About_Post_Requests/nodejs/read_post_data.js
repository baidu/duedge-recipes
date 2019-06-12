async function f(event) {
    return new Response(event.request.body, {status: 200, headers:{key: 'value'}});
}

exports.handler = f;