import json
async def handler(event):
    # get an image from your origin server or somewhere else
    resp = await event.fetch(url='https://www.example.com/example.jpg')

    # call duedge ai
    result = await event.ai.censor.terror_censor(resp.body)

    if result['error_code'] > 0:
        #some errors occured
        event.console.log('error message: %s' % result['error_message'])
        return Response(body=json.dumps(result, ensure_ascii=False), status=200)

    event.console.log('The probability of this picture containing terrorist content is %f' % result['result'])

    if result['result'] > 0.5:
        event.console.log('This image is likely to contain terrorist content')

    return Response(body=json.dumps(result, ensure_ascii=False), status=200)
