Buffer.prototype.toByteArray = function () {return Array.prototype.slice.call(this, 0)};

const crypto = require('crypto');
const querystring = require("querystring");

const PREFIX = /^\/generate\//;

async function f(event) {
    const request = event.request;
    const uri = request.uri;

    if (PREFIX.test(uri)) {
        let trueUri = `${uri.slice(9)}`;
        let newUri = '/verify' + trueUri;
        let params = querystring.parse(request.args);
        let expire = Number(params.expire);

        if (isNaN(expire) || expire <= 0 || expire > 3600 * 1000) {expire = 60000}

        let now = Date.now();
        let expired = now + expire;
        let data = trueUri + expired;

        const cipher = crypto.createCipher('aes192', 'my key');

        let encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
        return {
            status: 200,
            body: 'now    : ' + now + '\n'
                + 'expired: ' + expired + '\n'
                + `${request.clientScheme}://${request.host}${newUri}?encrypted=${encrypted}` + '\n'
        };
    } else {
        return {status: 200, body: 'skip generate'};
    }

}

exports.handler = f;