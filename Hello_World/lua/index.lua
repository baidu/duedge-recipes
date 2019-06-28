local _M = {}

function _M.handler(event)
    return {status = 200, body = 'Hello DuEdge!'}
end

return _M