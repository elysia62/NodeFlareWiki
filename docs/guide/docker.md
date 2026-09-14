# Docker 部署

NodeFlare 提供官方镜像 `gxmandppx/nodeflare`（[Docker Hub](https://hub.docker.com/r/gxmandppx/nodeflare)），x64 与 ARM64 服务器均可直接使用。配置与数据保存在容器内的 `/etc/nodeflare`，挂载到宿主机目录（下文以 `./data` 为例）即可持久化。

## 首次部署

### 准备配置

容器启动时读取 `/etc/nodeflare/config.toml`，需先创建该文件，否则容器会启动失败：

```bash
mkdir -p data
curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/docker/config.example.toml -o data/config.toml
```

编辑 `data/config.toml`，至少填好管理员账号密码：

```toml
admin_username = "admin"
# 8-128 个字符，仅首次初始化数据库需要，成功后自动清除
admin_password = "换成你的强密码"
```

其余保持默认，其中 `bind_addr = "0.0.0.0:2206"` 是容器内的监听地址，**不要改成 `127.0.0.1`**，否则端口映射后无法访问。

::: tip
镜像以 UID `10001` 运行，挂载目录需归该用户所有，否则容器无法写入配置与数据库：

```bash
sudo chown -R 10001:10001 data
```

SELinux 系统（Fedora / RHEL 等）若报权限错误，在挂载路径后加 `:Z`，如 `-v "$PWD/data:/etc/nodeflare:Z"`。
:::

### 启动容器

Docker：

```bash
docker run -d --name nodeflare \
  --restart unless-stopped \
  -p 2206:2206 \
  -v "$PWD/data:/etc/nodeflare" \
  gxmandppx/nodeflare:latest
```

Docker Compose（将以下内容保存为 `compose.yaml`，与 `data/` 放在同一目录）：

```yaml
services:
  nodeflare:
    image: gxmandppx/nodeflare:latest
    container_name: nodeflare
    restart: unless-stopped
    ports:
      - "2206:2206"
    volumes:
      - ./data:/etc/nodeflare
```

```bash
docker compose up -d
```

### 访问面板

浏览器打开 `http://服务器IP:2206/admin/login`，用配置文件中的管理员账号登录。

在后台「服务器」页面创建节点、执行弹窗中的命令即可安装 Agent，见[安装 Agent](/guide/agent)。

::: warning
面板自身不提供 HTTPS，登录信息以明文传输。需要对外网提供服务时，建议只把端口发布到本机（把上面的 `-p 2206:2206` 改为 `-p 127.0.0.1:2206:2206`）并通过 HTTPS 反向代理访问，见[反向代理](/guide/proxy)。
:::

## 更新

```bash
docker compose pull && docker compose up -d
```

使用 `docker run` 时，拉取新镜像后重建容器即可：

```bash
docker pull gxmandppx/nodeflare:latest
docker rm -f nodeflare
# 重新执行首次部署中的 docker run 命令
```

`data/` 中的配置、数据库、主题与备份都不会丢失；升级前建议先在后台「数据库」页面导出一次备份，见[数据库与备份](/guide/database)。

默认使用 `latest` 标签，需固定版本时换成具体版本号即可，如 `gxmandppx/nodeflare:1.0.0`。

## 日志与卸载

```bash
docker logs -f nodeflare      # 查看运行日志
docker compose down           # 停止并删除容器（Compose）
docker rm -f nodeflare        # 停止并删除容器（docker run）
```

卸载后 `data/` 目录仍保留在宿主机，确认不再需要时手动删除：

```bash
rm -rf data
```

::: warning
`data/` 内含 SQLite 数据库、主题与备份，删除前请先在后台「数据库」页面导出备份，见[数据库与备份](/guide/database)。
:::
