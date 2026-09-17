import type { AdminServer, Config, ExchangeRates, HistoryPoint, LatencySample, LatencyTestPoint, Server } from "./types";

export const demoConfig: Config = {
  site_name: "NodeFlare",
  site_description: "边缘节点与核心服务运行状态",
  site_announcement: "",
  logo_url: "",
  locale: "zh-CN",
  public_dashboard: true,
  offline_threshold_seconds: 180,
  history_retention_days: 30,
  default_theme: "system",
  active_theme_id: "builtin-nodeflare-glass",
  background_url: "",
  theme_options: {},
  show_search: true,
  show_groups: true,
  show_stats: true,
  show_assets: true,
  show_traffic: true,
  show_speed: true,
  show_price: true,
  show_expiry: true,
  show_latency: true,
  show_uptime: true,
  turnstile_enabled: false,
  turnstile_login_enabled: false,
  totp_login_enabled: false,
  turnstile_site_key: "",
  password_client_salt: "nodeflare-demo-password-kdf",
};

export const demoExchangeRates: ExchangeRates = {
  base: "CNY",
  rates: {
    CNY: 1,
    USD: 0.139,
    CAD: 0.2086,
    EUR: 0.119,
    GBP: 0.103,
    JPY: 21.1,
    HKD: 1.09,
    RUB: 11.560694,
    CHF: 0.120661,
    INR: 14.248668,
    VND: 3875.968992,
    THB: 4.97107,
  },
  source: "demo",
  date: new Date().toISOString().slice(0, 10),
  fetched_at: Math.floor(Date.now() / 1000),
  stale: false,
};

const now = Math.floor(Date.now() / 1000);

export const demoLatencyTasks: LatencyTestPoint[] = [
  { id: "demo-hk", name: "香港 TCP", task_type: "tcp", target: "hk.example.com", port: 443, interval_seconds: 60 },
  { id: "demo-tokyo", name: "东京 ICMP", task_type: "icmp", target: "tokyo.example.com", port: null, interval_seconds: 60 },
  { id: "demo-sg", name: "新加坡 TCP", task_type: "tcp", target: "sg.example.com", port: 443, interval_seconds: 60 },
];

function demoLatestLatency(serverId: string): LatencySample[] {
  return demoLatencyTasks.map((task, index) => ({
    task_id: task.id,
    server_id: serverId,
    name: task.name,
    task_type: task.task_type,
    target: task.target,
    port: task.port,
    timestamp: now - 12,
    latency_ms: 38 + index * 7,
    packet_loss: index === 1 ? 0.4 : 0,
  }));
}

const baseServer: Server = {
  id: "",
  name: "",
  region: "",
  group_name: "默认",
  tags: "",
  expires_at: null,
  traffic_limit: 0,
  traffic_limit_type: "sum",
  price: 0,
  billing_cycle: 30,
  currency: "CNY",
  auto_renewal: false,
  reset_day: 1,
  timestamp: now - 12,
  cpu: 24,
  load1: 0.42,
  load5: 0.35,
  load15: 0.27,
  mem_used: 3.36 * 1024 ** 3,
  mem_total: 8 * 1024 ** 3,
  swap_used: 0,
  swap_total: 2 * 1024 ** 3,
  disk_used: 49.6 * 1024 ** 3,
  disk_total: 160 * 1024 ** 3,
  net_in: 5.8 * 1024 ** 2,
  net_out: 1.2 * 1024 ** 2,
  net_rx_total: 640 * 1024 ** 3,
  net_tx_total: 220 * 1024 ** 3,
  uptime: 182 * 86400,
  processes: 126,
  tcp_connections: 342,
  udp_connections: 18,
  cpu_cores: 4,
  cpu_model: "AMD EPYC 7B13",
  os: "Debian GNU/Linux 12",
  kernel: "6.1.0",
  arch: "x86_64",
  virtualization: "KVM",
  gpu_usage: 0,
  gpu_model: "",
  agent_version: "1.0.0",
  disk_read_bps: 6.4 * 1024 ** 2,
  disk_write_bps: 2.1 * 1024 ** 2,
  disk_read_iops: 128,
  disk_write_iops: 46,
  disk_await_ms: 1.2,
  disk_utilization: 8.4,
  disks: [],
  gpus: [],
  latency: [],
};

function node(input: Partial<Server> & Pick<Server, "id" | "name">): Server {
  const server = { ...baseServer, ...input };
  server.latency = input.latency ?? demoLatestLatency(server.id);
  return server;
}

