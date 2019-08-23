local _M = {}

function _M.handler(event)
    -- 利用 fetch 回源
    local res, err = event.fetch(event.request)
    if err then
        return {status = 503, body = err}
    end

    -- 生成 cookie
    local data = string.format('randomcookie=%d; Expires=Wed, 21 Oct 8102 07:28:00 GMT; Path="/"', math.random())

    local headers = res.headers
    local cookie = headers['Set-Cookie']
    -- 只有一个, 构造成数组形式
    if type(cookie) == 'string' then
        cookie = {cookie, data}
    -- 多个, 在数组中追加
    elseif type(cookie) == 'table' then
        table.insert(cookie, data)
    else
    -- 不存在, 直接赋值
        cookie = data
    end

    -- 在响应中添加 header
    headers['Set-Cookie'] = cookie

    -- 返回 client
    return res
end

return _M