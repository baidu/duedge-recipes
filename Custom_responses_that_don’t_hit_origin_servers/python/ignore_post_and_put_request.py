async def handler(event):
    request = event.request

    # POST/PUT 返回 403
    if request.method == 'POST' or request.method == 'PUT':
        return {'status': 403}

    # 其他继续回源
    return Request(request=request)
