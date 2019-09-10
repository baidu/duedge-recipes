const Stream = require('stream');
const util = require('util');

async function doRequest(event) {
    // get an image from your origin server or somewhere else
    let resp = await event.fetch('http://www.example.com/example.jpg')

    // call duedge ai
    let result = await event.ai.Censor.politicianCensor(resp.body);

    if (result['error_code'] > 0) {
        //some errors occured
        event.console.log('error_message:' + result['error_message']);
        return new Response(JSON.stringify(result), {status: 200});
    }

    if (result['include_politician'] == '是') {
        event.console.log('Found politicians in the Picture.');
    }
    else {
        event.console.log('There is not politicians in the Picture.');
    }

    for (let i = 0;i < result['result'].length; i ++) {
	let politicians = result['result'][i]['stars'];
	for (let j = 0;j < politicians.length;j ++) {
		event.console.log(util.format('Found %s in the Picture', politicians[j]['name']));
	}
    }

    return new Response(JSON.stringify(result), {status: 200});
}

exports.handler = doRequest;
