const NO_REQ = `duedge invoker miss request info`;
const NO_RESP = `duedge invoker miss response info`;

function generateErrorResponse(msg) {
    return { status:400, body: msg };
}

exports.handler = (event, context, callback) => {
    let req = event.req;
    if(!req) {
        callback(null, generateErrorResponse(NO_REQ));
        return;
    }

    let resp = event.resp;
    if(!resp) {
        callback(null, generateErrorResponse(NO_RESP));
        return;
    }

    if(resp.status && resp.status >= 200 && resp.status < 400) {
        resp.skip = true;
        callback(null, resp);
        return;
    }

    let redirectURL = "";
    if(req.args && req.args !== "") {
        redirectURL = `${req.origin_scheme}://${req.host}${req.uri}?${req.args}`;
    } else {
        redirectURL = `${req.origin_scheme}://${req.host}${req.uri}`;
    }

    callback(null, {
        status: 302,
        headers: {
            location: `${redirectURL}`
        },
        body: ''
    });
};