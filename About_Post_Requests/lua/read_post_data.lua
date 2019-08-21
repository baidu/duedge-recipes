local _M = {}

function _M.handler(event)
    return {status = 200, body = event.request.body, headers = {['test'] = '123'}}
end

return _M