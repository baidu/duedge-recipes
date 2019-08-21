local _M = {}

function _M.handler(event)
    -- flush history data
    event.kv.del('my_key')

    local v = event.kv.get('my_key')
    if v then return {status = 503, body = 'some thing wrong!'} end

    -- set data
    event.kv.set('my_key', 'my_value')
    v = event.kv.get('my_key')
    if v ~= 'my_value' then return {status = 503, body = 'some thing wrong!'} end

    -- delete data
    event.kv.del('my_key')
    -- not found
    v = event.kv.get('my_key')
    if v then return {status = 503, body = 'some thing wrong!'} end

    -- set data for 3600s
    event.kv.set('expire_key', 'my_value', 3600)
    -- re-expire key for 1s
    event.kv.expire('expire_key', 1)

    -- incrby with inited
    v = event.kv.incrby('init', 1.1)
    if v ~= '1.1' then return {status = 503, body = 'some thing wrong!'} end

    -- incrby with negative
    v = event.kv.incrby('init', -1.1)
    if v ~= '0' then return {status = 503, body = 'some thing wrong!'} end

    -- let`s wait 1s
    event.fetch('https://www.google.com', {timeout = 1})

    -- not found expired key
    v = event.kv.get('expire_key')
    if v then return {status = 503, body = 'some thing wrong!'} end

    return {status = 200, body = 'well done!'}
end

return _M