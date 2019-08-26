async def handler(event):
    # 指定 method
    event.request.method = 'POST'
    # 替换 body
    event.request.body = b'data'

    return Request(request=event.request)
