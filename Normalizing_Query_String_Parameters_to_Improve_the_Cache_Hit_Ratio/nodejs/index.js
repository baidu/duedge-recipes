const querystring = require('querystring');

async function f(event) {
    const request = event.request;

    // 分割参数
    let params = querystring.parse(request.args);

    // 排序
    let sortedParams = {};
    Object.keys(params).sort().forEach(key => {
        sortedParams[key] = params[key];
    });

    // 重新拼接
    request.args = querystring.stringify(sortedParams);

    // 继续回源
    return request;
}

exports.handler = f;