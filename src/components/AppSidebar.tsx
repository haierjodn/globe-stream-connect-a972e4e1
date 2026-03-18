import {
  LayoutDashboard, Server, Globe, Wifi,
  Users, Shield, Settings, Building2, UserCheck,
  UserCircle, ListChecks, Send, BarChart3,
  Video, FileText, Scissors,
  Target, Database, Inbox,
  CreditCard, Activity, ScrollText, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "概览",
    items: [
      { title: "仪表盘", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "设备与网络",
    items: [
      { title: "云机管理", url: "/devices", icon: Server },
      { title: "IP资源池", url: "/ip-pool", icon: Globe },
      { title: "带宽管理", url: "/bandwidth", icon: Wifi },
    ],
  },
  {
    label: "社媒运营",
    items: [
      { title: "账号管理", url: "/accounts", icon: UserCircle },
      { title: "养号任务", url: "/nurture", icon: ListChecks },
      { title: "批量发帖", url: "/posting", icon: Send },
      { title: "数据看板", url: "/analytics", icon: BarChart3 },
    ],
  },
  // {
  //   label: "AI视频创作",
  //   items: [
  //     { title: "素材中心", url: "/assets", icon: Video },
  //     { title: "AI脚本", url: "/ai-script", icon: FileText },
  //     { title: "智能剪辑", url: "/editing", icon: Scissors },
  //   ],
  // },
  // {
  //   label: "获客CRM",
  //   items: [
  //     { title: "线索管理", url: "/leads", icon: Target },
  //     { title: "海关数据", url: "/customs", icon: Database },
  //     { title: "公海池", url: "/pool", icon: Inbox },
  //   ],
  // },
  // {
  //   label: "租户管理",
  //   items: [
  //     { title: "组织架构", url: "/org", icon: Users },
  //     { title: "角色权限", url: "/roles", icon: Shield },
  //     { title: "租户配置", url: "/tenant-config", icon: Settings },
  //   ],
  // },
  {
    label: "系统管理",
    items: [
      { title: "部门管理", url: "/system/departments", icon: Building2 },
      { title: "角色管理", url: "/system/roles", icon: Shield },
      { title: "用户管理", url: "/system/users", icon: UserCheck },
    ],
  },
  {
    label: "计费统计",
    items: [
      { title: "用量统计", url: "/billing", icon: CreditCard },
      { title: "带宽计费", url: "/bandwidth-billing", icon: Activity },
      { title: "审计日志", url: "/audit", icon: ScrollText },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="Seaisee" className="h-8 w-8 rounded-md shrink-0 object-contain" />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-sidebar-accent-foreground truncate">Seaisee</div>
              <div className="text-xs text-sidebar-muted truncate">{user?.tenant}</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navGroups.map((group) => {
          const groupActive = group.items.some((i) => location.pathname === i.url);
          return (
            <Collapsible key={group.label} defaultOpen>
              <SidebarGroup>
                <CollapsibleTrigger className="w-full">
                  <SidebarGroupLabel className="flex items-center justify-between text-sidebar-muted uppercase text-[10px] tracking-widest">
                    {!collapsed && <span>{group.label}</span>}
                    {!collapsed && <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton asChild size="sm">
                            <NavLink
                              to={item.url}
                              end
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              {!collapsed && <span>{item.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>退出登录</span>
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
