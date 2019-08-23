local _M = {}


function _M.handler(event)
    local request = event.request
    local headers = request.headers
    local referer = headers['referer']
    local host = request.host

    -- 如果 referer 存在且包含 host, 继续回源
    if referer then
        if re.find(referer, host, 'joi') then
            return request
        end
    else
        -- 如果 referer 不能存在, 继续回源
        return request
    end

    -- 其他情况
    -- 302 返回本域名首页
    return {status = 302, headers = {
        ['Location'] = string.format('%s://%s', request.origin_scheme, host)
    }}
end

return _M