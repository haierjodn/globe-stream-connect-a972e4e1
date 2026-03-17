import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const bandwidthData = [
  { time: "00:00", regular: 45, dedicated: 20 },
  { time: "04:00", regular: 30, dedicated: 15 },
  { time: "08:00", regular: 65, dedicated: 40 },
  { time: "12:00", regular: 80, dedicated: 55 },
  { time: "16:00", regular: 72, dedicated: 48 },
  { time: "20:00", regular: 88, dedicated: 70 },
  { time: "23:59", regular: 55, dedicated: 35 },
];

export default function Bandwidth() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">带宽管理</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">常规带宽</p>
            <p className="text-2xl font-bold font-mono mt-1">200 Mbps</p>
            <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">正常</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">专线带宽</p>
            <p className="text-2xl font-bold font-mono mt-1">100 Mbps</p>
            <Badge variant="outline" className="mt-2 bg-warning/10 text-warning border-warning/20">使用率 95%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-sm text-muted-foreground">直播专线</p>
            <div className="flex items-center gap-3">
              <Switch id="dedicated" />
              <Label htmlFor="dedicated">启用专线模式</Label>
            </div>
            <p className="text-xs text-muted-foreground">启用后直播推流自动切换至专线带宽</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">带宽使用趋势（今日）</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              regular: { label: "常规带宽", color: "hsl(var(--primary))" },
              dedicated: { label: "专线带宽", color: "hsl(var(--warning))" },
            }}
            className="h-[280px]"
          >
            <AreaChart data={bandwidthData}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="regular" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="dedicated" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
