async function f(event) {
    event.console.log(await event.kv.getGlobal('exist'));

    event.console.log(await event.kv.getGlobal(['not-exist', 'exist', 'not-exist']))

    return {status: 200, body: 'done'};
}

exports.handler = f;