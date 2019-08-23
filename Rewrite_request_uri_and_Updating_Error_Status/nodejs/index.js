const querystring = require('querystring');

async function f(event) {
    const request = event.request;

    // 分割参数
    let args = querystring.parse(request.args);
    if(!args) {
        return {status: 403, body: 'no args'};
    }

    let src = args.src;
    if(!src) {
        return {status: 403, body: 'no src'};
    }

    // 根据 src 进行回源
    const response = await event.fetch(src).catch(err => {
        event.console.log(err);
    });

    // 检查状态码
    if (response) {
        if (response.status >= 200 && response.status < 400) {
            return response;
        } else {
            // 非预期状态码, 返回 302 
            // 浏览器自动获取
            const redirectURL = src;
            return {
                status: 302,
                headers: {
                    location: `${redirectURL}`
                }
            };
        }
    } else {
        return {status:503, body: 'fetch err'};
    }
}

exports.handler = f;