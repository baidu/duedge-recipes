async function f(event) {
    const response = await event.fetch(event.request).catch(err => {
        event.console.log(err);
    });

    if (response) {
        // http.IncomingMessage headers 中 set-cookie 始终是一个数组
        if (response.headers['Set-Cookie']) {
            response.headers['Set-Cookie'].push(`randomcookie=${Math.random()}; Expires=Wed, 21 Oct 8102 07:28:00 GMT; Path='/';`);
        } else {
            response.headers['Set-Cookie'] = [`randomcookie=${Math.random()}; Expires=Wed, 21 Oct 8102 07:28:00 GMT; Path='/';`];
        }

        return response;
    } else {
        return {status: 503};
    }
}

exports.handler = f;