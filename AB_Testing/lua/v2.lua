local _M = {}

local type   = type
local ipairs = ipairs

local string_find = string.find
local math_random = math.random

local COOKIE_EXPERIMENT_A = 'X%-Experiment%-Name=A'       -- lua string.find 里 '-' 是一个转义字符
local COOKIE_EXPERIMENT_B = 'X%-Experiment%-Name=B'
local REQUEST_A = 'http://test.demo.com/experiment-A'
local REQUEST_B = 'http://test.demo.com/experiment-B'

function _M.handler(event)
    local request = event.request

    -- 非测试页直接回源
    if request.uri ~= '/experiment' then
        return request
    end

    local headers = request.headers
    local new_request

    -- 多值
    if type(headers.cookie) == 'table' then
        for _, v in ipairs(headers.cookie) do
            if string_find(v, COOKIE_EXPERIMENT_A) then
                new_request = REQUEST_A
            elseif string_find(v, COOKIE_EXPERIMENT_B) then
                new_request = REQUEST_B
            end
        end
    elseif type(headers.cookie) == 'string' then
        if string_find(headers.cookie, COOKIE_EXPERIMENT_A) then
            new_request = REQUEST_A
        elseif string_find(headers.cookie, COOKIE_EXPERIMENT_B) then
            new_request = REQUEST_B
        end
    end

    -- 没有 cookie 则随机选取
    if not new_request then
        if math_random() < 0.75 then
            new_request = REQUEST_A
        else
            new_request = REQUEST_B
        end
    end

    -- 使用 fetch 回源, 可以自定义响应
    local res, err = event.fetch(new_request)
    if err then
        return {status = 503, body = err}
    else
        return res
    end
end

return _M
