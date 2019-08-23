const ROBOT_REG = /robot/i;

async function f(event) {
    const request = event.request;
    const headers = request.headers;

    // 如果 UA 中含有 robot 关键字, 返回 403
    if (headers['user-agent']) {
        if (ROBOT_REG.test(headers['user-agent'])) {
            return {status: 403};
        } else {
            // 其他继续回源
            return request;
        }
    }
}

exports.handler = f;