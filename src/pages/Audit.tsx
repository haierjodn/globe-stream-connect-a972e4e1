import { auditLogs } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Audit() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">审计日志</h1>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="搜索操作、用户或目标..." className="pl-9" />
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>时间</TableHead>
              <TableHead>用户</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>目标</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.time}</TableCell>
                <TableCell className="text-sm">{log.user}</TableCell>
                <TableCell className="text-sm">{log.action}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{log.target}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
