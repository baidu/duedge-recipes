async function f(event) {
    // flush history data
    await event.kv.flush();

    // list all keys with ttl
    let list = await event.kv.list()
    if (list.length > 0) {
        return {status: 503, body: 'some thing wrong!'};
    }

    await event.kv.set('key1', '1');
    await event.kv.set('key2', '2');
    await event.kv.set('key3', '3');
    await event.kv.set('myKey', '4');

    // list all keys with ttl
    list = await event.kv.list()
    if (list.length != 4) {
        return {status: 503, body: 'some thing wrong!'};
    }

    // flush history data
    await event.kv.flush();

    // not found
    let v = await event.kv.get('myKey');
    if (v) {
        return {status: 503, body: 'some thing wrong!'};
    }

    // set data
    await event.kv.set('myKey', 'myValue');

    // get data
    v = await event.kv.get('myKey');
    if (v !== 'myValue') {
        return {status: 503, body: 'some thing wrong!'};
    }

    // delete data
    await event.kv.del('myKey');

    // not found
    v = await event.kv.get('myKey');
    if (v) {
        return {status: 503, body: 'some thing wrong!'};
    }

    // set data for 3600s
    await event.kv.set('expireKey', 'myValue', 3600);
    // re-expire key for 1s
    await event.kv.expire('expireKey', 1)

    // incrby with inited
    v = await event.kv.incrby('init', 1.1)
    if (v !== '1.1') {
        return {status: 503, body: 'some thing wrong!'};
    }
    // incrby with negative
    v = await event.kv.incrby('init', -1.1)
    if (v !== '0') {
        return {status: 503, body: 'some thing wrong!'};
    }

    // let`s wait 1s
    await event.fetch('https://www.google.com', {timeout: 1}).catch(err => {
        // haha, got timeout
    })
    // the key is expired
    v = await event.kv.get('expireKey');
    if (v) {
        return {status: 503, body: 'some thing wrong!'};
    }

    return {status: 200, body: 'well done!'};
}

exports.handler = f;