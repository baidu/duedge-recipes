exports.handler = (event, context, callback) => {
    let req = event.req;

    let headers = event.req.headers;
    if (headers.cookie) {
        for (let i = 0; i < headers.cookie.length; i++) {
            if (headers.cookie[i].indexOf('Authorization') >= 0) {
                callback(null, {'skip':true});
                return;
            }
        }
    }

    let redirectURL = encodeURIComponent(`https://${req.host}${req.uri}?${req.args}`);
    const resp = {
        status: 302,
        headers: {
            location: `http://www.test.com/login?redirect_url=${redirectURL}`
        },
    };

    callback(null, resp);
};