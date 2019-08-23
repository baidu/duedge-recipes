import urllib.parse as parse
from collections import OrderedDict


async def handler(event):
    request = event.request

    # 长度 <= 1 不需要排序
    if len(request.args) <= 1:
        return Request(request=request)

    # 分割参数
    query_dict = parse.parse_qs(request.args)
    # 根据 key 排序
    order = sorted(query_dict)

    # 构造有序参数
    ordered_query_dict = OrderedDict()
    for key in order:
        ordered_query_dict[key] = query_dict[key]

    # 更新参数
    request.args = parse.urlencode(ordered_query_dict, doseq=True)

    # 继续回源
    return Request(request=request)
