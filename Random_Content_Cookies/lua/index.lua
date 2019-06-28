local _M = {}

function _M.handler(event)
    local res, err = event.fetch(event.request)
    if err then
        return {status = 503, body = err}
    end

    local headers = res.headers
    local cookie = headers['Set-Cookie']
    local data = string.format('randomcookie=%d; Expires=Wed, 21 Oct 8102 07:28:00 GMT; Path="/"', math.random())

    if type(cookie) == 'string' then
        cookie = {cookie, data}
    elseif type(cookie) == 'table' then
        table.insert(cookie, data)
    else
        cookie = data
    end

    headers['Set-Cookie'] = cookie
    return res
end

return _M