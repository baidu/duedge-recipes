const Stream = require('stream');
const util = require('util');

async function doRequest(event) {
    // get an image from your origin server or somewhere else
    let resp = await event.fetch('http://www.example.com/example.jpg')

    // call duedge ai
    let result = await event.ai.Censor.terrorCensor(resp.body);

    if (result['error_code'] > 0) {
        //some errors occured
        event.console.log('error_message:' + result['error_message']);
        return new Response(JSON.stringify(result), {status: 200});
    }

    event.console.log(util.format('The probability of this picture containing terrorist content is %f', result['result']));

    if (result['result'] > 0.5) {
        event.console.log('This image is likely to contain terrorist content')
    }

    return new Response(JSON.stringify(result), {status: 200});
}

exports.handler = doRequest;
