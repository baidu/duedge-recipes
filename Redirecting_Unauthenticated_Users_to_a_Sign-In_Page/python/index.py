async def handler(event):
    request = event.request
    headers = request.headers

    if 'cookie' in headers:
        # 获取全部 cookie
        cookies = headers.getall('cookie')
        # 查找登录 session
        for cookie in cookies:
            if cookie.find('Authorization') != -1:
                return Request(request=request)

    # 302
    # 返回登录页
    return {
        'status': 302,
        'headers': {
            'Location': 'http://www.test.com/login?redirect_url=https://%s%s' % (request.host, request.uri)
        }
    }
