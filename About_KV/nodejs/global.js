async function f(event) {
    const v = await event.kv.getGlobal('myKey');

    if (v) {
        return {status: 200, body: v};
    } else {
        return {status: 404, body: 'not found!'};
    }
}

exports.handler = f;