# 常见问题

## 服务启动失败？

先看日志（位置见[默认目录与日志](/guide/platforms#日志位置)），多为端口被占用或数据库连接串有误。

## 面板监听哪个端口？

查看配置文件中的 `bind_addr`，默认 `127.0.0.1:2206`，见[配置](/guide/config)。

## Agent 需要开放入站端口吗？

不需要。Agent 主动出站连接服务端，见[安装 Agent](/guide/agent)。

## Agent 显示离线？

- 确认 Agent 能出站访问面板地址：`curl -I https://你的面板地址`；
- 核对 Agent Token；
- 上报与延迟依赖时钟校准，系统时间偏差过大会有影响。

## 公开看板看不到节点？

确认节点未启用「隐藏」，且站点设置中已开启「公开仪表盘」。

## 如何对外访问面板？

脚本安装默认监听 `127.0.0.1`，Docker 容器内需监听 `0.0.0.0:2206`。对外访问时使用 HTTPS 反向代理，并把代理地址加入 `trusted_proxies`，见[反向代理](/guide/proxy)。

## Docker 部署如何查看日志、升级与卸载？

日志：`docker logs -f nodeflare`；升级：`docker compose pull && docker compose up -d`（或 `docker pull` 后重建容器）；卸载：`docker compose down` / `docker rm -f nodeflare`。配置与数据保存在宿主机挂载目录（示例为 `/etc/nodeflare`），更新时沿用原目录，见 [Docker 部署](/guide/docker)。

## Docker 容器启动后立刻退出？

先用 `docker logs nodeflare` 查看错误。常见原因是挂载目录缺少 `config.toml`，或容器用户 `10001:10001` 无法读写目录及配置文件。按 [Docker 部署](/guide/docker#准备配置) 准备配置并设置权限；若使用自定义挂载目录，请替换为实际路径。

## 导出备份报超限？

先缩短历史保留天数或清理历史数据，再重新导出，见[数据库与备份](/guide/database)。

## 面板显示的内存占用很高？

Linux 下文件缓存不计入已用内存、共享内存计入；面板显示整机内存，而非 NodeFlare 进程占用，口径见[监控口径与采样](/guide/monitoring)。

## 如何卸载？

服务端用安装脚本 `--uninstall`（保留数据）或 `--uninstall --purge`（删除数据），Agent 加 `--uninstall` 参数，详见[卸载](/guide/uninstall)。Docker 部署见 [Docker 部署](/guide/docker)。

## 远程执行为什么需要 TOTP？

远程执行属高危操作，必须先启用 TOTP 两步验证；单条命令最长执行 10 分钟，离开页面不会中断。
