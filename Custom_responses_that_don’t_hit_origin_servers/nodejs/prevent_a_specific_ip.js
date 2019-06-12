const BLOCK_REG = /1\.2\.3\.\d+/;

async function f(event) {
    const request = event.request;

    if (BLOCK_REG.test(request.clientIp)) {
        return {status: 403};
    } else {
        return request;
    }
}

exports.handler = f;