const url = require("url");

const SKIP = {skip: true};

exports.handler = (event, context, callback) => {
    let req = event.req;

    let referer = req.headers['referer'];
    let host = req.host;
    let valid = false;
    if (referer) {
        let u = url.parse(referer[0]);
        if (u && u.host === host) {
            valid = true
        }
    } else {
        valid = true
    }

    if (valid) {
        callback(null, SKIP);
    } else {
        const resp = {
            status: 302,
            headers: {
                location: `http://${host}/`
            },
        };
        callback(null, resp);
    }
};