export const demoServers: Server[] = [
  node({ id: "hongkong-edge", name: "香港 Edge 01", region: "HK", group_name: "边缘网络", tags: "主力,线路:BGP,用途:网站", price: 128, expires_at: now + 46 * 86400, traffic_limit: 2 * 1024 ** 4 }),
  node({ id: "tokyo-core", name: "东京 Core", region: "JP", group_name: "核心服务", tags: "主力,线路:Premium", price: 9.9, currency: "USD", expires_at: now + 46 * 86400, mem_total: 16 * 1024 ** 3, mem_used: 6.72 * 1024 ** 3, disk_total: 224 * 1024 ** 3, disk_used: 69.44 * 1024 ** 3, traffic_limit: 2 * 1024 ** 4, net_rx_total: 810 * 1024 ** 3, net_tx_total: 310 * 1024 ** 3, cpu: 31 }),
  node({ id: "singapore-data", name: "新加坡 Data", region: "SG", group_name: "数据服务", tags: "数据库,NVMe", price: 88, expires_at: now + 46 * 86400, mem_total: 24 * 1024 ** 3, mem_used: 10.08 * 1024 ** 3, disk_total: 288 * 1024 ** 3, disk_used: 89.28 * 1024 ** 3, traffic_limit: 2 * 1024 ** 4, net_rx_total: 980 * 1024 ** 3, net_tx_total: 400 * 1024 ** 3, cpu: 38 }),
  node({ id: "los-angeles-west", name: "洛杉矶 West", region: "US", group_name: "边缘网络", tags: "备用,线路:CN2", price: 24, currency: "USD", expires_at: now + 46 * 86400, disk_total: 352 * 1024 ** 3, disk_used: 109.12 * 1024 ** 3, traffic_limit: 2 * 1024 ** 4, net_rx_total: 1.12 * 1024 ** 4, net_tx_total: 490 * 1024 ** 3, cpu: 45 }),
  node({ id: "frankfurt-lab", name: "法兰克福 Lab", region: "DE", group_name: "实验服务", tags: "Lab,IPv6", price: 0, expires_at: null, mem_total: 16 * 1024 ** 3, mem_used: 6.72 * 1024 ** 3, cpu: 52, uptime: 134 * 86400 }),
  node({ id: "taipei-homelab", name: "台北 HomeLab", region: "TW", group_name: "家庭网络", tags: "HomeLab,自建", price: 0, expires_at: null, mem_total: 24 * 1024 ** 3, mem_used: 10.08 * 1024 ** 3, cpu: 59, uptime: 122 * 86400 }),
  node({ id: "london-archive", name: "伦敦 Archive", region: "GB", group_name: "存储服务", tags: "Archive,HDD", price: 18, currency: "EUR", billing_cycle: 365, expires_at: now + 110 * 86400, disk_total: 4 * 1024 ** 4, disk_used: 2.7 * 1024 ** 4, cpu: 66, latency: [] }),
  node({ id: "toronto-standby", name: "多伦多 Standby", region: "CA", group_name: "备用节点", tags: "Standby", price: 16, currency: "CAD", expires_at: now + 18 * 86400, timestamp: now - 640, cpu: 0, net_in: 0, net_out: 0 }),
];

export const DEMO_REFRESH_INTERVAL_MS = 1_000;
// A prime cycle keeps whole-minute history steps off the same waveform phase,
// so sampled history does not flatten into a repeating pattern.
export const DEMO_CYCLE_SECONDS = 97;

