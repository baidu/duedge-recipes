import re


async def handler(event):
    request = event.request
    headers = request.headers

    # 如果 referer 存在且包含 host, 继续回源
    if 'referer' in headers:
        referer = headers.get('referer')
        if re.match('.*' + request.host + '.*', referer):
            return Request(request=request)
    else:
        # 如果 referer 不能存在, 继续回源
        return Request(request=request)

    # 其他情况
    # 302 返回本域名首页
    return {
        'status': 302,
        'headers': {
            'Location': '%s://%s' % (request.origin_scheme, request.host)
        }
    }
