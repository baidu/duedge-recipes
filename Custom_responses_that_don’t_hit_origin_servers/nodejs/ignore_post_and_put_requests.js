async function f(event) {
    const request = event.request;

    // POST/PUT 返回 403
    if (request.method === 'POST' || request.method === 'PUT') {
        return {status: 403};
    } else {
    	// 其他继续回源
        return request;
    }
}

exports.handler = f;