function sampleServer(server: Server, at: number): Server {
  const elapsed = Math.max(0, at - now);
  const online = server.id !== "toronto-standby";
  // A shared, time-based waveform keeps cards and history in sync. Values loop,
  // while timestamps, uptime and traffic counters continue moving forward.
  const seed = [...server.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const phase = ((at % DEMO_CYCLE_SECONDS) / DEMO_CYCLE_SECONDS) * Math.PI * 2 + seed;
  const wave = Math.sin(phase);
  const pulse = Math.cos(phase * 2);
  return {
    ...server,
    timestamp: online ? at : at - 640,
    cpu: online ? Math.round(Math.max(2, Math.min(96, (server.cpu ?? 24) + wave * 15 + pulse * 4))) : 0,
    load1: Math.max(0.01, (server.load1 ?? 0.4) + wave * 0.25),
    load5: Math.max(0.01, (server.load5 ?? 0.35) + wave * 0.15),
    load15: Math.max(0.01, (server.load15 ?? 0.27) + pulse * 0.1),
    mem_used: Math.round((server.mem_used ?? 0) * (1 + wave * 0.12)),
    disk_used: Math.round((server.disk_used ?? 0) * (1 + pulse * 0.004)),
    net_in: online ? Math.round((server.net_in ?? 0) * (1 + wave * 0.65)) : 0,
    net_out: online ? Math.round((server.net_out ?? 0) * (1 + pulse * 0.55)) : 0,
    net_rx_total: (server.net_rx_total ?? 0) + Math.round(elapsed * (server.net_in ?? 0)),
    net_tx_total: (server.net_tx_total ?? 0) + Math.round(elapsed * (server.net_out ?? 0)),
    uptime: (server.uptime ?? 0) + (online ? elapsed : 0),
    processes: Math.round((server.processes ?? 126) + wave * 8),
    tcp_connections: Math.round((server.tcp_connections ?? 342) + pulse * 35),
    disk_read_bps: Math.round((server.disk_read_bps ?? 0) * (1 + wave * 0.4)),
    disk_write_bps: Math.round((server.disk_write_bps ?? 0) * (1 + pulse * 0.4)),
    latency: server.latency.map((point, index) => ({
      ...point,
      timestamp: online ? at : at - 640,
      latency_ms: Math.round((38 + index * 7 + Math.sin(phase + index) * 6) * 10) / 10,
      packet_loss: index === 1 ? Math.round((0.5 + wave * 0.4) * 10) / 10 : 0,
    })),
  };
}

export function demoServersAt(at = Math.floor(Date.now() / 1000)): Server[] {
  return demoServers.map((server) => sampleServer(server, at));
}

// 演示后台展示的节点字段：公网 IP、网卡、上报间隔等在真实部署里由 Agent 上报，
// 演示环境用固定值补齐，保证后台表单有完整的可读字段。
export function demoAdminServer(server: Server, index: number): AdminServer {
  return {
    ...server,
    hidden: false,
    last_ip: `192.0.2.${index + 10}`,
    ip_v4: `192.0.2.${index + 10}`,
    ip_v6: `2001:db8::${index + 10}`,
    network_interface: "eth0",
    report_interval: 60,
    collect_interval: 3,
    rx_correction: 0,
    tx_correction: 0,
    agent_mirror: "",
    offline_notify_disabled: false,
    auto_update: true,
  };
}

// “添加节点”弹窗在演示模式下的样例：不在监控列表中，只用于展示配置表单和实时数值。
const draftServer: Server = {
  ...baseServer,
  id: "seoul-edge-02",
  name: "首尔 Edge 02",
  region: "KR",
  group_name: "边缘网络",
  tags: "备用,线路:BGP",
  price: 96,
  expires_at: now + 30 * 86400,
  traffic_limit: 2 * 1024 ** 4,
  net_rx_total: 320 * 1024 ** 3,
  net_tx_total: 96 * 1024 ** 3,
  cpu: 28,
  latency: demoLatestLatency("seoul-edge-02"),
};

export function demoDraftServer(at = Math.floor(Date.now() / 1000)): AdminServer {
  return demoAdminServer(sampleServer(draftServer, at), 14);
}

export function demoHistory(serverId: string, hours: number, at = Math.floor(Date.now() / 1000)): HistoryPoint[] {
  const count = Math.min(180, Math.max(30, hours * 6));
  const step = Math.max(60, Math.floor((hours * 3600) / count));
  const server = demoServers.find((server) => server.id === serverId);
  if (!server) return [];
  return Array.from({ length: count }, (_, index) => {
    const timestamp = at - (count - index - 1) * step;
    const sampled = sampleServer(server, timestamp);
    return {
      timestamp,
      cpu: sampled.cpu ?? 0,
      load1: sampled.load1 ?? 0, load5: sampled.load5 ?? 0, load15: sampled.load15 ?? 0,
      mem_used: sampled.mem_used ?? 0, mem_total: sampled.mem_total ?? 0,
      swap_used: sampled.swap_used ?? 0, swap_total: sampled.swap_total ?? 0,
      disk_used: sampled.disk_used ?? 0, disk_total: sampled.disk_total ?? 0,
      net_in: sampled.net_in ?? 0, net_out: sampled.net_out ?? 0,
      net_rx_total: sampled.net_rx_total ?? 0, net_tx_total: sampled.net_tx_total ?? 0,
      processes: sampled.processes ?? 0, tcp_connections: sampled.tcp_connections ?? 0,
      udp_connections: sampled.udp_connections ?? 0, gpu_usage: sampled.gpu_usage ?? 0,
      disk_read_bps: sampled.disk_read_bps ?? 0, disk_write_bps: sampled.disk_write_bps ?? 0,
      disk_read_iops: sampled.disk_read_iops ?? 0, disk_write_iops: sampled.disk_write_iops ?? 0,
      disk_await_ms: sampled.disk_await_ms ?? 0, disk_utilization: sampled.disk_utilization ?? 0,
    };
  });
}

export function demoLatencyHistory(serverId: string, hours: number, at = Math.floor(Date.now() / 1000)): LatencySample[] {
  const count = Math.min(180, Math.max(30, hours * 6));
  const step = Math.max(60, Math.floor((hours * 3600) / count));
  const server = demoServers.find((server) => server.id === serverId);
  if (!server) return [];
  return Array.from({ length: count }, (_, index) =>
    sampleServer(server, at - (count - index - 1) * step).latency,
  ).flat();
}
