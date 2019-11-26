import multidict


async def handler(event):
    # fetch simple url
    res = await event.fetch('https://www.baidu.com')
    if res.status != 200:
        return {
            'status': 500,
            'body': b'test1 fail!'
        }

    # fetch custom request
    res = await event.fetch(request={
        'host': 'www.baidu.com',
        'uri': '/',
        'headers': {
            'key1': 'val1'
        }
    })
    if res.status != 200:
        return {
            'status': 500,
            'body': b'test2 fail!'
        }

    # fetch url and overwrite some key
    # see more options http://duedge.baidu.com/help/index.html#/article-detail/73/92
    multi_headers = multidict.CIMultiDict()
    multi_headers.add('key1', 'val1')
    multi_headers.add('key2', 'val2')
    multi_headers.add('key2', 'val3')
    try:
        res = await event.fetch(url='http://www.baidu.com', request={
            'uri': '/a',
            'method': 'POST',
            'headers': multi_headers,
            'body': 'this is post request',
            'origins': [['1.2.3.4', 80]]
        }, config={
            'timeout': 1
        })
    except Exception as e:
        # may be timeout
        event.console.log(e)

    return {'status': 200, 'body': 'well done!'}
