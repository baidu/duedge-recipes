local _M = {}

function _M.handler(event)
    -- lua log just support string
    local log = event.console.log

    -- log common type
    log(123, 123.456, 'string', {a = 123}, {'123', 123})

    -- log err

    local _, err = pcall(function()
        fooooooo()
    end)
    log(err)

    -- log event
    log(event)

    -- log object
    log(json.encode({ a = 123, b = {'123', 666}}))

    return {status = 200}
end

return _M