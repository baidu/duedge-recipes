const url = require("url");

async function f(event) {
    const request = event.request;

    const referer = request.headers['referer'];
    const host = request.host;

    // 如果 referer 存在且包含 host, 继续回源
    if (referer) {
        let u = url.parse(referer);
        if (u && u.host === host) {
            return request;
        }
    } else {
        // 如果 referer 不能存在, 继续回源
        return request;
    }


    // 其他情况
    // 302 返回本域名首页
    return {
        status: 302,
        headers: {
            location: `${request.originScheme}://${host}/`
        }
    };
}

exports.handler = f;