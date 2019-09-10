import json
async def handler(event):
    # get an image from your origin server or somewhere else
    resp = await event.fetch(url='https://www.example.com/example.jpg')

    #call duedge ai
    result = await event.ai.face.face_detect(resp.body, {'face_field': 'age,beauty,expression'})

    if result['error_code'] > 0:
        #some errors occured
        event.console.log('error message: %s' % result['error_message'])
        return Response(body=json.dumps(result, ensure_ascii=False), status=200)

    event.console.log('%d faces Found in the Picture.' % (result['result']['face_num']))
    for i, face in enumerate(result['result']['face_list']):
        event.console.log('No.%d face\'s age is %d' % (i, face['age']))
        event.console.log('No.%d face\'s location is %s' % (i, json.dumps(face['location'])))
        event.console.log('No.%d face\'s expression is %s' % (i, face['expression']['type']))
        event.console.log('No.%d face\'s beauty score is %s' % (i, json.dumps(face['beauty'])))

    return Response(body=json.dumps(result, ensure_ascii=False), status=200)
