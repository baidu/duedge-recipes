import json


async def handler(event):
    # 待请求的 apis
    apis = ['http://test.wangwenqi.win/api1', 'http://test.wangwenqi.win/api2', 'http://test.wangwenqi.win/api3']
    data = []

    # 依次 fetch
    for api in apis:
        try:
            resp = await event.fetch(api)
            data.append(resp.status)
        except Exception as e:
            # 捕获异常
            event.console.log(type(e), e)
            data.append(503)

    return {'status': 200, 'body': json.dumps(data)}

