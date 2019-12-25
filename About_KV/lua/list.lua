local _M = {}

function _M.handler(event)
    -- flush history data
    event.kv.flush()

    -- list: []
    event.kv.lpush('list', '3')
    event.kv.lpush('list', {'2', '1'})
    event.kv.rpush('list', '4')
    event.kv.rpush('list', {'5', '6'})
    -- list: [1, 2, 3, 4, 5, 6]

    local v = event.kv.lpop('list')
    if v ~= '1' then return {status = 503, body = 'test1 fail!'} end
    -- list: [2, 3, 4, 5, 6]

    v = event.kv.rpop('list')
    if v ~= '6' then return {status = 503, body = 'test2 fail!'} end
    -- list: [2, 3, 4, 5]

    event.kv.ltrim('list', 1, -1)
    -- list: [3, 4, 5]

    event.kv.ltrim('list', 0, 1)
    -- list: [3, 4]

    v = event.kv.lrange('list', 0, -1)
    if type(v) ~= 'table' or v[1] ~= '3' or v[2] ~= '4' or #v ~= 2 then
        return {status = 503, body = 'test3 fail!'} 
    end

    return {status = 200, body = 'well done!'}
end

return _M