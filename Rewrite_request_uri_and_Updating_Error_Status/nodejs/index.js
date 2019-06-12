const querystring = require('querystring');

async function f(event) {
    const request = event.request;

    let args = querystring.parse(request.args);
    if(!args) {
        return {status: 403, body: 'no args'};
    }

    let src = args.src;
    if(!src) {
        return {status: 403, body: 'no src'};
    }

    const response = await event.fetch(src).catch(err => {
        event.console.log(err);
    });

    if (response) {
        if (response.status >= 200 && response.status < 400) {
            return response;
        } else {
            const redirectURL = `${request.originScheme}://${request.host}${request.uri}?${request.args}`;
            return {
                status: 302,
                headers: {
                    location: `${redirectURL}`
                }
            };
        }
    } else {
        return {status:503, body: 'fetch err'};
    }
}

exports.handler = f;