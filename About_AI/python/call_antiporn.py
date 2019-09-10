import json
async def handler(event):
    # get a image from your origin server or internet
    resp = await event.fetch(url='https://www.example.com/example.jpg')

    # call duedge_ai
    result = await event.ai.censor.antiporn(resp.body)

    if result['error_code'] > 0:
        #some errors occured
        event.console.log('error message: %s' % result['error_message'])
        return Response(body=json.dumps(result, ensure_ascii=False), status=200)

    event.console.log('The type of this image\'s content is %s' % result['conclusion'])

    for data in result['result']:
        event.console.log('The probability that the type of this image\'s content is %s: %f' % (data['class_name'], data['probability']))


    return Response(body=json.dumps(result, ensure_ascii=False), status=200)
