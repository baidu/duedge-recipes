local _M = {}

local ROBOT_REG = 'robot'

function _M.handler(event)
    local request = event.request
    local headers = request.headers

    -- 如果 UA 中含有 robot 关键字, 返回 403
    if type(headers['user-agent']) == 'string' then
        if re.find(headers['user-agent'], ROBOT_REG, 'jio') then
            return {status = 403}
        end
    end

    -- 其他继续回源
    return event.request
end

return _M