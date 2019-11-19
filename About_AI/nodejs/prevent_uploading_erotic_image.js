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
    // if post body is not an image, do not check
    // send back the request to origin server directly
    if (event.request.method != 'POST') {
        return event.request;
    }

    if (event.request.headers['content-type'] != 'image/jpeg' && event.request.headers['content-type'] != 'image/png') {
        return event.request;
    }

    // get the image from the request
    // the stream body can be only consumed once
    // therefore we read the body into buffer from the stream
    let bodyBuffer = await readableToBuffer(event.request.body);

    let result = await event.ai.Censor.antiPorn(bodyBuffer);

    event.console.log(util.format('The type of this image\'s content is %s', result.conclusion))

    if (result.conclusion == '性感' || result.conclusion == '色情') {
        // the image contains pornographic content, forbidden to upload
        let resp = new Response('The image is forbidden to upload because of containing pornographic content', {status: 403});
        return resp;
    }
    else {
        // the image checked ok! post the image to origin server
        let streamBody = new Stream.Duplex();
        streamBody.push(bodyBuffer);
        streamBody.push(null);

        event.request.body = streamBody;

        let resp = await event.fetch(event.request);
        return resp;
    }
}
exports.handler = doRequest;
