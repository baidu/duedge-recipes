async function f(event) {
    // flush history data
    await event.kv.flush();

    // list all keys with ttl
    let list = await event.kv.list()
    if (list.length > 0) {
        return {status: 503, body: 'test1 fail!'};
    }

    let seted = await event.kv.setnx('myKey', 'setnx')
    if (!seted) {
        return {status: 503, body: 'test2 fail!'};
    }

    seted = await event.kv.setnx('myKey', 'setnx')
    if (seted) {
        return {status: 503, body: 'test3 fail!'};
    }

    await event.kv.set('key1', '1');
    await event.kv.set('key2', '2');
    await event.kv.set('key3', '3');
    await event.kv.set('myKey', '4');

    // list all keys with ttl
    list = await event.kv.list()
    if (list.length != 4) {
        return {status: 503, body: 'test4 fail!'};
    }

    // flush history data
    await event.kv.flush();

    // not found
    let v = await event.kv.get('myKey');
    if (v) {
        return {status: 503, body: 'test5 fail!'};
    }

    // set data
    await event.kv.set('myKey', 'myValue');

    // get data
    v = await event.kv.get('myKey');
    if (v !== 'myValue') {
        return {status: 503, body: 'test6 fail!'};
    }

    // delete data
    await event.kv.del('myKey');

    // not found
    v = await event.kv.get('myKey');
    if (v) {
        return {status: 503, body: 'test7 fail!'};
    }

    // set data for 3600s
    await event.kv.set('expireKey', 'myValue', 3600);
    // re-expire key for 1s
    await event.kv.expire('expireKey', 1)

    // incrby with inited
    v = await event.kv.incrby('init', 1.1)
    if (v !== 1.1) {
        return {status: 503, body: 'test8 fail!'};
    }
    // incrby with negative
    v = await event.kv.incrby('init', -1.1)
    if (v !== 0) {
        return {status: 503, body: 'test9 fail!'};
    }

    // let`s wait 1s
    await event.fetch('https://www.google.com', {timeout: 1}).catch(err => {
        // haha, got timeout
        event.console.log(err)
    })
    // the key is expired
    v = await event.kv.get('expireKey');
    if (v) {
        return {status: 503, body: 'test10 fail!'};
    }

    return {status: 200, body: 'well done!'};
}

exports.handler = f;