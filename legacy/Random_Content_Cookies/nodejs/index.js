exports.handler = (event, context, callback) => {
    let resp = event.resp;

    if (resp.headers['Set-Cookie']) {
        resp.headers['Set-Cookie'].push(`randomcookie=${Math.random()}; Expires=Wed, 21 Oct 8102 07:28:00 GMT; Path='/';`)
    } else {
        resp.headers['Set-Cookie'] = `randomcookie=${Math.random()}; Expires=Wed, 21 Oct 8102 07:28:00 GMT; Path='/';`
        // or resp.headers['Set-Cookie'] = [`randomcookie=${Math.random()}; Expires=Wed, 21 Oct 8102 07:28:00 GMT; Path='/';`]
    }
    callback(null, resp);
};