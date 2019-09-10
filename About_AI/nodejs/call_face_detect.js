const Stream = require('stream');
const util = require('util');

async function doRequest(event) {
    // get an image from your origin server or somewhere else
    let resp = await event.fetch('http://www.example.com/example.jpg')

    let result = await event.ai.Face.faceDetect(resp.body, {"face_field": "age,beauty,expression", "max_face_num": "3"});

    if (result['error_code'] > 0) {
        //some errors occured
        event.console.log('error_message:' + result['error_message']);
        return new Response(JSON.stringify(result), {status: 200});
    }

    event.console.log(util.format('%d faces Found in the Picture.', result['result']['face_num']));
    for (let i = 0;i < result['result']['face_num'];i ++) {
        let face = result['result']['face_list'][i];
        event.console.log(util.format('No.%d face\'s age is %d', i, face['age']));
        event.console.log(util.format('No.%d face\'s location is %s', i, JSON.stringify(face['location'])));
        event.console.log(util.format('No.%d face\'s expression is %s', i, face['expression']['type']));
        event.console.log(util.format('No.%d face\'s beauty score is %f', i, face['beauty']));
    }

    return new Response(JSON.stringify(result), {status: 200});
}

exports.handler = doRequest;
