import re

ROBOT_REG = '.*robot.*'


async def handler(event):
    request = event.request
    headers = request.headers

    # 如果 UA 中含有 robot 关键字, 返回 403
    if 'user-agent' in headers:
        ua = headers.get('user-agent')
        if re.match(ROBOT_REG, ua, re.I):
            return {'status': 403}

    # 其他继续回源
    return Request(request=request)
