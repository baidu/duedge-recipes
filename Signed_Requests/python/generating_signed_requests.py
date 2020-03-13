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
    if uri[0:10] != '/generate/':
        return {'status': 200, 'body': 'skip generate'}

    # 生成校验 path
    true_uri = uri[9:]
    new_uri = '/verify' + true_uri

    # 可以通过参数指定过期时间
    params = parse.parse_qs(request.args)
    expire = 60000 # ms
    if 'expire' in params:
        try:
            i = int(params['expire'][0])
            if 0 < i <= 3600 * 1000:
                expire = i
        except:
            pass

    now = int(time.time() * 1000)
    expired = now + expire
    data = true_uri + str(expired)

    # 加密
    # 24 AES-192
    crypt = Crypt('111111111111111111111111')
    encrypted = crypt.encrypt(data)

    # url encode
    args = parse.urlencode({'encrypted': encrypted})

    # 输出详细信息
    return {
        'status': 200,
        'body': 'now    : ' + str(now) + '\n'
              + 'expired: ' + str(expired) + '\n'
              + '%s://%s%s?%s' % (request.client_scheme, request.host, new_uri, args) + '\n'
    }