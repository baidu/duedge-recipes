import re

MOBILE_PREFIX = '/mobile'
TABLET_PREFIX = '/tablet'
MOBILE_REG = '.*phone.*'
TABLET_REG = '.*pad.*'


async def handler(event):
    request = event.request
    headers = request.headers

    prefix = ''
    if 'user-agent' in headers:
        # 利用正则匹配不同 UA
        ua = headers.get('user-agent')
        if re.match(MOBILE_REG, ua, re.I):
            prefix = MOBILE_PREFIX
        elif re.match(TABLET_REG, ua, re.I):
            prefix = TABLET_PREFIX

    # 更新 uri
    request.uri = prefix + request.uri

    # runtime 回源
    return Request(request=request)
