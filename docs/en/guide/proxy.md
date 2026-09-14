# Reverse Proxy

The server listens on `127.0.0.1:2206` by default; use an HTTPS reverse proxy for external access.

## Trusted Proxies

Add the reverse proxy's address to `trusted_proxies`, otherwise every visitor is counted as the same IP and session cookies won't get the `Secure` flag:

```toml
# Non-Docker: proxy and panel on the same host
trusted_proxies = ["127.0.0.1/32", "::1/128"]
```

Only `X-Forwarded-For` headers from these ranges are trusted.

::: tip Docker deployments
Inside the container the peer IP is the Docker bridge address, not `127.0.0.1`, so add it as well. For example, with a reverse proxy on the host and the port published as `-p 127.0.0.1:2206:2206`:

```toml
trusted_proxies = ["127.0.0.1/32", "::1/128", "172.17.0.1/32"]
```

`172.17.0.1` is the default Docker bridge gateway — check it with `docker network inspect bridge`. If the reverse proxy is itself a container on the same Compose network, just list that subnet, e.g. `trusted_proxies = ["172.20.0.0/16"]`; never use `0.0.0.0/0`, which trusts forged headers from every client.
:::

## nginx

```nginx
server {
    listen 443 ssl;
    server_name nodeflare.example.com;

    ssl_certificate     /etc/letsencrypt/live/nodeflare.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nodeflare.example.com/privkey.pem;

    location / {
        # For Docker, use the port published on the host, e.g. http://127.0.0.1:2206
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

In Docker Compose, Caddy can proxy the container directly:

```
nodeflare.example.com {
    reverse_proxy nodeflare:2206
}
```
