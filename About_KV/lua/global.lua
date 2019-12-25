local _M = {}

function _M.handler(event)
    event.console.log(json.encode((event.kv.get_global('exist'))))
    
    event.console.log(json.encode((event.kv.get_global({'not-exist', 'exist', 'not-exist'}))))

    return {status = 200, body = 'done'}
end

return _M