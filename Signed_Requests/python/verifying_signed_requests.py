import urllib.parse as parse
import time
from Crypto.Cipher import AES
import base64


# 工具类
class Crypt:
    __slots__ = (
        'key', 'mode'
    )

    def __init__(self, key):
        # key 长度必须为: (Bytes)
        # 16 AES-128
        # 24 AES-192
        # 32 AES-256
        self.key = key.encode('utf-8')
        self.mode = AES.MODE_CBC

    def encrypt(self, text):
        text = text.encode('utf-8')
        cryptor = AES.new(self.key, self.mode, b'0000000000000000')
        length = 16
        count = len(text)
        if count < length:
            add = (length - count)
            # \0 backspace
            # text = text + ('\0' * add)
            text = text + ('\0' * add).encode('utf-8')
        elif count > length:
            add = (length - (count % length))
            # text = text + ('\0' * add)
            text = text + ('\0' * add).encode('utf-8')

        return base64.b64encode(cryptor.encrypt(text)).decode("utf-8")

    # 解密后，去掉补足的空格用strip() 去掉
    def decrypt(self, text):
        cryptor = AES.new(self.key, self.mode, b'0000000000000000')
        plain_text = cryptor.decrypt(base64.b64decode(text.encode('utf-8')))
        return bytes.decode(plain_text).rstrip('\0')


async def handler(event):
    request = event.request
    uri = request.uri

    # 符合格式的 path 进行签名
    if uri[0:8] != '/verify/':
        return {'status': 200, 'body': 'skip verify'}

    # 获取相关参数
    params = parse.parse_qs(request.args)
    if 'encrypted' not in params:
        return {'status': 403, 'body': 'request is invalid: encrypted is missing'}

    try:
        # 解密
        # 24 AES-192
        decrypted = params.get('encrypted')[0]
        crypt = Crypt('111111111111111111111111')
        decrypted = crypt.decrypt(decrypted)

        if not decrypted or len(decrypted) < 14:
            return {'status': 403, 'body': 'verify fail: expire is invalid'}

        # 判断是否过期
        expire = int(decrypted[-13:])
        now = int(time.time() * 1000)
        if now >= expire:
            return {
                'status': 403,
                'body': 'now    : ' + str(now) + '\n'
                      + 'expired: ' + str(expire) + '\n'
                      + 'this request is expired\n'
            }

        # 校验路径是否一致
        sign_uri = decrypted[:-13]
        request_uri = uri[7:]
        if sign_uri != request_uri:
            return {
                'status': 403,
                'body': 'sign   : ' + sign_uri + '\n'
                      + 'request: ' + request_uri + '\n'
                      + 'verify fail: uri is mismatch\n'
            }

        # 输出详细信息
        return {
            'status': 200,
            'body': 'decrypted: ' + decrypted + '\n'
                  + 'now      : ' + str(now) + '\n'
                  + 'expire   : ' + str(expire) + '\n'
                  + 'sign     : ' + sign_uri + '\n'
                  + 'request  : ' + request_uri + '\n'
                  + 'verify sucess\n'
        }

    except Exception as e:
        event.console.log(e)
        return {'status': 403, 'body': 'verify fail'}