// ============ MOCK DATA FOR ALL MODULES ============
import screenshotVm001 from "@/assets/screenshot-vm001.jpg";
import screenshotVm002 from "@/assets/screenshot-vm002.jpg";
import screenshotVm003 from "@/assets/screenshot-vm003.jpg";
import screenshotVm005 from "@/assets/screenshot-vm005.jpg";
import screenshotVm007 from "@/assets/screenshot-vm007.jpg";
import screenshotVm008 from "@/assets/screenshot-vm008.jpg";
// Dashboard KPIs
export const dashboardKPIs = {
  onlineDevices: 47,
  totalDevices: 60,
  activeAccounts: 156,
  totalAccounts: 200,
  todayPosts: 89,
  totalLeads: 1247,
};

export const onlineRateTrend = [
  { date: "03/11", rate: 78 },
  { date: "03/12", rate: 82 },
  { date: "03/13", rate: 75 },
  { date: "03/14", rate: 88 },
  { date: "03/15", rate: 91 },
  { date: "03/16", rate: 85 },
  { date: "03/17", rate: 87 },
];

export const accountHealth = [
  { name: "正常", value: 142, fill: "hsl(142 71% 45%)" },
  { name: "受限", value: 38, fill: "hsl(38 92% 50%)" },
  { name: "封禁", value: 20, fill: "hsl(0 72% 51%)" },
];

export const recentAlerts = [
  { id: 1, type: "error", message: "账号 @shop_global_03 被封禁", time: "10分钟前" },
  { id: 2, type: "warning", message: "IP 185.232.xx.xx 纯净度降至 72%", time: "25分钟前" },
  { id: 3, type: "warning", message: "云机 VM-028 延迟升高至 280ms", time: "1小时前" },
  { id: 4, type: "info", message: "批量发帖任务 #1042 完成（32/32）", time: "2小时前" },
  { id: 5, type: "error", message: "专线带宽使用率达 95%", time: "3小时前" },
];

// Devices
export interface BoundAccount {
  platform: "TikTok" | "Facebook" | "Instagram" | "YouTube";
  username: string;
}

export interface CloudDevice {
  id: string;
  sn: string;
  name: string;
  status: "online" | "offline" | "error";
  phoneStatus: "正常" | "离线" | "故障" | "维护中";
  ip: string;
  region: string;
  boundAccounts: BoundAccount[];
  boundDepartment?: string;
  boundEmployee?: string;
  bindTime?: string;
  expiryTime?: string;
  screenshot?: string;
}

// Department tree with employees
export interface OrgNode {
  id: string;
  name: string;
  type: "department" | "employee";
  children?: OrgNode[];
}

export const orgTree: OrgNode[] = [
  {
    id: "D-001", name: "总部", type: "department",
    children: [
      {
        id: "D-002", name: "运营部", type: "department",
        children: [
          { id: "E-001", name: "张伟", type: "employee" },
          { id: "E-002", name: "李娜", type: "employee" },
          { id: "E-003", name: "王芳", type: "employee" },
        ],
      },
      {
        id: "D-003", name: "技术部", type: "department",
        children: [
          { id: "E-004", name: "赵明", type: "employee" },
          { id: "E-005", name: "刘洋", type: "employee" },
        ],
      },
      {
        id: "D-004", name: "销售部", type: "department",
        children: [
          { id: "E-006", name: "王磊", type: "employee" },
          { id: "E-007", name: "陈静", type: "employee" },
          { id: "E-008", name: "周杰", type: "employee" },
        ],
      },
    ],
  },
];

