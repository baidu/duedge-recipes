local _M = {}

local ROBOT_REG = 'robot'

function _M.handler(event)
    local request = event.request
    local headers = request.headers

    if type(headers['user-agent']) == 'string' then
        if re.find(headers['user-agent'], ROBOT_REG, 'jio') then
            return {status = 403}
        end
    end

    return event.request
end

return _M