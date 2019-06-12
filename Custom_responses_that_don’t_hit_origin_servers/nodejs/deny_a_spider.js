const ROBOT_REG = /robot/i;

async function f(event) {
    const request = event.request;
    const headers = request.headers;

    let prefix = '';
    if (headers['user-agent']) {
        if (ROBOT_REG.test(headers['user-agent'])) {
            return {status: 403};
        } else {
            return request;
        }
    }
}

exports.handler = f;