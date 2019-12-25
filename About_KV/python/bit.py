async def handler(event):
    # flush history data
    await event.kv.flush()

    # string: bit 0
    v = await event.kv.setbit('string', 0, 1)
    if v != 0:
        return {'status': 503, 'body': 'test1 fail!'}

    # string: bit 1
    v = await event.kv.setbit('string', 0, 1)
    if v != 1:
        return {'status': 503, 'body': 'test2 fail!'}

    await event.kv.setbit('string', 7, 1)
    await event.kv.setbit('string', 16, 1)
    await event.kv.setbit('string', 23, 1)
    # string: bit 100000010000000010000001

    v = await event.kv.getbit('string', 16)
    if v != 1:
        return {'status': 503, 'body': 'test3 fail!'}

    # byte: [1, 1]
    # bit:  [8, 15]
    v = await event.kv.bitcount('string', 1, 1)
    if v != 0:
        return {'status': 503, 'body': 'test4 fail!'}

    # byte: [2, 2]
    # bit:  [16, 23]
    v = await event.kv.bitcount('string', 2, 2)
    if v != 2:
        return {'status': 503, 'body': 'test5 fail!'}

    # byte: [0, 2]
    # bit:  [0, 23]
    v = await event.kv.bitcount('string', 0, 2)
    if v != 4:
        return {'status': 503, 'body': 'test6 fail!'}

    return {'status': 200, 'body': b'well done!'}
