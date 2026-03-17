import { nurtureTasks } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const statusConfig = {
  "进行中": "bg-primary/10 text-primary border-primary/20",
  "已完成": "bg-success/10 text-success border-success/20",
  "待执行": "bg-muted text-muted-foreground",
  "失败": "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Nurture() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">养号任务</h1>
        <Button>+ 创建养号计划</Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任务名称</TableHead>
              <TableHead>目标账号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>执行动作</TableHead>
              <TableHead>开始时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nurtureTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell className="font-mono text-sm">{task.account}</TableCell>
                <TableCell><Badge variant="outline" className={statusConfig[task.status]}>{task.status}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-28">
                    <Progress value={task.progress} className="h-2" />
                    <span className="font-mono text-xs">{task.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{task.actions}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{task.startTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
