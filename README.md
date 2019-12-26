# DuEdge Recipes

[duedge](https://duedge.baidu.com/) 为租户提供 FaaS(Serverless) 服务, 租户可以将功能函数运行在 Edge 端 (cdn 节点), 实现边缘计算应用场景.

核心功能:

- 可根据业务应用直接编写计算函数, 无需考虑服务器等基础资源的配置, 按实际计算量计费;
- 遍布全国各地的超级计算中心, 支持各种网络线路的高速稳定连接, 为函数计算提供基础支持;
- 自动为函数分配计算资源, 并根据网络连接情况为服务分配最优路径的边缘节点;


此代码仓库旨在提供常见任务的示例, 包括:

- About Log (如何记录 log)
- About Cache (cache 相关操作)
  - fetch (利用 fetch 回源)
  - cache (操作本地缓存)
- About KV
  - global (全局只读 KV)
  - string (机房内可读可写 KV, string 相关, get/set/setnx/incrby)
  - bit (机房内可读可写 KV, bit 相关, getbit/setbit/bitcount)
  - list (机房内可读可写 KV, list 相关, lpush/rpush/lpop/rpop/lrange/ltrim)
- A/B Testing (根据 cookie 修改 uri 为 A/B 两种页面)
- Redirecting Unauthenticated Users to a Sign-In Page (根据 cookie 情况重定向到登录页)
- Aggregating Multiple Requests (合并多分请求结果)
- Conditional Routing
  - Device Type (不同设备类型, 访问不同页面)
  - Custom Headers (使用特殊 header 替换 uri)
- Custom responses that don’t hit origin servers
  - Ignore POST And PUT HTTP Requests (忽略 POST/PUT 请求)
  - Deny A Spider Or Crawler (拦截爬虫)
  - Prevent A Specific IP From Connecting (根据 clinetIP 拦截)
- Hot-link Protection (防盗链)
- About Post Requests
  - Read Post Data (获取 POST body)
  - Create a Post Request (构造 POST 请求)
- Random Content Cookies (构造 cookie)
- Signed Requests
  - Generating Signed Requests (生成签名)
  - Verifying Signed Requests (验证签名)
- Normalizing Query String Parameters to Improve the Cache Hit Ratio (参数排序, 提高缓存命中率)
- Rewrite request uri and Updating Error Statuses
  - Rewrite request uri (改写请求)
  - Update the Error Status Code to 302-Found (重定向异常响应)
- About AI
  - Call face detect example (调用人脸检测)
  - Call image censor example (调用图像审核)
  - Call antiporn example (调用色情识别)
  - Call terror censor example (调用暴恐识别)
  - Call politician censor example (调用政治人物)
  - Prevent uploading erotic image (防止上传色情图片)
  - Prevent access to erotic image (防止用户访问色情图片)


## 快速开始

在 [duedge](https://duedge.baidu.com) 官网接入域名, 绑定 `Hello World` 函数, 符合 `route` 规则的请求均会返回 200 / Hello DuEdge!

### node

```js
async function f(event) {
    return {status: 200, body: 'Hello DuEdge!'};
}
exports.handler = f;
```

### python

```python
async def handler(event):
    return {'status': 201, 'body': 'Hello DuEdge!'}
```

### lua

```lua
local _M = {}

function _M.handler(event)
    return {status = 200, body = 'Hello DuEdge!'}
end

return _M
```

## 测试

代码编辑页面支持在线测试函数调用, 通过请求触发函数需要域名正式接入 duedge;


## 如何贡献

我们欢迎**使用/修改/拓展**这些, 如果你有更好的使用场景, 直接提交 **PR** 即可;


## 讨论

[官网帮助中心](https://duedge.baidu.com/help/#/)
