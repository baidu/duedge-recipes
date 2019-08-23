const COOKIE_EXPERIMENT_A = 'X-Experiment-Name=A';
const COOKIE_EXPERIMENT_B = 'X-Experiment-Name=B';
const REQUEST_A = 'http://test.demo.com/experiment-A';
const REQUEST_B = 'http://test.demo.com/experiment-B';

async function f(event) {
    let request = event.request;

    // 非测试页直接回源
    if (request.uri !== '/experiment') {
        return request;
    }

    let headers = request.headers;
    let newRequest;

    // 遵循 nodejs 默认设定
    // http://nodejs.cn/api/http.html#http_class_http_incomingmessage
    if (typeof headers.cookie === 'string') {
        if (headers.cookie.indexOf(COOKIE_EXPERIMENT_A) >= 0) {
            newRequest = REQUEST_A;
        } else if (headers.cookie.indexOf(COOKIE_EXPERIMENT_B) >= 0) {
            newRequest = REQUEST_B;
        }
    }

    // 没有 cookie 则随机选取
    if (!newRequest) {
        if (Math.random() < 0.75) {
            newRequest = REQUEST_A;
        } else {
            newRequest = REQUEST_B;
        }
    }

    // 使用 fetch 回源, 可以自定义响应
    const response = await event.fetch(newRequest).catch(err => {
        event.console.log(err);
    });

    return response || {status: 503, body: 'fetch err'};
}

exports.handler = f;