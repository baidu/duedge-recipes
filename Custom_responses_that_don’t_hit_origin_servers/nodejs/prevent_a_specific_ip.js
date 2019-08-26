const BLOCK_REG = /1\.2\.3\.\d+/;

async function f(event) {
    const request = event.request;

    // 如果 client ip 属于 1.2.3.0/24
    // 返回 403
    if (BLOCK_REG.test(request.clientIp)) {
        return {status: 403};
    } else {
    	// 其他继续回源
        return request;
    }
}

exports.handler = f;