# 常见问题

## 服务启动失败怎么办？

先看日志（位置见[默认目录与日志](/guide/platforms#日志位置)），多为端口被占用或数据库连接串有误。

## 不确定面板监听端口？

查看配置文件中的 `bind_addr`，默认 `127.0.0.1:2206`，见[配置](/guide/config)。

## Agent 需要开放入站端口吗？

不需要。Agent 主动出站连接服务端，无需开放入站端口，见[安装 Agent](/guide/agent)。

## Agent 显示离线？

- 确认 Agent 能出站访问面板地址：`curl -I https://你的面板地址`；
- 核对 Agent Token 是否正确；
- 上报与延迟依赖时钟校准，系统时间偏差过大会有影响。

## 公开看板看不到节点？

确认节点未启用「隐藏」，且站点设置中已开启「公开仪表盘」。

## 如何对外访问面板？

服务端默认只监听 `127.0.0.1`，需经 HTTPS 反向代理，并把代理地址加入 `trusted_proxies`，见[反向代理](/guide/proxy)。Docker 部署时要注意容器看到的来源 IP 是 Docker 网关地址，配置方式见[反向代理](/guide/proxy#可信代理)。

## Docker 部署怎么看日志 / 怎么升级？

日志用 `docker logs -f nodeflare`，升级用 `docker compose pull && docker compose up -d`（或 `docker pull` 后重建容器），数据保留在挂载的 `./data`，见 [Docker 部署](/guide/docker#更新)。

## Docker 容器启动后立刻退出？

多半是挂载目录里没有 `config.toml`，或目录属主不是 UID `10001` 导致无法写入。按 [Docker 部署](/guide/docker#1-准备配置) 先准备配置，并执行 `sudo chown -R 10001:10001 data`。

## 导出备份报超限？

先缩短历史保留天数或清理历史数据，再重新导出，见[数据库与备份](/guide/database)。

## 面板显示的内存占用很高？

Linux 下文件缓存不计入已用内存、共享内存计入，面板显示的是整机内存，不是 NodeFlare 进程本身的占用，口径见[监控口径与采样](/guide/monitoring)。

## 如何卸载？

服务端用安装脚本 `--uninstall`（保留数据）或 `--uninstall --purge`（删除数据）卸载，Agent 加 `--uninstall` 参数卸载，详见[卸载](/guide/uninstall)。Docker 部署用 `docker compose down` 或 `docker rm -f nodeflare`，见 [Docker 部署](/guide/docker#日志与卸载)。

## 远程执行命令为什么需要 TOTP？

远程执行属高危操作，必须先启用 TOTP 两步验证；单条命令最长执行 10 分钟，离开页面不会中断。
