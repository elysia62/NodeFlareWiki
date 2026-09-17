# Docker 部署

NodeFlare 提供官方镜像 `gxmandppx/nodeflare`（[Docker Hub](https://hub.docker.com/r/gxmandppx/nodeflare)），支持 amd64 / arm64。以下示例使用 Linux 宿主机，将 `/etc/nodeflare` 挂载到容器内的同一路径，持久保存配置与本地数据。

## 首次部署

### 准备配置

首次部署时，先在宿主机创建 `/etc/nodeflare`，下载配置示例并保存为 `config.toml`。容器启动时会读取该文件：

```bash
sudo mkdir -p /etc/nodeflare
sudo curl -fsSL https://raw.githubusercontent.com/elysia62/NodeFlare/main/docker/config.example.toml -o /etc/nodeflare/config.toml
```

使用管理员权限编辑 `/etc/nodeflare/config.toml`，至少填好管理员账号密码：

```toml
admin_username = "admin"
# 8-128 个字符，仅首次初始化数据库需要，成功后自动清除
admin_password = "换成你的强密码"
```

其余保持默认，其中 `bind_addr = "0.0.0.0:2206"` 是容器内的监听地址，**不要改成 `127.0.0.1`**，否则端口映射后无法访问。

::: tip 目录权限
编辑完成后，将目录及配置文件的所有者设为容器用户 `10001:10001`：

```bash
sudo chown -R 10001:10001 /etc/nodeflare
```

挂载目录沿用宿主机权限，使用 `/etc/nodeflare` 也需要这一步。目录和配置文件都需可写，以便保存数据库、清除初始化密码和更新数据库连接串。

SELinux 系统（Fedora / RHEL 等）若报权限错误，在挂载路径后加 `:Z`，如 `-v /etc/nodeflare:/etc/nodeflare:Z`；Compose 的挂载路径同样适用。
:::

### 启动容器

Docker：

```bash
docker run -d --name nodeflare \
  --restart unless-stopped \
  -p 2206:2206 \
  -v /etc/nodeflare:/etc/nodeflare \
  gxmandppx/nodeflare:latest
```

Docker Compose（在工作目录中新建 `compose.yaml`，写入以下内容）：

```yaml
services:
  nodeflare:
    image: gxmandppx/nodeflare:latest
    container_name: nodeflare
    restart: unless-stopped
    ports:
      - "2206:2206"
    volumes:
      - /etc/nodeflare:/etc/nodeflare
```

在 `compose.yaml` 所在目录运行：

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

升级前建议先在后台「数据库」页面导出 ZIP 备份并保存到本地，见[数据库与备份](/guide/database)。重建容器时继续使用原有挂载目录；已有部署若使用 `./data` 或其他目录，保留原路径即可，无需迁移到 `/etc/nodeflare`。

Docker Compose（在原 `compose.yaml` 所在目录执行）：

```bash
docker compose pull && docker compose up -d
```

使用 `docker run` 时，拉取新镜像后重建容器即可：

```bash
docker pull gxmandppx/nodeflare:latest
docker stop nodeflare
docker rm nodeflare
# 使用原有端口、挂载目录等参数重新执行 docker run
```

宿主机挂载目录中的配置、默认 SQLite 数据库和主题会保留。更新时继续使用现有 `config.toml`；后台导出的 ZIP 备份由浏览器下载，不会自动保存在该目录中。

默认使用 `latest` 标签。需固定版本时，将 `latest` 替换为 Docker Hub 上已发布的版本标签，版本号不带 `v`；升级时先修改镜像标签，再拉取并重建容器。

## 日志与卸载

```bash
docker logs -f nodeflare
```

需要备份时，先在容器运行期间从后台「数据库」页面导出并保存到本地，见[数据库与备份](/guide/database)。随后按部署方式选择一条命令停止并删除容器：

```bash
docker compose down       # Compose 部署
docker rm -f nodeflare    # docker run 部署
```

卸载后宿主机的 `/etc/nodeflare` 目录仍会保留。使用其他挂载目录时，以实际路径为准。

::: warning
该目录包含配置、默认 SQLite 数据库和主题；同机安装 Agent 时还可能包含 `agent/`。删除前请确认备份已保存，目录中的文件也都不再需要。
:::

确认后再手动删除数据目录：

```bash
sudo rm -rf /etc/nodeflare
```
