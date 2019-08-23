local _M = {}

local aes    = resty.aes

local prefix = [[^/verify/]]

function _M.handler(event)
    local request = event.request
    local uri = request.uri

    -- 符合格式的 path 进行签名校验
    if re.find(uri, prefix, 'joi') then
        local args = su.decode_args(request.args)
        local encrypted = args.encrypted

        if not encrypted then 
            return {status = 403, body = 'request is invalid: encrypted is missing'}
        end

        -- 解密
        local aes_128_cbc_md5 = aes:new("my_key")
        local decrypted = aes_128_cbc_md5:decrypt(su.decode_base64(encrypted) or '')

        if not decrypted or #decrypted < 14 then
            return {status = 403, body = 'verify fail: expire is invalid'}
        end

        local expire = tonumber(string.sub(decrypted, -14))
        if not expire then
            return {status = 403, body = 'verify fail: expire is invalid'}
        end

        -- 判断是否过期
        local now = su.now()
        if now >= expire then
            return {
                status = 403, 
                body = 'now    : ' .. now .. '\n'
                    .. 'expired: ' .. expire .. '\n'
                    .. 'this request is expired\n'
            }
        end

        -- 校验路径是否一致
        local sign_uri = string.sub(decrypted, 0, #decrypted - 14)
        local request_uri = string.sub(request.uri, 8)
        if sign_uri ~= request_uri then
            return {
                status = 403, 
                body = 'sign   : ' .. sign_uri .. '\n'
                    .. 'request: ' .. request_uri .. '\n'
                    .. 'verify fail: uri is mismatch\n'
            }
        end

        -- 输出详细信息
        return {
            status = 200,
            body = 'decrypted: ' .. decrypted .. '\n'
                .. 'now      : ' .. now .. '\n'
                .. 'expire   : ' .. expire .. '\n'
                .. 'sign     : ' .. sign_uri .. '\n'
                .. 'request  : ' .. request_uri .. '\n'
                .. 'verify sucess\n'
        }

    else
        return {status = 200, body = 'skip verify'}
    end
end

return _M