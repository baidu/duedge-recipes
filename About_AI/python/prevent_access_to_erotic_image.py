import json

#consume the stream body to bytes
async def read_stream_body(body):
    data = []
    while True:
        chunk = await body()
        if not chunk:
            break;
        data.append(chunk)
    return b''.join(data)

async def handler(event):
    # get an image from your origin server or somewhere else
    resp = await event.fetch(url='https://www.example.com/example.jpg')

    # if response is not a image, return response directly
    if resp.headers.get('content-type') not in ['image/jpeg', 'image/png']:
        return resp

    # the stream body can be only consumed once
    # therefore we read the body into bytes from the stream
    body = await read_stream_body(resp.body)

    # call duedge ai
    result = await event.ai.censor.antiporn(body)

    if result['error_code'] > 0:
        #some errors occured
        event.console.log('error message: %s' % result['error_message'])
        return Response(body=json.dumps(result, ensure_ascii=False), status=403, headers={'content-type': 'text/plain'})

    event.console.log('The type of this image\'s content is %s' % result['conclusion'])

    if result['conclusion'] == '色情' or result['conclusion'] == '性感':
        # the image contains pornographic content, should be unavaliable to client
        return Response(body='The image is unavaliable because of containing pornographic content', status=403, headers={'content-type': 'text/plain'})
    else:
        # the image checked ok! return the image to client
        return Response(body=body, status=resp.status, headers=resp.headers)
