const MOBILE_PREFIX = '/mobile';
const TABLET_PREFIX = '/tablet';
const MOBILE_REG = /phone/i;
const TABLET_REG = /pad/i;

async function f(event) {
    const request = event.request;
    const headers = request.headers;

    let prefix = '';
    if (headers['user-agent']) {
        if (MOBILE_REG.test(headers['user-agent'])) {
            prefix = MOBILE_PREFIX;
        } else if (TABLET_REG.test(headers['user-agent'])) {
            prefix = TABLET_PREFIX;
        }
    }

    request.uri = prefix + request.uri;
    return request;

}

exports.handler = f;