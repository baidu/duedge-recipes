const querystring = require('querystring');

const NO_REQ = `duedge invoker miss request info`;
const NO_SRC = `parse src from request fail`;
const INVALID_HOST = `parse host from request fail`;
const SAME_HOST = `loopback request`;

function generateErrorResponse(msg) {
    return {status:400, body: msg};
}

exports.handler = (event, context, callback) => {
    let req = event.req;
    
    if(!req) {
        callback(null, generateErrorResponse(NO_REQ));
        return;
    }
    
    let args = querystring.parse(req.args);
    if(!args) {
        callback(null, generateErrorResponse(NO_SRC));
        return;
    }
    
    let src = args.src;
    if(!src) {
        callback(null, generateErrorResponse(NO_SRC));
        return;
    }
    
    let result = src.match(/(https?):\/\/([^\/]+)(.*)/);
    if(!result) {
        callback(null, generateErrorResponse(INVALID_HOST));
        return;
    }
    
    
    let realScheme = result[1];
    req.origin_scheme = realScheme;
    req.ssl_verify = false;
    
    let realHost = result[2];
    if(!realHost || realHost === "") {
        callback(null, generateErrorResponse(INVALID_HOST));
        return;
    }
    
    let realUri = result[3];
    if(!realUri || realUri === "") {
        realUri = "/"
    }
    
    let tmpHost = "";
    let tmpPort = "";
    result = realHost.match(/([^:]+):(\d*)/);
    if(result) {
        tmpHost = result[1];
        tmpPort = result[2];
    }
    if(tmpHost && tmpHost !== "") {
        realHost = tmpHost
    }

    if(realHost === "www.test.com") {
        callback(null, generateErrorResponse(SAME_HOST));
        return;
    }

    req.uri = realUri;
    req.args = "";
    req.host = realHost;

    let type = 1;
    let reg = /\d+\.\d+\.\d+\.\d+/;
    if(reg.test(realHost)) {
        type = 0;
    }

    let port = 80;
    let isp = 255;
    if(realScheme === "https") {
        port = 443
    }
    if(!tmpPort && tmpPort !== "") {
        port = parseInt(tmpPort)
    }

    req.origins = [
        {
            "type": type,
            "content": realHost,
            "port": port,
            "isp": isp
        }
    ];

    callback(null, req);
};