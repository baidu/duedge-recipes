exports.handler = (event, context, callback) => {
    let req = event.req;

    let decoder = new Buffer(req.body, 'base64');
    callback(null, {status:200, body: decoder.toString()});
};