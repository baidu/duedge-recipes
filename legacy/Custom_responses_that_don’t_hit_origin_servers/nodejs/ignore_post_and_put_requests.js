const FORBID = {status: 403, body: "Sorry, this page is not available."};
const SKIP = {skip: true};

exports.handler = (event, context, callback) => {
    let req = event.req;

    let method = req.method;
    if (method === 'POST' || method === 'PUT') {
        callback(null, FORBID);
    } else {
        callback(null, SKIP);
    }
};