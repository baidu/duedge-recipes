local _M = {}

local type   = type
local ipairs = ipairs

local string_find = string.find
local math_random = math.random

local COOKIE_EXPERIMENT_A = 'X%-Experiment%-Name=A'       -- lua string.find 里 '-' 是一个转义字符
local COOKIE_EXPERIMENT_B = 'X%-Experiment%-Name=B'
local PATH_EXPERIMENT_A = '/experiment-A'
local PATH_EXPERIMENT_B = '/experiment-B'

function _M.handler(event)
    local request = event.request
    if request.uri ~= '/experiment' then
        return request
    end

    local headers = request.headers
    local experiment_uri

    -- 多值
    if type(headers.cookie) == 'table' then
        for _, v in ipairs(headers.cookie) do
            if string_find(v, COOKIE_EXPERIMENT_A) then
                experiment_uri = PATH_EXPERIMENT_A
            elseif string_find(v, COOKIE_EXPERIMENT_B) then
                experiment_uri = PATH_EXPERIMENT_B
            end
        end
    elseif type(headers.cookie) == 'string' then
        if string_find(headers.cookie, COOKIE_EXPERIMENT_A) then
            experiment_uri = PATH_EXPERIMENT_A
        elseif string_find(headers.cookie, COOKIE_EXPERIMENT_B) then
            experiment_uri = PATH_EXPERIMENT_B
        end
    end

    if not experiment_uri then
        if math_random() < 0.75 then
            experiment_uri = PATH_EXPERIMENT_A
        else
            experiment_uri = PATH_EXPERIMENT_B
        end
    end

    request.uri = experiment_uri
    return request
end

return _M