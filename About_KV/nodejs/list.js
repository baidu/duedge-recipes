async function f(event) {
    // flush history data
    await event.kv.flush();

    // list: []
    await event.kv.lpush('list', '3');
    await event.kv.lpush('list', ['2', '1']);
    await event.kv.rpush('list', '4');
    await event.kv.rpush('list', ['5', '6']);
    // list: [1, 2, 3, 4, 5, 6]

    let v = await event.kv.lpop('list');
    if (v !== '1') {
        return {status: 503, body: 'test1 fail!'};
    }
    // list: [2, 3, 4, 5, 6]

    v = await event.kv.rpop('list');
    if (v !== '6') {
        return {status: 503, body: 'test2 fail!'};
    }
    // list: [2, 3, 4, 5]

    await event.kv.ltrim('list', 1, -1);
    // list: [3, 4, 5]

    await event.kv.ltrim('list', 0, 1);
    // list: [3, 4]

    let list = await event.kv.lrange('list', 0, -1);
    if (!Array.isArray(list) || list[0] !== '3' || list[1] !== '4' || list.length !== 2) {
        return {status: 503, body: 'test3 fail!'};
    }

    return {status: 200, body: 'well done!'};
}

exports.handler = f;