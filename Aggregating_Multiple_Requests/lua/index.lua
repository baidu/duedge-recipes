local _M = {}

function _M.handler(event)
    -- 待请求的 apis
    local apis = {'http://test.demo.com/api1', 'http://test.demo.com/api2', 'http://test.demo.com/api3'}
    local res = {}

    for _, api in ipairs(apis) do
        -- 依次 fetch
        local data, err = event.fetch(api, {origins = event.request.origins})

        if err then
            table.insert(res, err)
        else
            -- warning: 不使用的 body 需要 discard, 否则连接无法复用, 影响性能
            event.discard_reader(data.body)
            table.insert(res, data.status)
        end
    end

    return {status = 200, body = json.encode(res)}
end

return _M