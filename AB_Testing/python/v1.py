import random

COOKIE_EXPERIMENT_A = 'X-Experiment-Name=A'
COOKIE_EXPERIMENT_B = 'X-Experiment-Name=B'
PATH_EXPERIMENT_A = '/experiment-A'
PATH_EXPERIMENT_B = '/experiment-B'


async def handler(event):
    request = event.request

    # 非测试页直接回源
    if request.uri != '/experiment':
        return Request(request=request, config=event.config)

    headers = request.headers
    experiment_uri = None

    # headers 是 CIMultiDict
    # https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict
    if 'cookie' in headers:
        cookies = headers.getall('cookie')

        for cookie in cookies:
            if cookie.find(COOKIE_EXPERIMENT_A) >= 0:
                experiment_uri = PATH_EXPERIMENT_A
                break
            elif cookie.find(COOKIE_EXPERIMENT_B) >= 0:
                experiment_uri = PATH_EXPERIMENT_B

    # 没有 cookie 则随机选取
    if experiment_uri is None:
        if random.random() < 0.75:
            experiment_uri = PATH_EXPERIMENT_A
        else:
            experiment_uri = PATH_EXPERIMENT_B

    request.uri = experiment_uri

    # runtime 自动回源
    return Request(request=request, config=event.config)