export const cloudDevices: CloudDevice[] = [
  { id: "VM-001", sn: "SN20260301001", name: "US-West-01", status: "online", phoneStatus: "正常", ip: "192.168.1.101", region: "🇺🇸 洛杉矶", boundAccounts: [{ platform: "TikTok", username: "@fashionhub_us" }, { platform: "Facebook", username: "@fashionhub_fb" }], boundDepartment: "运营部", boundEmployee: "张伟", bindTime: "2026-01-15 08:30:00", expiryTime: "2026-07-15 23:59:59", screenshot: screenshotVm001 },
  { id: "VM-002", sn: "SN20260301002", name: "US-West-02", status: "online", phoneStatus: "正常", ip: "192.168.1.102", region: "🇺🇸 洛杉矶", boundAccounts: [{ platform: "TikTok", username: "@beauty_deals" }, { platform: "Instagram", username: "@beauty_ig" }], boundDepartment: "运营部", boundEmployee: "李娜", bindTime: "2026-02-01 10:00:00", expiryTime: "2026-08-01 23:59:59", screenshot: screenshotVm002 },
  { id: "VM-003", sn: "SN20260301003", name: "UK-London-01", status: "online", phoneStatus: "正常", ip: "10.0.2.55", region: "🇬🇧 伦敦", boundAccounts: [{ platform: "TikTok", username: "@uk_gadgets" }], boundDepartment: "运营部", boundEmployee: "王芳", bindTime: "2026-02-10 14:20:00", expiryTime: "2026-08-10 23:59:59", screenshot: screenshotVm003 },
  { id: "VM-004", sn: "SN20260301004", name: "JP-Tokyo-01", status: "offline", phoneStatus: "离线", ip: "10.0.3.12", region: "🇯🇵 东京", boundAccounts: [], bindTime: "2026-01-20 09:00:00", expiryTime: "2026-07-20 23:59:59" },
  { id: "VM-005", sn: "SN20260301005", name: "SG-01", status: "online", phoneStatus: "正常", ip: "172.16.0.88", region: "🇸🇬 新加坡", boundAccounts: [{ platform: "TikTok", username: "@sg_lifestyle" }, { platform: "YouTube", username: "@sg_life_yt" }], boundDepartment: "销售部", boundEmployee: "王磊", bindTime: "2026-03-01 11:30:00", expiryTime: "2026-09-01 23:59:59", screenshot: screenshotVm005 },
  { id: "VM-006", sn: "SN20260301006", name: "DE-Frankfurt-01", status: "error", phoneStatus: "故障", ip: "172.16.1.22", region: "🇩🇪 法兰克福", boundAccounts: [], bindTime: "2026-01-05 16:00:00", expiryTime: "2026-04-05 23:59:59" },
  { id: "VM-007", sn: "SN20260301007", name: "US-East-01", status: "online", phoneStatus: "正常", ip: "192.168.2.10", region: "🇺🇸 纽约", boundAccounts: [{ platform: "TikTok", username: "@nyc_trends" }, { platform: "Facebook", username: "@nyc_trends_fb" }, { platform: "Instagram", username: "@nyc_trends_ig" }], boundDepartment: "销售部", boundEmployee: "陈静", bindTime: "2026-02-20 08:00:00", expiryTime: "2026-08-20 23:59:59", screenshot: screenshotVm007 },
  { id: "VM-008", sn: "SN20260301008", name: "AU-Sydney-01", status: "online", phoneStatus: "维护中", ip: "10.0.4.77", region: "🇦🇺 悉尼", boundAccounts: [{ platform: "TikTok", username: "@oz_store" }], boundDepartment: "技术部", boundEmployee: "赵明", bindTime: "2026-03-10 13:45:00", expiryTime: "2026-09-10 23:59:59", screenshot: screenshotVm008 },
];

// IP Pool
export interface IPResource {
  id: string;
  address: string;
  type: "ISP住宅" | "数据中心" | "移动";
  purity: number;
  status: "空闲" | "已绑定" | "冷却中" | "禁用";
  region: string;
  boundDevice?: string;
  proxyServer?: string;
  proxyExpiry?: string;
}

export const ipResources: IPResource[] = [
  { id: "IP-001", address: "185.232.64.101", type: "ISP住宅", purity: 98, status: "已绑定", region: "🇺🇸 洛杉矶", boundDevice: "VM-001", proxyServer: "proxy-us1.seaisee.com:8080", proxyExpiry: "2026-06-15" },
  { id: "IP-002", address: "185.232.64.102", type: "ISP住宅", purity: 95, status: "已绑定", region: "🇺🇸 洛杉矶", boundDevice: "VM-002", proxyServer: "proxy-us2.seaisee.com:8080", proxyExpiry: "2026-05-20" },
  { id: "IP-003", address: "91.134.22.55", type: "ISP住宅", purity: 72, status: "冷却中", region: "🇬🇧 伦敦", proxyServer: "proxy-uk1.seaisee.com:3128", proxyExpiry: "2026-04-10" },
  { id: "IP-004", address: "103.21.88.12", type: "数据中心", purity: 88, status: "空闲", region: "🇯🇵 东京", proxyServer: "proxy-jp1.seaisee.com:1080", proxyExpiry: "2026-07-01" },
  { id: "IP-005", address: "45.77.120.88", type: "移动", purity: 99, status: "已绑定", region: "🇸🇬 新加坡", boundDevice: "VM-005", proxyServer: "proxy-sg1.seaisee.com:8080", proxyExpiry: "2026-08-30" },
  { id: "IP-006", address: "185.232.65.22", type: "ISP住宅", purity: 45, status: "禁用", region: "🇩🇪 法兰克福", proxyServer: "proxy-de1.seaisee.com:3128", proxyExpiry: "2026-03-01" },
  { id: "IP-007", address: "192.241.10.33", type: "数据中心", purity: 91, status: "已绑定", region: "🇺🇸 纽约", boundDevice: "VM-007", proxyServer: "proxy-us3.seaisee.com:1080", proxyExpiry: "2026-09-15" },
  { id: "IP-008", address: "103.86.44.77", type: "ISP住宅", purity: 96, status: "已绑定", region: "🇦🇺 悉尼", boundDevice: "VM-008", proxyServer: "proxy-au1.seaisee.com:8080", proxyExpiry: "2026-06-28" },
];

