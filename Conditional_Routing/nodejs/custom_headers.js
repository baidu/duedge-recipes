const TAG = 'x-replace';

exports.handler = (event, context, callback) => {
    let req = event.req;

    let prefix = '';
    let headers = req.headers;
    if (headers[TAG]) {
        prefix = '/' + headers[TAG][0]
    }

    req.uri = prefix + req.uri;

    callback(null, req);
};