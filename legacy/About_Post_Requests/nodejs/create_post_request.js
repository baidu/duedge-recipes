exports.handler = (event, context, callback) => {
    let req = event.req;

    req.method = 'POST';
    req.encoding = 'none';
    req.body = 'Hello DuEdge';

    callback(null, req);
};