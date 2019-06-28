local _M = {}

function _M.handler(event)
    local request = event.request

    if request.method == 'POST' or request.method == 'PUT' then
        return {status = 403}
    end

    return event.request
end

return _M