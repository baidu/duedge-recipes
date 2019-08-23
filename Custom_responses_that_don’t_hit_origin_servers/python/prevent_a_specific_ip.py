import re

BLOCK_REG = '1\.2\.3\.\d+'


async def handler(event):
    request = event.request

    # 如果 client ip 属于 1.2.3.0/24
    # 返回 403
    if re.match(BLOCK_REG, request.client_ip):
        return {'status': 403}

    # 其他继续回源
    return Request(request=request)
