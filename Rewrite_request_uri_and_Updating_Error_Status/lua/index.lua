local _M = {}

function _M.handler(event)
    local request = event.request
    if not request.args then
        return {status = 400, body = 'no args'}
    end

    local args = su.decode_args(request.args)
    
    local src = args.src
    if not src then
        return {status = 400, body = 'no src'}
    end

    local res, err = event.fetch(src, {origins = event.request.origins})
    if err then
        return {status = 503, body = err}
    end

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