async def handler(event):
    # flush history data
    await event.kv.flush()

    # list all keys with ttl
    l = await event.kv.list()
    if len(l) > 0:
        return {'status': 503, 'body': b'some thing wrong!'}

    await event.kv.set('key1', '1')
    await event.kv.set('key2', '2')
    await event.kv.set('key3', '3')
    await event.kv.set('my_key', '4')

    # list all keys with ttl
    l = await event.kv.list()
    if len(l) != 4:
        return {'status': 503, 'body': b'some thing wrong!'}

    # flush history data
    await event.kv.flush()

    # not found
    v = await event.kv.get('my_key')
    if v:
        return {'status': 503, 'body': b'some thing wrong!'}

    # set data
    await event.kv.set('my_key', 'my_value')

    # get data
    v = await event.kv.get('my_key')
    if v != 'my_value':
        return {'status': 503, 'body': b'some thing wrong!'}

    # delete data
    await event.kv.delete('my_key')

    # not found
    v = await event.kv.get('my_key')
    if v:
        return {'status': 503, 'body': b'some thing wrong!'}

    # set data for 3600s
    await event.kv.set('expire_key', 'my_value', 3600)
    # re-expire key for 1s
    await event.kv.expire('expire_key', 1)

    # incrby with inited
    v = await event.kv.incrby('init', 1.1)
    if v != 1.1:
        return {'status': 503, 'body': b'some thing wrong!'}

    # incrby with negative
    v = await event.kv.incrby('init', -1.1)
    if v != 0:
        return {'status': 503, 'body': b'some thing wrong!'}

    try:
        # let`s wait 1s
        await event.fetch('https://www.google.com', {'timeout': 1})
    except Exception:
        pass

    # the key is expired
    v = await event.kv.get('expire_key')
    if v:
        return {'status': 503, 'body': b'some thing wrong!'}

    return {'status': 200, 'body': b'well done!'}
