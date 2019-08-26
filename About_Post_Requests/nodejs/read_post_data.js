async function f(event) {
    // 不止 POST
    // 各种 method 下的 body 都是 event.request.body
    return new Response(event.request.body, {status: 200, headers:{key: 'value'}});
}

exports.handler = f;