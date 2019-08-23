async def handler(event):
    v = await event.kv.get_global('my_key1')

    if v is not None:
        return {'status': 200, 'body': v}
    else:
        return {'status': 404, 'body': b'not found!'}
