async function f(event) {
    const log = event.console.log;

    // log common type
    log(123, 123.456, 'string', {a: 123}, ['123', 123]);

    // log object
    const ob = {
        k1: 123,
        k2: [123, '123'],
        k3: function () {

        }
    };
    log(ob);

    // log err
    try {
        fooooooooo();
    } catch (e) {
        log('got it: ', e);
    }

    // log event
    log(event);

    return {status: 200};
}

exports.handler = f;