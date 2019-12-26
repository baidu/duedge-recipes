local _M = {}

function _M.handler(event)
    -- flush history data
    event.kv.flush()

    -- string: bit 0
    local v = event.kv.setbit('string', 0, 1)
    if v ~= 0 then return {status = 503, body = 'test1 fail!'} end

    -- string: bit 1
    v = event.kv.setbit('string', 0, 1)
    if v ~= 1 then return {status = 503, body = 'test2 fail!'} end

    event.kv.setbit('string', 7, 1)
    event.kv.setbit('string', 16, 1)
    event.kv.setbit('string', 23, 1)
    -- string: bit 100000010000000010000001

    v = event.kv.getbit('string', 16)
    if v ~= 1 then return {status = 503, body = 'test3 fail!'} end

    -- byte: [1, 1]
    -- bit:  [8, 15]
    v = event.kv.bitcount('string', 1, 1)
    if v ~= 0 then return {status = 503, body = 'test4 fail!'} end

    -- byte: [2, 2]
    -- bit:  [16, 23]
    v = event.kv.bitcount('string', 2, 2)
    if v ~= 2 then return {status = 503, body = 'test5 fail!'} end

    -- byte: [0, 2]
    -- bit:  [0, 23]
    v = event.kv.bitcount('string', 0, 2)
    if v ~= 4 then return {status = 503, body = 'test6 fail!'} end

    return {status = 200, body = 'well done!'}
end

return _M