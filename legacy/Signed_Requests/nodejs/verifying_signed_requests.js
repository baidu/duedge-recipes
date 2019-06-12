Buffer.prototype.toByteArray = function () {return Array.prototype.slice.call(this, 0)};

const crypto = require('crypto');
const querystring = require("querystring");

const PREFIX = /^\/verify\//;

exports.handler = (event, context, callback) => {
    let req = event.req;

    let uri = req.uri;
    if (PREFIX.test(uri)) {
        let params = querystring.parse(req.args);
        let encrypted = params.encrypted;
        if (encrypted) {
            const decipher = crypto.createDecipher('aes192', 'my key');

            try {
                let decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
                if (decrypted.length < 14) {callback(null, {status: 403, body: 'request is invalid: decrypted is too short'})}

                let expire = Number(decrypted.slice(-13));
                if (isNaN(expire)) {callback(null, {status: 403, body: 'verify fail: expire is invalid'})}

                let now = Number(Date.now());
                if(now >= expire) {
                    callback(null, {
                        status: 403,
                        body: 'now    : ' + now + '\n'
                            + 'expired: ' + expire + '\n'
                            + 'this request is expired\n'
                    })
                }

                let signUri = decrypted.slice(0, decrypted.length - 13);
                let requestUri = uri.slice(7);
                if (signUri !== requestUri) {
                    callback(null, {
                        status: 403,
                        body: 'sign   : ' + signUri    + '\n'
                            + 'request: ' + requestUri + '\n'
                            + 'verify fail: uri is mismatch'
                    })
                }

                callback(null, {
                    status: 200,
                    body: 'decrypted: ' + decrypted  + '\n'
                        + 'now      : ' + now        + '\n'
                        + 'expire   : ' + expire     + '\n'
                        + 'sign     : ' + signUri    + '\n'
                        + 'request  : ' + requestUri + '\n'
                        + 'verify sucess'
                })
            } catch(err) {
                callback(null, {status: 403, body: 'request is invalid: ' + err});
            }
        } else {
            callback(null, {status: 403, body: 'request is invalid: encrypted is missing'});
        }
    } else {
        callback(null, {status: 200, body: 'skip verify'});
    }
};