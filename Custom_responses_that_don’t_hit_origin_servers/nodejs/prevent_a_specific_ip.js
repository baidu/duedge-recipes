const FORBID = {status: 403, body: "Sorry, this page is not available."};
const SKIP = {skip: true};
const BLOCK_REG = /1\.2\.3\.\d+/;

exports.handler = (event, context, callback) => {
    let req = event.req;

    let ip = req.client_ip;
    if (BLOCK_REG.test(ip)) {
        callback(null, FORBID);
    } else {
        callback(null, SKIP);
    }
};