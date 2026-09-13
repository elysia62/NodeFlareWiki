# 反向代理

服务端默认只监听 `127.0.0.1:2206`，对外访问请使用 HTTPS 反向代理。

## 可信代理

必须把反向代理地址加入 `trusted_proxies`，否则所有访客会被算作同一个 IP，且会话 Cookie 不会带上 `Secure`：

```toml
trusted_proxies = ["127.0.0.1/32", "::1/128"]
```

只有来自这些网段的 `X-Forwarded-For` 才会被信任。

## nginx

```nginx
server {
    listen 443 ssl;
    server_name nodeflare.example.com;

    ssl_certificate     /etc/letsencrypt/live/nodeflare.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nodeflare.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:2206;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;   # WebSocket 实时数据
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

::: tip
`Upgrade` / `Connection` 两行用于 WebSocket，缺少它们实时数据将无法刷新。
:::

## Caddy

```
nodeflare.example.com {
    reverse_proxy 127.0.0.1:2206
}
```
