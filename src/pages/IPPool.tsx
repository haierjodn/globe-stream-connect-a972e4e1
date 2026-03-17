import { ipResources } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusColors = {
  "空闲": "bg-success/10 text-success border-success/20",
  "已绑定": "bg-primary/10 text-primary border-primary/20",
  "冷却中": "bg-warning/10 text-warning border-warning/20",
};

export default function IPPool() {
  const copyIP = (ip: string) => {
    navigator.clipboard.writeText(ip);
    toast({ title: "已复制", description: ip });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">IP资源池</h1>
        <Button>+ 导入IP</Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP地址</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>纯净度</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>归属地</TableHead>
              <TableHead>绑定设备</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ipResources.map((ip) => (
              <TableRow key={ip.id}>
                <TableCell>
                  <button onClick={() => copyIP(ip.address)} className="flex items-center gap-2 font-mono text-sm hover:text-primary transition-colors group">
                    {ip.address}
                    <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </TableCell>
                <TableCell><Badge variant="outline">{ip.type}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-28">
                    <Progress value={ip.purity} className="h-2" />
                    <span className={`font-mono text-xs ${ip.purity >= 90 ? "text-success" : ip.purity >= 70 ? "text-warning" : "text-destructive"}`}>
                      {ip.purity}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[ip.status]}>{ip.status}</Badge>
                </TableCell>
                <TableCell className="text-sm">{ip.region}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{ip.boundDevice || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
