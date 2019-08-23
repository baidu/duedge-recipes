async def handler(event):
    # log common type
    event.console.log(123, 123.456, 'string', {'a': 123}, ['123', 123])

    # log class
    class A:
        pass
    event.console.log(A())

    # log err
    try:
        aaaaa()
    except Exception as e:
        event.console.log(e)

    # log event
    event.console.log(event)

    return {'status': 200}
