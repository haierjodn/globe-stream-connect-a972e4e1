import { socialAccounts } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusConfig = {
  "正常": "bg-success/10 text-success border-success/20",
  "受限": "bg-warning/10 text-warning border-warning/20",
  "封禁": "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Accounts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">账号管理</h1>
        <Button>+ 添加账号</Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>账号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>粉丝数</TableHead>
              <TableHead>发帖数</TableHead>
              <TableHead>绑定云机</TableHead>
              <TableHead>绑定IP</TableHead>
              <TableHead>最后活跃</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {socialAccounts.map((acc) => (
              <TableRow key={acc.id}>
                <TableCell className="font-mono font-medium">{acc.username}</TableCell>
                <TableCell><Badge variant="outline" className={statusConfig[acc.status]}>{acc.status}</Badge></TableCell>
                <TableCell className="font-mono">{acc.followers.toLocaleString()}</TableCell>
                <TableCell className="font-mono">{acc.posts}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{acc.device}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{acc.ip}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{acc.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
