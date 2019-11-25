local _M = {}

function _M.handler(event)
    -- flush history data
    event.kv.flush()

    -- list all keys with ttl
    local list = event.kv.list()
    if #list > 0 then return {status = 503, body = 'test1 fail!'} end

    event.kv.set('key1', '1')
    event.kv.set('key2', '2')
    event.kv.set('key3', '3')
    event.kv.set('myKey', '4')

    -- list all keys with ttl
    local list = event.kv.list()
    if #list ~= 4 then return {status = 503, body = 'test2 fail!'} end

    -- flush history data
    event.kv.flush()

    local v = event.kv.get('my_key')
    if v then return {status = 503, body = 'test3 fail!'} end

    -- set data
    event.kv.set('my_key', 'my_value')
    v = event.kv.get('my_key')
    if v ~= 'my_value' then return {status = 503, body = 'test4 fail!'} end

    -- delete data
    event.kv.del('my_key')
    -- not found
    v = event.kv.get('my_key')
    if v then return {status = 503, body = 'test5 fail!'} end

    -- set data for 3600s
    event.kv.set('expire_key', 'my_value', 3600)
    -- re-expire key for 1s
    event.kv.expire('expire_key', 1)

    -- incrby with inited
    v = event.kv.incrby('init', 1.1)
    if v ~= '1.1' then return {status = 503, body = 'test6 fail!'} end

    -- incrby with negative
    v = event.kv.incrby('init', -1.1)
    if v ~= '0' then return {status = 503, body = 'test7 fail!'} end

    -- let`s wait 1s
    event.fetch('https://www.google.com', {timeout = 1})

    -- not found expired key
    v = event.kv.get('expire_key')
    if v then return {status = 503, body = 'test8 fail!'} end

    -- list: []
    event.kv.lpush('list', '3')
    event.kv.lpush('list', {'2', '1'})
    event.kv.rpush('list', '4')
    event.kv.rpush('list', {'5', '6'})
    -- list: [1, 2, 3, 4, 5, 6]

    v = event.kv.lpop('list')
    if v ~= '1' then return {status = 503, body = 'test9 fail!'} end
    -- list: [2, 3, 4, 5, 6]

    v = event.kv.rpop('list')
    if v ~= '6' then return {status = 503, body = 'test10 fail!'} end
    -- list: [2, 3, 4, 5]

    event.kv.ltrim('list', 1, -1)
    -- list: [3, 4, 5]

    event.kv.ltrim('list', 0, 1)
    -- list: [3, 4]

    v = event.kv.lrange('list', 0, -1)
    if type(v) ~= 'table' or v[1] ~= '3' or v[2] ~= '4' or #v ~= 2 then
        return {status = 503, body = 'test11 fail!'} 
    end

    -- string: bit 0
    v = event.kv.setbit('string', 0, 1)
    if v ~= 0 then return {status = 503, body = 'test12 fail!'} end

    -- string: bit 1
    v = event.kv.setbit('string', 0, 1)
    if v ~= 1 then return {status = 503, body = 'test13 fail!'} end

    event.kv.setbit('string', 7, 1)
    event.kv.setbit('string', 16, 1)
    event.kv.setbit('string', 23, 1)
    -- string: bit 100000010000000010000001

    v = event.kv.getbit('string', 16)
    if v ~= 1 then return {status = 503, body = 'test14 fail!'} end

    -- byte: [1, 1]
    -- bit:  [8, 15]
    v = event.kv.bitcount('string', 1, 1)
    if v ~= 0 then return {status = 503, body = 'test15 fail!'} end

    -- byte: [2, 2]
    -- bit:  [16, 23]
    v = event.kv.bitcount('string', 2, 2)
    if v ~= 2 then return {status = 503, body = 'test16 fail!'} end

    -- byte: [0, 2]
    -- bit:  [0, 23]
    v = event.kv.bitcount('string', 0, 2)
    if v ~= 4 then return {status = 503, body = 'test17 fail!'} end

    return {status = 200, body = 'well done!'}
end

return _M