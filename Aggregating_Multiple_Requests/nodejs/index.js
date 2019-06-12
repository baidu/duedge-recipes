async function f(event) {
    const apis = ['http://test.demo.com/api1', 'http://test.demo.com/api2', 'http://test.demo.com/api3'];
    const res = [];

    for (let index in apis) {
        const data = await event.fetch(apis[index], {origins:event.request.origins});
        res.push(data.status || 503);
    }

    return new Response(JSON.stringify(res));
}

exports.handler = f;