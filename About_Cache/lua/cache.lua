local _M = {}

function _M.handler(event)
    -- purge cache
    event.cache.purge({
        cache_key = 'my_key'
    })

    -- find cache
    local res, err = event.cache.find({
        cache_key = 'my_key'
    })
    if res then return {status = 500, body = 'test1 fail!'} end

    -- put cache
    event.cache.put({
        cache_key = 'my_key',
        cache_ttl = 3600
    }, {
        status = 200,
        headers = {
            key = 'val'
        },
        body = 'this is my cache'
    })

    -- find cache
    res, err = event.cache.find({
        cache_key = 'my_key',
        cache_ttl = 3600
    })
    if res.status ~= 200 or res.headers['key'] ~= 'val' then 
        return {status = 500, body = 'test2 fail!'} 
    else
        -- discard reponse body to keepalive
        event.discard_reader(res.body)
    end

    -- user fetch response as cache
    res, err = event.fetch('http://www.sina.com')
    event.cache.put({
        cache_key = 'baidu',
        cache_ttl = 3600
    }, res)

    -- fetch hit the cache key (sina not baidu)
    return {
        host = 'www.baidu.com',
        uri = '/',
        cache_key = 'baidu',
        cache_ttl = 3600
    }
end

return _M