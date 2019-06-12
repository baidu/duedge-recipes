const MOBILE_PREFIX = '/mobile';
const TABLET_PREFIX = '/tablet';
const MOBILE_REG = /phone/i;
const TABLET_REG = /pad/i;

exports.handler = (event, context, callback) => {
    let req = event.req;
    
    let prefix = '';
    let headers = req.headers;
    if (headers['user-agent']) {
        const ua = headers['user-agent'][0];
        if (MOBILE_REG.test(ua)) {
            prefix = MOBILE_PREFIX;
        } else if (TABLET_REG.test(ua)) {
            prefix = TABLET_PREFIX;
        }
    }

    req.uri = prefix + req.uri;

    callback(null, req);
};