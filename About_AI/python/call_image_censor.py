import json
async def handler(event):
    # get an image from your origin server or somewhere else
    resp = await event.fetch(url='https://www.example.com/example.jpg')

    # call duedge ai
    result = await event.ai.censor.image_censor(resp.body)

    if result['error_code'] > 0:
        #some errors occured
        event.console.log('error message: %s' % result['error_message'])
        return Response(body=json.dumps(result, ensure_ascii=False), status=200)

    event.console.log('The check conclusion of the Pictures is %s.' % (result['conclusion']))
    if 'data' in result:
        for censor_data in result['data']:
            event.console.log('violation type: %d, violation msg: %s' % (censor_data['type'], censor_data['msg']))

    return Response(body=json.dumps(result, ensure_ascii=False), status=200)
