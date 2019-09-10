const Stream = require('stream');
const util = require('util');

async function doRequest(event) {
    // get an image from your origin server or somewhere else
    let resp = await event.fetch('http://www.example.com/example.jpg')

    // call duedge ai
    let result = await event.ai.Censor.imageCensor(resp.body);

    if (result['error_code'] > 0) {
        //some errors occured
        event.console.log('error_message:' + result['error_message']);
        return new Response(JSON.stringify(result), {status: 200});
    }

    event.console.log(util.format('The check conclusion of the Pictures is %s.', result['conclusion']));

    if ('data' in result) {
        for (let i = 0;i < result['data'].length;i ++) {
            data = result['data'][i];
            event.console.log(util.format('violation type: %d, violation msg: %s' , data['type'], data['msg']))
        }
    }

    return new Response(JSON.stringify(result), {status: 200});
}

exports.handler = doRequest;
