async function f(event) {
    const request = event.request;
    const headers = request.headers;

    // 遵循 nodejs 默认设定
    // http://nodejs.cn/api/http.html#http_class_http_incomingmessage
    // 多值 cookie 需要自己进行分割
    if (headers['cookie'] && headers['cookie'].indexOf('Authorization') >= 0) {
        return request;
    }

    // 302
    // 返回登录页
    let redirectURL = encodeURIComponent(`https://${request.host}${request.uri}?${request.args}`);
    return {
        status: 302,
        headers: {
            location: `http://www.test.com/login?redirect_url=${redirectURL}`
        }
    };
}

exports.handler = f;