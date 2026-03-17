import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardKPIs, onlineRateTrend, accountHealth, recentAlerts } from "@/lib/mock-data";
import { Server, UserCircle, Send, Target, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const kpiCards = [
  { label: "在线云机", value: `${dashboardKPIs.onlineDevices}/${dashboardKPIs.totalDevices}`, icon: Server, accent: "text-primary" },
  { label: "活跃账号", value: `${dashboardKPIs.activeAccounts}/${dashboardKPIs.totalAccounts}`, icon: UserCircle, accent: "text-success" },
  { label: "今日发帖", value: dashboardKPIs.todayPosts, icon: Send, accent: "text-warning" },
  { label: "线索总数", value: dashboardKPIs.totalLeads.toLocaleString(), icon: Target, accent: "text-primary" },
];

const alertIcons = { error: AlertCircle, warning: AlertTriangle, info: Info };
const alertColors = { error: "text-destructive", warning: "text-warning", info: "text-primary" };

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Seaisee Status</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold font-mono mt-1">{kpi.value}</p>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.accent} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">云机在线率趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ rate: { label: "在线率%", color: "hsl(var(--primary))" } }} className="h-[220px]">
              <LineChart data={onlineRateTrend}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">账号健康度分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={accountHealth} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {accountHealth.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {accountHealth.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-mono font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">最近告警</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentAlerts.map((alert) => {
            const Icon = alertIcons[alert.type as keyof typeof alertIcons];
            const color = alertColors[alert.type as keyof typeof alertColors];
            return (
              <div key={alert.id} className="flex items-center gap-3 rounded-md border p-3">
                <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                <span className="text-sm flex-1">{alert.message}</span>
                <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{alert.time}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
