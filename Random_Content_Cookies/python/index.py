import random


async def handler(event):
    resp = await event.fetch(request=event.request)

    # headers 是 CIMultiDict
    # https://multidict.readthedocs.io/en/stable/multidict.html#cimultidict
    # 直接 add 即可
    resp.headers.add('Set-Cookie',
                     "randomcookie=%s; Expires=Wed, 21 Oct 8102 07:28:00 GMT; Path='/';" % random.random())
    return resp
