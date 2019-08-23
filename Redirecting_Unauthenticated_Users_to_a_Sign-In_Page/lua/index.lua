local _M = {}

function _M.handler(event)
    local request = event.request
    local headers = request.headers
    local cookie = headers['cookie']

    -- 在 cookie 里查找登录 session
    -- 单值是 string
    if type(cookie) == 'string' then
        if string.find(cookie, 'Authorization') then
            return request
        end
    -- 多值是 table
    elseif type(cookie) == 'table' then
        for _, value in ipairs(cookie) do
            if string.find(value, 'Authorization') then
                return request
            end
        end
    end

    -- 302 
    -- 返回登录页
    return {
        status = 302,
        headers = {
            ['Location'] = string.format('http://www.test.com/login?redirect_url=https://%s%s', request.host, request.uri)
        }
    }
end

return _M