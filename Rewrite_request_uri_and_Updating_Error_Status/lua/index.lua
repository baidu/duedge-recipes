local _M = {}

function _M.handler(event)
    local request = event.request

    -- 检查参数
    if not request.args then
        return {status = 400, body = 'no args'}
    end

    -- 分割参数
    local args = su.decode_args(request.args)
    
    local src = args.src
    if not src then
        return {status = 400, body = 'no src'}
    end

    -- 根据 src 进行 fetch
    local res, err = event.fetch(src, {origins = event.request.origins})
    if err then
        return {status = 503, body = err}
    end

    -- 如果返回状态码不符合预期
    -- 302, 让浏览器自动回源
    if res.status >= 200 and res.status < 400 then
        return res
    else
        event.discard_reader(res.body)
        return {
            status = 302,
            headers = {
                ['Location'] = src
            }
        }
    end
end

return _M