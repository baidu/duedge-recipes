local _M = {}

function _M.handler(event)
    -- fetch simple url
    local res, err = event.fetch('https://www.baidu.com')
    -- discard reponse body to keepalive
    event.discard_reader(res.body)
    if res.status ~= 200 then return {status = 500, body = 'test1 fail!'} end

    -- fetch custom request
    res, err = event.fetch({
        host =  'www.baidu.com',
        uri = '/',
        headers = {
            key1 = 'val1'
        }
    })
    -- discard reponse body to keepalive
    event.discard_reader(res.body)
    if res.status ~= 200 then return {status = 500, body = 'test2 fail!'} end

    -- fetch url and overwrite some key
    -- see more options http://duedge.baidu.com/help/index.html#/article-detail/73/92
    res, err = event.fetch('http://www.baidu.com', {
        uri = '/a',
        method = 'POST',
        headers = {
            key1 = 'val1',
            key2 = {'val2', 'val3'}
        },
        body = 'this is post request',
        origins = {{'1.2.3.4', 80}},
        timeout = 1
    })
    -- maybe timeout
    if err then
        event.console.log(err)
    else
        event.discard_reader(res.body)
    end

    return {status = 200, body = 'well done!'}
end

return _M