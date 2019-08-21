local _M = {}

local MOBILE_PREFIX = '/mobile'
local TABLET_PREFIX = '/tablet'
local MOBILE_REG = 'phone'
local TABLET_REG = 'pad'

function _M.handler(event)
    local request = event.request
    local headers = request.headers

    local prefix = ''
    if type(headers['user-agent']) == 'string' then
        if re.find(headers['user-agent'], MOBILE_REG, 'jio') then
            prefix = MOBILE_PREFIX
        elseif re.find(headers['user-agent'], TABLET_REG, 'jio') then
            prefix = TABLET_PREFIX
        end
    end

    request.uri = prefix .. request.uri
    return request
end

return _M
