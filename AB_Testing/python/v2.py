import random

COOKIE_EXPERIMENT_A = 'X-Experiment-Name=A'
COOKIE_EXPERIMENT_B = 'X-Experiment-Name=B'
REQUEST_A = 'http://test.wangwenqi.win/experiment-A'
REQUEST_B = 'http://test.wangwenqi.win/experiment-B'


async def handler(event):
    request = event.request

    # 非测试页直接回源
    if request.uri != '/experiment':
        return Request(request=request, config=event.config)

    headers = request.headers
    request_url = None

    # headers 是 CIMultiDict
    # https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict
    if 'cookie' in headers:
        cookies = headers.getall('cookie')

        for cookie in cookies:
            if cookie.find(COOKIE_EXPERIMENT_A) >= 0:
                request_url = REQUEST_A
                break
            elif cookie.find(COOKIE_EXPERIMENT_B) >= 0:
                request_url = REQUEST_B

    # 没有 cookie 则随机选取
    if request_url is None:
        if random.random() < 0.75:
            request_url = REQUEST_A
        else:
            request_url = REQUEST_B

    try:
        # 使用 fetch 回源, 可以自定义响应
        resp = await event.fetch(url=request_url)
        return resp
    except Exception as e:
        event.console.log(type(e), e)
        return {'status': 503, 'body': b'fetch err'}
