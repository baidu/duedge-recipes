Buffer.prototype.toByteArray = function () {return Array.prototype.slice.call(this, 0)};

const crypto = require('crypto');
const querystring = require("querystring");

const PREFIX = /^\/generate\//;

async function f(event) {
    const request = event.request;
    const uri = request.uri;

    // 符合格式的 path 进行签名
    if (PREFIX.test(uri)) {
        // 获取签名 path
        let trueUri = `${uri.slice(9)}`;
        // 生成校验 path
        let newUri = '/verify' + trueUri;

        // 可以通过参数指定过期时间
        let params = querystring.parse(request.args);
        let expire = Number(params.expire);
        if (isNaN(expire) || expire <= 0 || expire > 3600 * 1000) {expire = 60000} // ms

        let now = Date.now(); // ms
        let expired = now + expire;
        let data = trueUri + expired;

        // -- 加密
        const cipher = crypto.createCipher('aes192', 'my key');        
        let encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

        // url encode
        const args = querystring.encode({'encrypted': encrypted})

        // 输出详细信息
        return {
            status: 200,
            body: 'now    : ' + now + '\n'
                + 'expired: ' + expired + '\n'
                + `${request.clientScheme}://${request.host}${newUri}?${args}` + '\n'
        };
    } else {
        return {status: 200, body: 'skip generate'};
    }

}

exports.handler = f;