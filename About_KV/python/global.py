async def handler(event):
    event.console.log(await event.kv.get_global('exist'))

    event.console.log(await event.kv.get_global(['not-exist', 'exist', 'not-exist']))

    return {'status': 200, 'body': b'done'}