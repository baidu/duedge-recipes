const COOKIE_EXPERIMENT_A = 'X-Experiment-Name=A';
const COOKIE_EXPERIMENT_B = 'X-Experiment-Name=B';
const PATH_EXPERIMENT_A = '/experiment-A';
const PATH_EXPERIMENT_B = '/experiment-B';

exports.handler = (event, context, callback) => {
    let req = event.req;

    if (req.uri !== '/experiment') {
        callback(null, {'skip': true});
        return;
    }

    let headers = req.headers;
    let experimentUri;
    if (headers.cookie) {
        // "cookie":["cookie1","cookie2", .... , "cookieN"]
        for (let i = 0; i < headers.cookie.length; i++) {
            if (headers.cookie[i].indexOf(COOKIE_EXPERIMENT_A) >= 0) {
                experimentUri = PATH_EXPERIMENT_A;
                break;
            } else if (headers.cookie[i].indexOf(COOKIE_EXPERIMENT_B) >= 0) {
                experimentUri = PATH_EXPERIMENT_B;
                break;
            }
        }
    }

    if (!experimentUri) {
        if (Math.random() < 0.75) {
            experimentUri = PATH_EXPERIMENT_A;
        } else {
            experimentUri = PATH_EXPERIMENT_B;
        }
    }

    req.uri = experimentUri;

    callback(null, req);
};