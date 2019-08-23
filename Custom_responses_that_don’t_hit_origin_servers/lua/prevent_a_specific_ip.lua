local _M = {}

local BLOCK_REG = [[1\.2\.3\.\d+]]

function _M.handler(event)
    local request = event.request

    -- 如果 client ip 属于 1.2.3.0/24
    -- 返回 403
    if re.find(request.client_ip, BLOCK_REG, 'jo') then
        return {status = 403}
    end

    -- 其他继续回源
    return event.request
end

return _M