// Social accounts
export interface SocialAccount {
  id: string;
  platform: "TikTok";
  username: string;
  status: "正常" | "受限" | "封禁";
  followers: number;
  posts: number;
  device: string;
  ip: string;
  lastActive: string;
}

export const socialAccounts: SocialAccount[] = [
  { id: "ACC-001", platform: "TikTok", username: "@fashionhub_us", status: "正常", followers: 125000, posts: 342, device: "VM-001", ip: "185.232.64.101", lastActive: "2分钟前" },
  { id: "ACC-002", platform: "TikTok", username: "@beauty_deals", status: "正常", followers: 89000, posts: 218, device: "VM-002", ip: "185.232.64.102", lastActive: "15分钟前" },
  { id: "ACC-003", platform: "TikTok", username: "@uk_gadgets", status: "受限", followers: 45000, posts: 156, device: "VM-003", ip: "91.134.22.55", lastActive: "1小时前" },
  { id: "ACC-004", platform: "TikTok", username: "@sg_lifestyle", status: "正常", followers: 67000, posts: 201, device: "VM-005", ip: "45.77.120.88", lastActive: "5分钟前" },
  { id: "ACC-005", platform: "TikTok", username: "@nyc_trends", status: "正常", followers: 203000, posts: 512, device: "VM-007", ip: "192.241.10.33", lastActive: "刚刚" },
  { id: "ACC-006", platform: "TikTok", username: "@oz_store", status: "封禁", followers: 31000, posts: 98, device: "VM-008", ip: "103.86.44.77", lastActive: "3天前" },
];

// Nurture tasks
export interface NurtureTask {
  id: string;
  name: string;
  account: string;
  status: "进行中" | "已完成" | "待执行" | "失败";
  progress: number;
  actions: string;
  startTime: string;
}

export const nurtureTasks: NurtureTask[] = [
  { id: "NT-001", name: "新号养成 - 美国区", account: "@fashionhub_us", status: "进行中", progress: 65, actions: "浏览/点赞/评论", startTime: "2026-03-15 08:00" },
  { id: "NT-002", name: "互动增长计划", account: "@beauty_deals", status: "进行中", progress: 42, actions: "关注/互动/发视频", startTime: "2026-03-16 10:00" },
  { id: "NT-003", name: "英国市场预热", account: "@uk_gadgets", status: "待执行", progress: 0, actions: "浏览/搜索/点赞", startTime: "2026-03-18 09:00" },
  { id: "NT-004", name: "纽约账号维护", account: "@nyc_trends", status: "已完成", progress: 100, actions: "全流程养号", startTime: "2026-03-10 08:00" },
  { id: "NT-005", name: "澳洲号重新激活", account: "@oz_store", status: "失败", progress: 12, actions: "重登录/浏览", startTime: "2026-03-14 14:00" },
];

// Content views trend
export const viewsTrend = [
  { date: "03/11", views: 12400, likes: 890, shares: 120 },
  { date: "03/12", views: 18600, likes: 1200, shares: 180 },
  { date: "03/13", views: 15200, likes: 1050, shares: 145 },
  { date: "03/14", views: 22100, likes: 1800, shares: 260 },
  { date: "03/15", views: 28500, likes: 2100, shares: 340 },
  { date: "03/16", views: 19800, likes: 1400, shares: 195 },
  { date: "03/17", views: 24300, likes: 1750, shares: 280 },
];

// CRM Leads
export interface Lead {
  id: string;
  name: string;
  company: string;
  source: string;
  stage: "新线索" | "跟进中" | "意向客户" | "已成交";
  value: number;
  assignee: string;
  lastContact: string;
}

