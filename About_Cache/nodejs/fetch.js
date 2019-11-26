async function f(event) {
    // fetch simple url
    let res = await event.fetch('https://www.baidu.com')
    if (res.status !== 200) {
        return {
            status: 500,
            body: 'test1 fail!'
        }
    }

    // fetch custom request
    res = await event.fetch({
        host: 'www.baidu.com',
        uri: '/',
        headers: {
            'key1': 'val1'
        }
    })
    if (res.status !== 200) {
        return {
            status: 500,
            body: 'test2 fail!'
        }
    }

    // fetch url and overwrite some key
    // see more options http://duedge.baidu.com/help/index.html#/article-detail/73/92
    res = await event.fetch('http://www.baidu.com', {
        uri: '/a',
        method: 'POST',
        headers: {
            'key1': 'val1',
            'key2': ['val2', 'val3']
        },
        body: 'this is post request',
        origins: [['1.2.3.4', 80]],
        timeout: 1
    }).catch(err => {
        // may be timeout
        event.console.log(err)
    })

    return {status: 200, body: 'wello done!'}
}

exports.handler = f;