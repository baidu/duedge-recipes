import urllib.parse as parse


async def handler(event):
    request = event.request

    # 参数不合法
    if len(request.args) <= 1:
        return {'status': 403, 'body': b'invalid args'}

    # 分割参数
    query_dict = parse.parse_qs(request.args)
    if 'src' not in query_dict:
        return {'status': 403, 'body': b'no src'}

    # 根据 src 回源
    src = query_dict['src'][0]
    resp = None
    try:
        resp = await event.fetch(url=src)
    except Exception as e:
        event.console.log(e)

    # 检查响应状态码
    if resp:
        if 400 > resp.status >= 200:
            return resp
        else:
            # 非预期状态码, 通过 302 让浏览器自行回源
            return {
                'status': 302,
                'headers': {
                    'Location': src
                }
            }
    else:
        return {'status': 503, 'body': b'fetch err'}

