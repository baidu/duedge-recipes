local _M = {}

local TAG = 'x-replace'

function _M.handler(event)
    local request = event.request
    local headers = request.headers

    local prefix = ''
    if type(headers[TAG]) == 'table' then
        prefix = '/' .. headers[TAG][1]
    elseif type(headers[TAG]) == 'string' then
        prefix = '/' .. headers[TAG]
    end

    request.uri = prefix .. request.uri
    return request
end

return _M