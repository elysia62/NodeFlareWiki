# Reverse Proxy

The server listens on `127.0.0.1:2206` by default; use an HTTPS reverse proxy for external access.

## Trusted Proxies

Add the reverse proxy's address to `trusted_proxies`, otherwise every visitor is counted as the same IP and session cookies won't get the `Secure` flag:

```toml
trusted_proxies = ["127.0.0.1/32", "::1/128"]
```

Only `X-Forwarded-For` headers from these ranges are trusted.

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
        proxy_set_header Upgrade $http_upgrade;   # WebSocket real-time data
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

::: tip
The `Upgrade` / `Connection` lines carry the WebSocket traffic; without them the dashboard won't update in real time.
:::

## Caddy

```
nodeflare.example.com {
    reverse_proxy 127.0.0.1:2206
}
```
