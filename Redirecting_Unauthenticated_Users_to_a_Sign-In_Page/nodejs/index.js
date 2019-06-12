async function f(event) {
    const request = event.request;
    const headers = request.headers;

    if (headers['cookie'] && headers['cookie'].indexOf('Authorization') >= 0) {
        return request;
    }

    let redirectURL = encodeURIComponent(`https://${request.host}${request.uri}?${request.args}`);
    return {
        status: 302,
        headers: {
            location: `http://www.test.com/login?redirect_url=${redirectURL}`
        }
    };
}

exports.handler = f;