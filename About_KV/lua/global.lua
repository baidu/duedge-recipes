local _M = {}

function _M.handler(event)
    local v = event.kv.get_global('my_key')

    if v then
        return {status = 200, body = v}
    else
        return {status = 404}
    end
end

return _M