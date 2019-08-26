local _M = {}

local aes    = resty.aes

local prefix = [[^/generate/]]

function _M.handler(event)
    local request = event.request
    local uri = request.uri

    -- 符合格式的 path 进行签名
    if re.find(uri, prefix, 'joi') then
        -- 获取签名 path
        local true_uri = string.sub(uri, 10)
        -- 生成校验 path
        local new_uri = '/verify' .. true_uri
        local args = su.decode_args(request.args)

        -- 可以通过参数指定过期时间
        local expire = 60000  -- ms
        if args and args.expire then
            local e = tonumber(args.expire) or 0
            if e > 0 and e < 3600 * 1000 then
                expire = e
            end
        end 

        local now = su.now() -- s
        local expired = now + expire/1000
        local data = true_uri .. expired

        -- 加密
        local aes_128_cbc_md5 = aes:new("my_key")
        -- the default cipher is AES 128 CBC with 1 round of MD5
        -- for the key and a nil salt
        local encrypted = su.encode_base64(aes_128_cbc_md5:encrypt(data))

        -- 输出详细信息
        return {
            status = 200,
            body = 'now    : ' .. now .. '\n'
                .. 'expired: ' .. expired .. '\n'
                .. string.format('%s://%s%s?encrypted=%s', request.client_scheme, request.host, new_uri, encrypted) .. '\n'
        }
    else
        return {status = 200, body = 'skip generate'}
    end
end

return _M