export const leads: Lead[] = [
  { id: "LD-001", name: "John Smith", company: "GlobalTech Inc", source: "TikTok评论", stage: "跟进中", value: 15000, assignee: "张伟", lastContact: "今天" },
  { id: "LD-002", name: "Emma Wilson", company: "FashionCo", source: "私信", stage: "意向客户", value: 28000, assignee: "李娜", lastContact: "昨天" },
  { id: "LD-003", name: "David Chen", company: "TechMart", source: "海关数据", stage: "新线索", value: 0, assignee: "", lastContact: "" },
  { id: "LD-004", name: "Sarah Johnson", company: "BeautyWorld", source: "TikTok评论", stage: "已成交", value: 42000, assignee: "王磊", lastContact: "3天前" },
  { id: "LD-005", name: "Michael Brown", company: "HomeGoods Ltd", source: "私信", stage: "新线索", value: 0, assignee: "", lastContact: "" },
  { id: "LD-006", name: "Lisa Wang", company: "SmartElec", source: "海关数据", stage: "跟进中", value: 8000, assignee: "张伟", lastContact: "今天" },
];

// Billing
export const billingData = [
  { service: "云机算力", points: 12400, cost: "¥2,480" },
  { service: "IP代理", points: 8600, cost: "¥1,720" },
  { service: "专线带宽", points: 5200, cost: "¥1,040" },
  { service: "AI视频", points: 3800, cost: "¥760" },
  { service: "RPA任务", points: 2100, cost: "¥420" },
];

export const billingTrend = [
  { date: "03/11", points: 4200 },
  { date: "03/12", points: 4800 },
  { date: "03/13", points: 3900 },
  { date: "03/14", points: 5100 },
  { date: "03/15", points: 5600 },
  { date: "03/16", points: 4300 },
  { date: "03/17", points: 4200 },
];

// Audit logs
export const auditLogs = [
  { id: 1, user: "admin@company.com", action: "创建云机", target: "VM-008", time: "2026-03-17 14:32", ip: "10.0.0.1" },
  { id: 2, user: "zhangwei@company.com", action: "绑定IP", target: "IP-008 → VM-008", time: "2026-03-17 14:35", ip: "10.0.0.2" },
  { id: 3, user: "lina@company.com", action: "批量发帖", target: "任务 #1042", time: "2026-03-17 12:00", ip: "10.0.0.3" },
  { id: 4, user: "admin@company.com", action: "切换专线", target: "VM-002", time: "2026-03-17 10:15", ip: "10.0.0.1" },
  { id: 5, user: "wanglei@company.com", action: "领取线索", target: "LD-003", time: "2026-03-17 09:45", ip: "10.0.0.4" },
];

// Org structure
export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  memberCount: number;
  children?: Department[];
}

export const departments: Department[] = [
  {
    id: "D-001", name: "总部", parentId: null, memberCount: 5,
    children: [
      { id: "D-002", name: "运营部", parentId: "D-001", memberCount: 12 },
      { id: "D-003", name: "技术部", parentId: "D-001", memberCount: 8 },
      { id: "D-004", name: "销售部", parentId: "D-001", memberCount: 15 },
    ],
  },
];

export const roles = [
  { id: "R-001", name: "超级管理员", description: "全部权限", members: 2 },
  { id: "R-002", name: "运营经理", description: "运营模块全部权限", members: 4 },
  { id: "R-003", name: "运营专员", description: "账号管理、发帖权限", members: 8 },
  { id: "R-004", name: "销售", description: "CRM模块权限", members: 6 },
  { id: "R-005", name: "只读", description: "仅查看权限", members: 3 },
];

// Assets / content
export interface ContentAsset {
  id: string;
  name: string;
  type: "视频" | "图片" | "音频";
  size: string;
  tags: string[];
  uploadTime: string;
}

export const contentAssets: ContentAsset[] = [
  { id: "A-001", name: "产品展示_v1.mp4", type: "视频", size: "24.5 MB", tags: ["产品", "展示"], uploadTime: "2026-03-17" },
  { id: "A-002", name: "开箱视频_02.mp4", type: "视频", size: "18.2 MB", tags: ["开箱", "测评"], uploadTime: "2026-03-16" },
  { id: "A-003", name: "banner_spring.jpg", type: "图片", size: "2.1 MB", tags: ["横幅", "春季"], uploadTime: "2026-03-15" },
  { id: "A-004", name: "bgm_upbeat.mp3", type: "音频", size: "3.8 MB", tags: ["背景音乐"], uploadTime: "2026-03-14" },
  { id: "A-005", name: "产品特写_03.mp4", type: "视频", size: "32.1 MB", tags: ["产品", "特写"], uploadTime: "2026-03-13" },
  { id: "A-006", name: "lifestyle_shot.jpg", type: "图片", size: "4.5 MB", tags: ["生活方式"], uploadTime: "2026-03-12" },
];
