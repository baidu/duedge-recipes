async def handler(event):
    # 不止 POST
    # 各种 method 下的 body 都是 event.request.body
    return {'status': 200, 'body': event.request.body, 'headers': {'test': '123'}}
