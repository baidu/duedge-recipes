async function f(event) {
    // flush history data
    await event.kv.flush();

    // list all keys with ttl
    let list = await event.kv.list()
    if (list.length > 0) {
        return {status: 503, body: 'test1 fail!'};
    }

    await event.kv.set('key1', '1');
    await event.kv.set('key2', '2');
    await event.kv.set('key3', '3');
    await event.kv.set('myKey', '4');

    // list all keys with ttl
    list = await event.kv.list()
    if (list.length != 4) {
        return {status: 503, body: 'test2 fail!'};
    }

    // flush history data
    await event.kv.flush();

    // not found
    let v = await event.kv.get('myKey');
    if (v) {
        return {status: 503, body: 'test3 fail!'};
    }

    // set data
    await event.kv.set('myKey', 'myValue');

    // get data
    v = await event.kv.get('myKey');
    if (v !== 'myValue') {
        return {status: 503, body: 'test4 fail!'};
    }

    // delete data
    await event.kv.del('myKey');

    // not found
    v = await event.kv.get('myKey');
    if (v) {
        return {status: 503, body: 'test5 fail!'};
    }

    // set data for 3600s
    await event.kv.set('expireKey', 'myValue', 3600);
    // re-expire key for 1s
    await event.kv.expire('expireKey', 1)

    // incrby with inited
    v = await event.kv.incrby('init', 1.1)
    if (v !== '1.1') {
        return {status: 503, body: 'test6 fail!'};
    }
    // incrby with negative
    v = await event.kv.incrby('init', -1.1)
    if (v !== '0') {
        return {status: 503, body: 'test7 fail!'};
    }

    // let`s wait 1s
    await event.fetch('https://www.google.com', {timeout: 1}).catch(err => {
        // haha, got timeout
        event.console.log(err)
    })
    // the key is expired
    v = await event.kv.get('expireKey');
    if (v) {
        return {status: 503, body: 'test8 fail!'};
    }

    // list: []
    await event.kv.lpush('list', '3');
    await event.kv.lpush('list', ['2', '1']);
    await event.kv.rpush('list', '4');
    await event.kv.rpush('list', ['5', '6']);
    // list: [1, 2, 3, 4, 5, 6]

    v = await event.kv.lpop('list');
    if (v !== '1') {
        return {status: 503, body: 'test9 fail!'};
    }
    // list: [2, 3, 4, 5, 6]

    v = await event.kv.rpop('list');
    if (v !== '6') {
        return {status: 503, body: 'test10 fail!'};
    }
    // list: [2, 3, 4, 5]

    await event.kv.ltrim('list', 1, -1);
    // list: [3, 4, 5]

    await event.kv.ltrim('list', 0, 1);
    // list: [3, 4]

    list = await event.kv.lrange('list', 0, -1);
    if (!Array.isArray(list) || list[0] !== '3' || list[1] !== '4' || list.length !== 2) {
        return {status: 503, body: 'test11 fail!'};
    }

    // string: bit 0
    v = await event.kv.setbit('string', 0, 1);
    if (v !== 0) {
        return {status: 503, body: 'test12 fail!'};
    }

    // string: bit 1
    v = await event.kv.setbit('string', 0, 1);
    if (v !== 1) {
        return {status: 503, body: 'test13 fail!'};
    }

    await event.kv.setbit('string', 7, 1);
    await event.kv.setbit('string', 16, 1);
    await event.kv.setbit('string', 23, 1);
    // string: bit 100000010000000010000001

    v = await event.kv.getbit('string', 16);
    if (v !== 1) {
        return {status: 503, body: 'test14 fail!'};
    }

    // byte: [1, 1]
    // bit:  [8, 15]
    v = await event.kv.bitcount('string', 1, 1);
    if (v !== 0) {
        return {status: 503, body: 'test15 fail!'};
    }

    // byte: [2, 2]
    // bit:  [16, 23]
    v = await event.kv.bitcount('string', 2, 2);
    if (v !== 2) {
        return {status: 503, body: 'test16 fail!'};
    }

    // byte: [0, 2]
    // bit:  [0, 23]
    v = await event.kv.bitcount('string', 0, 2);
    if (v !== 4) {
        return {status: 503, body: 'test17 fail!'};
    }

    return {status: 200, body: 'well done!'};
}

exports.handler = f;