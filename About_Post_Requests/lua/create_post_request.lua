local _M = {}

function _M.handler(event)
    -- 指定 method
    event.request.method = 'POST'
    -- 替换 body
    event.request.body = 'data'

    return event.request
end

return _M