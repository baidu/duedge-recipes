TAG = 'x-replace'


async def handler(event):
    request = event.request
    headers = request.headers

    prefix = ''
    # 多值取第一个
    if TAG in headers:
        prefix = '/' + headers.get(TAG)

    # 更新 uri
    request.uri = prefix + request.uri

    # runtime 自动回源
    return Request(request=request)
