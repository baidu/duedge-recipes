const querystring = require('querystring');

async function f(event) {
    const request = event.request;

    let params = querystring.parse(request.args);
    let sortedParams = {};
    Object.keys(params).sort().forEach(key => {
        sortedParams[key] = params[key];
    });

    request.args = querystring.stringify(sortedParams);
    return request;
}

exports.handler = f;