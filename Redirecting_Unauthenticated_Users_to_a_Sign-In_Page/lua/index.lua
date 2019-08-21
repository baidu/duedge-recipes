local _M = {}

function _M.handler(event)
    local request = event.request
    local headers = request.headers
    local cookie = headers['cookie']

    if type(cookie) == 'string' then
        if string.find(cookie, 'Authorization') then
            return request
        end
    elseif type(cookie) == 'table' then
        for _, value in ipairs(cookie) do
            if string.find(value, 'Authorization') then
                return request
            end
        end
    end

    return {
        status = 302,
        headers = {
            ['Location'] = string.format('http://www.test.com/login?redirect_url=https://%s%s', request.host, request.uri)
        }
    }
end

return _M