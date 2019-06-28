local _M = {}

local BLOCK_REG = [[1\.2\.3\.\d+]]

function _M.handler(event)
    local request = event.request

    if re.find(request.client_ip, BLOCK_REG, 'jo') then
        return {status = 403}
    end

    return event.request
end

return _M