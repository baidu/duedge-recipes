const FORBID = {status: 403, body: "Sorry, this page is not available."};
const SKIP = {skip: true};
const ROBOT_REG = /robot/i;

exports.handler = (event, context, callback) => {
    let req = event.req;

    let headers = req.headers;
    if (headers['user-agent']) {
        const ua = headers['user-agent'][0];
        if (ROBOT_REG.test(ua)) {
            callback(null, FORBID);
        } else {
            callback(null, SKIP);
        }
    }
};