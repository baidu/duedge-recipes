async function f(event) {
    // purge cache
    await event.cache.purge({
        cacheKey: 'myKey'
    })

    // find cache
    res = await event.cache.find({
        cacheKey: 'myKey'
    })
    if (res) {
        return {status: 500, body: 'test1 fail'}
    }

    // put cache
    await event.cache.put({
        cacheKey: 'myKey',
        cacheTtl: 3600,
    }, {
        status: 200,
        headers: {
            'key': 'val'
        },
        body: 'this is my cache'
    })

    // find cache
    res = await event.cache.find({
        cacheKey: 'myKey'
    })
    if (res.status !== 200 || res.headers.key !== 'val') {
        return {status: 500, body: 'test2 fail'}
    }

    // use fetch response as cache
    res = await event.fetch('http://www.sina.com')
    await event.cache.put({
        cacheKey: 'baidu',
        cacheTtl: 3600,
    }, res)
    
    // fetch hit the cache key (sina not baidu)
    return {
        host: 'www.baidu.com',
        uri: '/',
        cacheKey: 'baidu',
        cacheTtl: 3600,
    }
}

exports.handler = f;