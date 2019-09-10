const Stream = require('stream');
const util = require('util');

// consume the stream body to buffer
async function readableToBuffer(body, event) {
    let buffers = [];
    
    let p = new Promise(function(resolve, reject) {
        body.on('data', chunk => {
            buffers.push(chunk);
        });
        body.on('end', () => {
            resolve(true);
        });
    });

    await p;
    return Buffer.concat(buffers);
}

async function doRequest(event) {
    // get an image from your origin server or somewhere else
    let resp = await event.fetch('http://www.example.com/example.jpg');

    // if response is not an image, return response directly
    if (resp.headers['content-type'] != 'image/jpeg' && resp.headers['content-type'] != 'image/png') {
        event.console.log('not image')
        return resp
    }

    // the stream body can be only consumed once
    // therefore we read the body into buffer from the stream
    let bodyBuffer = await readableToBuffer(resp.body,event);

    // call duedge ai
    let result = await event.ai.Censor.antiPorn(bodyBuffer);

    if (result.error_code > 0) {
        // maybe something went wrong
        event.console.log(result.error_message);
        return new Response(bodyBuffer, {
            status: resp.status,
            headers: resp.headers
        });
    }

    event.console.log(util.format('The type of this image\'s content is %s', result.conclusion))

    if (result.conclusion == '色情') {
        // the image contain pornographic content, should be unavaliable to client
        let resp = new Response('The image is unavaliable because of containing pornographic content', {status: 403});
        return resp;
    }
    else {
        // the image checked ok!
        return new Response(bodyBuffer, {status: 200, headers: resp.headers});
    }
}

exports.handler = doRequest;
