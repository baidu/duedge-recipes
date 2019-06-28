local _M = {}

function _M.handler(event)
    event.request.method = 'POST'
    event.request.body = 'data'

    return event.request
end

return _M