local _M = {}

-- 自定义字符串分割函数
local function split(str, sp)  
    local sp = sp or ' ' 
    local tb = {}  
    local pattern = string.format("([^%s ]+)", sp) 
    string.gsub(str, pattern, function(c) tb[#tb + 1] = c end)  
    return tb  
end 

function _M.handler(event)
    local request = event.request
    local args = request.args

    -- 没有参数直接回源
    if #args == 0 then return request end

    -- 分割参数
    local m = split(args, '&')
    
    -- 排序
    table.sort(m)

    -- 重新拼接
    request.args = table.concat(m, '&')

    -- 继续回源
    return request
end

return _M