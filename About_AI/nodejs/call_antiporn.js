const Stream = require('stream');
const util = require('util');

async function doRequest(event) {
    // get an image from your origin server or somewhere else
    let resp = await event.fetch('http://www.example.com/example.jpg')

    // call duedge ai
    let result = await event.ai.Censor.antiPorn(resp.body);

    if (result['error_code'] > 0) {
        //some errors occured
        event.console.log('error_message:' + result['error_message']);
        return new Response(JSON.stringify(result), {status: 200});
    }

    event.console.log(util.format('The type of this image\'s content is %s', result['conclusion']));

    for (let i = 0;i < result['result'].length;i ++) {
        data = result['result'][i];
        event.console.log(util.format('The probability that the type of this image\'s content is %s: %f' , data['class_name'], data['probability']))
    }

    return new Response(JSON.stringify(result), {status: 200});
}

exports.handler = doRequest;
