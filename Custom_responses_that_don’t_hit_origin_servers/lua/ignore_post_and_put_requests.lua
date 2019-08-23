local _M = {}

function _M.handler(event)
    local request = event.request

    -- POST/PUT 返回 403
    if request.method == 'POST' or request.method == 'PUT' then
        return {status = 403}
    end

    -- 其他继续回源
    return event.request
end

return _M