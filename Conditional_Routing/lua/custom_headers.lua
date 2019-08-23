local _M = {}

local TAG = 'x-replace'

function _M.handler(event)
    local request = event.request
    local headers = request.headers

    local prefix = ''
    -- 多值取第一个
    if type(headers[TAG]) == 'table' then
        prefix = '/' .. headers[TAG][1]
    elseif type(headers[TAG]) == 'string' then
        prefix = '/' .. headers[TAG]
    end

    -- 更新 uri
    request.uri = prefix .. request.uri

    -- 自动回源
    return request
end

return _M