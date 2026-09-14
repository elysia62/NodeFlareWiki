# 反向代理

服务端默认只监听 `127.0.0.1:2206`，对外访问请使用 HTTPS 反向代理。

## 可信代理

必须把反向代理地址加入 `trusted_proxies`，否则所有访客会被算作同一个 IP，且会话 Cookie 不会带上 `Secure`：

```toml
# 非 Docker：代理与面板在同一台主机
trusted_proxies = ["127.0.0.1/32", "::1/128"]
```

只有来自这些网段的 `X-Forwarded-For` 才会被信任。

::: tip Docker 部署
容器内看到的访客来源 IP 是 Docker 网桥地址，而非 `127.0.0.1`，需要把它一并加入。例如反向代理在宿主机上、面板端口通过 `-p 127.0.0.1:2206:2206` 发布时：

```toml
trusted_proxies = ["127.0.0.1/32", "::1/128", "172.17.0.1/32"]
```

`172.17.0.1` 是 Docker 默认网桥网关，可运行 `docker network inspect bridge` 查看。若反向代理本身也是容器、与面板在同一 Compose 网络，直接写该网络的子网即可，如 `trusted_proxies = ["172.20.0.0/16"]`；不要写 `0.0.0.0/0`，那等于信任所有客户端的伪造头。
:::

其他部署方式见 [Docker 部署](/guide/docker)。

## nginx

```nginx
server {
    listen 443 ssl;
    server_name nodeflare.example.com;

    ssl_certificate     /etc/letsencrypt/live/nodeflare.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nodeflare.example.com/privkey.pem;

    location / {
        # Docker 部署时改为映射到宿主机的端口，如 http://127.0.0.1:2206
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

Docker Compose 中也可让 Caddy 直接反向代理容器：

```
nodeflare.example.com {
    reverse_proxy nodeflare:2206
}
```
