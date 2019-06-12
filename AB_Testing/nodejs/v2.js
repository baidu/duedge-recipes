const COOKIE_EXPERIMENT_A = 'X-Experiment-Name=A';
const COOKIE_EXPERIMENT_B = 'X-Experiment-Name=B';
const REQUEST_A = 'http://test.demo.com/experiment-A';
const REQUEST_B = 'http://test.demo.com/experiment-B';

async function f(event) {
    let request = event.request;

    if (request.uri !== '/experiment') {
        return request;
    }

    let headers = request.headers;
    let newRequest;

    // 多值
    if (typeof headers.cookie === 'object') {
        // "cookie":["cookie1","cookie2", .... , "cookieN"]
        for (let i = 0; i < headers.cookie.length; i++) {
            if (headers.cookie[i].indexOf(COOKIE_EXPERIMENT_A) >= 0) {
                newRequest = REQUEST_A;
                break;
            } else if (headers.cookie[i].indexOf(COOKIE_EXPERIMENT_B) >= 0) {
                newRequest = REQUEST_B;
                break;
            }
        }
    } else if (typeof headers.cookie === 'string') {
        if (headers.cookie.indexOf(COOKIE_EXPERIMENT_A) >= 0) {
            newRequest = REQUEST_A;
        } else if (headers.cookie.indexOf(COOKIE_EXPERIMENT_B) >= 0) {
            newRequest = REQUEST_B;
        }
    }

    if (!newRequest) {
        if (Math.random() < 0.75) {
            newRequest = REQUEST_A;
        } else {
            newRequest = REQUEST_B;
        }
    }

    const response = await event.fetch(newRequest).catch(err => {
        event.console.log(err);
    });

    return response || {status: 503, body: 'fetch err'};
}

exports.handler = f;