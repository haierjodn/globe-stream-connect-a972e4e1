import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { viewsTrend, dashboardKPIs } from "@/lib/mock-data";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis } from "recharts";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">数据看板</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "7日总播放", value: "141K" },
          { label: "7日总点赞", value: "10.2K" },
          { label: "7日总分享", value: "1.5K" },
          { label: "平均互动率", value: "8.2%" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold font-mono mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">播放量趋势</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ views: { label: "播放量", color: "hsl(var(--primary))" } }} className="h-[260px]">
              <BarChart data={viewsTrend}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">互动数据趋势</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                likes: { label: "点赞", color: "hsl(var(--success))" },
                shares: { label: "分享", color: "hsl(var(--warning))" },
              }}
              className="h-[260px]"
            >
              <LineChart data={viewsTrend}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="likes" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="shares" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
