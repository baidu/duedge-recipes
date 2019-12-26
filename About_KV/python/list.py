from typing import List


async def handler(event):
    # flush history data
    await event.kv.flush()

    # list: []
    await event.kv.lpush('list', '3')
    await event.kv.lpush('list', ['2', '1'])
    await event.kv.rpush('list', '4')
    await event.kv.rpush('list', ['5', '6'])
    # list: [1, 2, 3, 4, 5, 6]

    v = await event.kv.lpop('list')
    if v != '1':
        return {'status': 503, 'body': b'test1 fail!'}
    # list: [2, 3, 4, 5, 6]

    v = await event.kv.rpop('list')
    if v != '6':
        return {'status': 503, 'body': b'test2 fail!'}
    # list: [2, 3, 4, 5]

    await event.kv.ltrim('list', 1, -1)
    # list: [3, 4, 5]

    await event.kv.ltrim('list', 0, 1)
    # list: [3, 4]

    l = await event.kv.lrange('list', 0, -1)

    if not isinstance(l, List) or len(l) != 2 or l[0] != '3' or l[1] != '4':
        return {'status': 503, 'body': b'test3 fail!'}

    return {'status': 200, 'body': b'well done!'}
