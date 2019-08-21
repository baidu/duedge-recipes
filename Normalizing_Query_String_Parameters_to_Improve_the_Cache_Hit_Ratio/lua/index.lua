local _M = {}

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

    if #args == 0 then return request end

    local m = split(args, '&')
    
    table.sort(m)

    request.args = table.concat(m, '&')


    return request
end

return _M