from typing import List


async def handler(event):
    # flush history data
    await event.kv.flush()

    # list all keys with ttl
    l = await event.kv.list()
    if len(l) > 0:
        return {'status': 503, 'body': b'test1 fail!'}

    await event.kv.set('key1', '1')
    await event.kv.set('key2', '2')
    await event.kv.set('key3', '3')
    await event.kv.set('my_key', '4')

    # list all keys with ttl
    l = await event.kv.list()
    if len(l) != 4:
        return {'status': 503, 'body': b'test2 fail!'}

    # flush history data
    await event.kv.flush()

    # not found
    v = await event.kv.get('my_key')
    if v:
        return {'status': 503, 'body': b'test3 fail!'}

    # set data
    await event.kv.set('my_key', 'my_value')

    # get data
    v = await event.kv.get('my_key')
    if v != 'my_value':
        return {'status': 503, 'body': b'test4 fail!'}

    # delete data
    await event.kv.delete('my_key')

    # not found
    v = await event.kv.get('my_key')
    if v:
        return {'status': 503, 'body': b'test5 fail!'}

    # set data for 3600s
    await event.kv.set('expire_key', 'my_value', 3600)
    # re-expire key for 1s
    await event.kv.expire('expire_key', 1)

    # incrby with inited
    v = await event.kv.incrby('init', 1.1)
    if v != 1.1:
        return {'status': 503, 'body': b'test6 fail!'}

    # incrby with negative
    v = await event.kv.incrby('init', -1.1)
    if v != 0:
        return {'status': 503, 'body': b'test7 fail!'}

    try:
        # let`s wait 1s
        await event.fetch('https://www.google.com', config={'timeout': 1})
    except Exception:
        pass

    # the key is expired
    v = await event.kv.get('expire_key')
    if v:
        return {'status': 503, 'body': b'test8 fail!'}

    # list: []
    await event.kv.lpush('list', '3')
    await event.kv.lpush('list', ['2', '1'])
    await event.kv.rpush('list', '4')
    await event.kv.rpush('list', ['5', '6'])
    # list: [1, 2, 3, 4, 5, 6]

    v = await event.kv.lpop('list')
    if v != '1':
        return {'status': 503, 'body': b'test9 fail!'}
    # list: [2, 3, 4, 5, 6]

    v = await event.kv.rpop('list')
    if v != '6':
        return {'status': 503, 'body': b'test10 fail!'}
    # list: [2, 3, 4, 5]

    await event.kv.ltrim('list', 1, -1)
    # list: [3, 4, 5]

    await event.kv.ltrim('list', 0, 1)
    # list: [3, 4]

    l = await event.kv.lrange('list', 0, -1)

    if not isinstance(l, List) or len(l) != 2 or l[0] != '3' or l[1] != '4':
        return {'status': 503, 'body': b'test11 fail!'}

    # string: bit 0
    v = await event.kv.setbit('string', 0, 1)
    if v != 0:
        return {'status': 503, 'body': 'test12 fail!'}

    # string: bit 1
    v = await event.kv.setbit('string', 0, 1)
    if v != 1:
        return {'status': 503, 'body': 'test13 fail!'}

    await event.kv.setbit('string', 7, 1)
    await event.kv.setbit('string', 16, 1)
    await event.kv.setbit('string', 23, 1)
    # string: bit 100000010000000010000001

    v = await event.kv.getbit('string', 16)
    if v != 1:
        return {'status': 503, 'body': 'test14 fail!'}

    # byte: [1, 1]
    # bit:  [8, 15]
    v = await event.kv.bitcount('string', 1, 1)
    if v != 0:
        return {'status': 503, 'body': 'test15 fail!'}

    # byte: [2, 2]
    # bit:  [16, 23]
    v = await event.kv.bitcount('string', 2, 2)
    if v != 2:
        return {'status': 503, 'body': 'test16 fail!'}

    # byte: [0, 2]
    # bit:  [0, 23]
    v = await event.kv.bitcount('string', 0, 2)
    if v != 4:
        return {'status': 503, 'body': 'test17 fail!'}

    return {'status': 200, 'body': b'well done!'}
