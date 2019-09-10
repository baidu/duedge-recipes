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

    # if post body is not an image, do not check
    # send back the request to origin server directly
    if event.requst.method != 'POST' and event.request.headers.get('content-type') not in ['image/jpeg', 'image/png']:
        return Request(request=event.request, config=event.config)

    # get the image from the request
    # the stream body can be only consumed once
    # therefore we read the body into bytes from the stream
    body = await read_stream_body(event.request.body)

    # call duedge ai
    result = await event.ai.censor.antiporn(body)

    if result['error_code'] > 0:
        # some errors occured
        event.console.log('error message: %s' % result['error_message'])
        return Response(body=json.dumps(result, ensure_ascii=False), status=403, headers={'content-type': 'text/plain'})

    event.console.log('The type of this image\'s content is %s' % result['conclusion'])

    if result['conclusion'] == '色情':
        # the image contains pornographic content, forbidden to upload
        return Response(body='The image is forbidden to upload because of containing pornographic content', status=403, headers={'content-type': 'text/plain'})
    else:
        # the image checked ok, upload the image to origin server!
        event.request.body = body
        return await event.fetch(request=event.request)
