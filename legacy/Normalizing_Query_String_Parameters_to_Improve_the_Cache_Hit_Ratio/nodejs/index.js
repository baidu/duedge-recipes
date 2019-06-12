const querystring = require('querystring');

exports.handler = (event, context, callback) => {
    let req = event.req;

    let params = querystring.parse(req.args);
    let sortedParams = {};
    Object.keys(params).sort().forEach(key => {
        sortedParams[key] = params[key];
    });

    req.args = querystring.stringify(sortedParams);
    req.cache_policy = 2;

    callback(null, req);
};