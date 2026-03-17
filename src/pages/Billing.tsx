import { billingData, billingTrend } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

export default function Billing() {
  const totalPoints = billingData.reduce((s, b) => s + b.points, 0);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">用量统计</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">本月总消耗</p>
            <p className="text-2xl font-bold font-mono mt-1">{totalPoints.toLocaleString()} 点</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">剩余额度</p>
            <p className="text-2xl font-bold font-mono mt-1">{(50000 - totalPoints).toLocaleString()} 点</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">使用率</p>
            <p className="text-2xl font-bold font-mono mt-1">{Math.round(totalPoints / 500)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">按服务分类</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>服务</TableHead>
                  <TableHead className="text-right">点数</TableHead>
                  <TableHead className="text-right">费用</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingData.map((b) => (
                  <TableRow key={b.service}>
                    <TableCell>{b.service}</TableCell>
                    <TableCell className="text-right font-mono">{b.points.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{b.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">每日消耗趋势</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ points: { label: "点数", color: "hsl(var(--primary))" } }} className="h-[240px]">
              <BarChart data={billingTrend}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="points" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
