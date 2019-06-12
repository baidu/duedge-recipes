const url = require("url");

async function f(event) {
    const request = event.request;

    const referer = request.headers['referer'];
    const host = request.host;

    if (referer) {
        let u = url.parse(referer);
        if (u && u.host === host) {
            return request;
        }
    } else {
        return request;
    }

    return {
        status: 302,
        headers: {
            location: `${request.originScheme}://${host}/`
        }
    };
}

exports.handler = f;