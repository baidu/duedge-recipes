import multidict


async def handler(event):
    # purge cache
    await event.cache.purge({
        'cache_key': 'my_key'
    })

    # find cache
    res = await event.cache.find({
        'cache_key': 'my_key'
    })
    if res:
        return {'status': 500, 'body': 'test1 fail!'}

    # put cache
    await event.cache.put(args={
        'cache_key': 'my_key',
        'cache_ttl': 3600
    }, response={
        'status': 200,
        'headers': {
            'key': 'val'
        },
        'body': 'this is my cache'
    })

    # find cache
    res = await event.cache.find({
        'cache_key': 'my_key'
    })

    if res.status != 200 or res.headers['key'] != 'val':
        return {'status': 500, 'body': 'test2 fail!'}

    # use fetch response as cache
    res = await event.fetch('http://www.sina.com')
    await event.cache.put(args={
        'cache_key': 'baidu',
        'cache_ttl': 3600
    }, response=res)

    # fetch hit the cache key (sina not baidu)
    return {
        'host': 'www.baidu.com',
        'uri': '/',
        'cache_key': 'baidu',
        'cache_ttl': 3600
    }
