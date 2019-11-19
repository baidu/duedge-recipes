import json
async def handler(event):
    # get an image from your origin server or somewhere else
    resp = await event.fetch(url='https://www.example.com/example.jpg')

    # call duedge ai
    result = await event.ai.censor.politician_censor(resp.body)

    if result['error_code'] > 0:
        #some errors occured
        event.console.log('error message: %s' % result['error_message'])
        return Response(body=json.dumps(result, ensure_ascii=False), status=200)

    if result['include_politician'] == '是':
        event.console.log('Found politicians in the Picture.')
    else:
        event.console.log('There is not politicians in the Picture.')

    for data in result['result']:
        for politician_star in data['stars']:
            event.console.log('Found %s in the Picture' % politician_star['name'])

    return Response(body=json.dumps(result, ensure_ascii=False), status=200)
