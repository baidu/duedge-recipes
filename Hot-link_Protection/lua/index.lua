local _M = {}


function _M.handler(event)
    local request = event.request
    local headers = request.headers
    local referer = headers['referer']
    local host = request.host

    if referer then
        if re.find(referer, host, 'joi') then
            return request
        end
    else
        return request
    end


    return {status = 302, headers = {
        ['Location'] = string.format('%s://%s', request.origin_scheme, host)
    }}
end

return _M