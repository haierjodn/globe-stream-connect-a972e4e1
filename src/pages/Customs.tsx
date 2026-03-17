import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const customsData = [
  { hs: "6204.62", product: "女式棉制长裤", importer: "FashionCo Ltd", country: "🇺🇸 美国", volume: "12,500 件", date: "2026-02" },
  { hs: "8517.12", product: "智能手机", importer: "TechMart Inc", country: "🇬🇧 英国", volume: "8,200 台", date: "2026-02" },
  { hs: "3304.99", product: "护肤品套装", importer: "BeautyWorld GmbH", country: "🇩🇪 德国", volume: "5,600 套", date: "2026-01" },
  { hs: "9403.60", product: "木制家具", importer: "HomeGoods Pty", country: "🇦🇺 澳大利亚", volume: "1,200 件", date: "2026-01" },
  { hs: "6110.30", product: "化纤针织衫", importer: "GlobalTech Inc", country: "🇺🇸 美国", volume: "22,000 件", date: "2025-12" },
];

export default function Customs() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">海关数据</h1>
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索HS编码、产品名称或进口商..." className="pl-9" />
        </div>
        <Button variant="outline">筛选</Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>HS编码</TableHead>
              <TableHead>产品</TableHead>
              <TableHead>进口商</TableHead>
              <TableHead>目的国</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>日期</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customsData.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono">{row.hs}</TableCell>
                <TableCell>{row.product}</TableCell>
                <TableCell className="font-medium">{row.importer}</TableCell>
                <TableCell>{row.country}</TableCell>
                <TableCell className="font-mono">{row.volume}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
