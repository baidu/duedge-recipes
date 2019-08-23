const COOKIE_EXPERIMENT_A = 'X-Experiment-Name=A';
const COOKIE_EXPERIMENT_B = 'X-Experiment-Name=B';
const PATH_EXPERIMENT_A = '/experiment-A';
const PATH_EXPERIMENT_B = '/experiment-B';

async function f(event) {
    let request = event.request;

    // 非测试页直接回源
    if (request.uri !== '/experiment') {
        return request;
    }

    let headers = request.headers;
    let experimentUri;

    // 遵循 nodejs 默认设定
    // http://nodejs.cn/api/http.html#http_class_http_incomingmessage
    if (typeof headers.cookie === 'string') {
        if (headers.cookie.indexOf(COOKIE_EXPERIMENT_A) >= 0) {
            experimentUri = PATH_EXPERIMENT_A;
        } else if (headers.cookie.indexOf(COOKIE_EXPERIMENT_B) >= 0) {
            experimentUri = PATH_EXPERIMENT_B;
        }
    }

    // 没有 cookie 则随机选取
    if (!experimentUri) {
        if (Math.random() < 0.75) {
            experimentUri = PATH_EXPERIMENT_A;
        } else {
            experimentUri = PATH_EXPERIMENT_B;
        }
    }

    request.uri = experimentUri;

    // runtime 自动回源
    return request;
}

exports.handler = f;