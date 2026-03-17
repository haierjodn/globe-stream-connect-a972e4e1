import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const usageData = [
  { date: "2026-03-17", hours: 4.5, cost: "¥90" },
  { date: "2026-03-16", hours: 6.2, cost: "¥124" },
  { date: "2026-03-15", hours: 8.0, cost: "¥160" },
  { date: "2026-03-14", hours: 3.8, cost: "¥76" },
  { date: "2026-03-13", hours: 5.5, cost: "¥110" },
];

export default function BandwidthBilling() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">带宽计费</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">本月专线时长</p>
            <p className="text-2xl font-bold font-mono mt-1">28.0 小时</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">本月带宽费用</p>
            <p className="text-2xl font-bold font-mono mt-1">¥560</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">每日明细</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead className="text-right">使用时长</TableHead>
                <TableHead className="text-right">费用</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageData.map(row => (
                <TableRow key={row.date}>
                  <TableCell className="font-mono">{row.date}</TableCell>
                  <TableCell className="text-right font-mono">{row.hours} h</TableCell>
                  <TableCell className="text-right font-mono">{row.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
