import { useState } from "react";
import { nurtureTasks, nurtureSubTasks, type NurtureTask, type TaskType, type TaskStatus } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Square, FileText, ListFilter } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<TaskStatus, string> = {
  "待执行": "bg-muted text-muted-foreground",
  "执行中": "bg-primary/10 text-primary border-primary/20",
  "执行完成": "bg-green-500/10 text-green-600 border-green-500/20",
  "执行失败": "bg-destructive/10 text-destructive border-destructive/20",
};

const taskTypes: TaskType[] = ["养号", "隐藏视频", "发布作品"];
const taskStatuses: TaskStatus[] = ["待执行", "执行中", "执行完成", "执行失败"];

export default function Nurture() {
  const [accountSearch, setAccountSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [taskIdSearch, setTaskIdSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [creatorSearch, setCreatorSearch] = useState("");
  const [detailTask, setDetailTask] = useState<NurtureTask | null>(null);
  const [subAccountSearch, setSubAccountSearch] = useState("");
  const [subResultFilter, setSubResultFilter] = useState<string>("all");

  const filtered = nurtureTasks.filter((t) => {
    if (accountSearch && !t.name.toLowerCase().includes(accountSearch.toLowerCase())) return false;
    if (nameSearch && !t.name.toLowerCase().includes(nameSearch.toLowerCase())) return false;
    if (taskIdSearch && !t.id.toLowerCase().includes(taskIdSearch.toLowerCase())) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (creatorSearch && !t.creator.toLowerCase().includes(creatorSearch.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: nurtureTasks.length,
    success: nurtureTasks.filter((t) => t.status === "执行完成").length,
    failed: nurtureTasks.filter((t) => t.status === "执行失败").length,
    queue: nurtureTasks.filter((t) => t.status === "待执行").length,
  };

  const subTasks = detailTask
    ? nurtureSubTasks
        .filter((s) => s.parentId === detailTask.id)
        .filter((s) => {
          if (subAccountSearch && !s.account.toLowerCase().includes(subAccountSearch.toLowerCase())) return false;
          if (subResultFilter !== "all" && s.result !== subResultFilter) return false;
          return true;
        })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">养号任务</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="账号搜索" className="pl-8" value={accountSearch} onChange={(e) => setAccountSearch(e.target.value)} />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="任务名称搜索" className="pl-8" value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="任务编号搜索" className="pl-8" value={taskIdSearch} onChange={(e) => setTaskIdSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger><SelectValue placeholder="任务类型" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            {taskTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="任务状态" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            {taskStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="创建用户搜索" className="pl-8" value={creatorSearch} onChange={(e) => setCreatorSearch(e.target.value)} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "任务数量", value: stats.total, color: "text-foreground" },
          { label: "成功数量", value: stats.success, color: "text-green-600" },
          { label: "失败数量", value: stats.failed, color: "text-destructive" },
          { label: "队列数量", value: stats.queue, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任务ID</TableHead>
              <TableHead>任务名称</TableHead>
              <TableHead>任务来源</TableHead>
              <TableHead>任务类型</TableHead>
              <TableHead>开始日期</TableHead>
              <TableHead>截止日期</TableHead>
              <TableHead>执行时间</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>终止时间</TableHead>
              <TableHead>任务进度</TableHead>
              <TableHead>任务状态</TableHead>
              <TableHead>创建用户</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-mono text-xs">{task.id}</TableCell>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell className="text-sm">{task.source}</TableCell>
                <TableCell><Badge variant="outline">{task.type}</Badge></TableCell>
                <TableCell className="font-mono text-xs">{task.startDate}</TableCell>
                <TableCell className="font-mono text-xs">{task.endDate}</TableCell>
                <TableCell className="font-mono text-xs">{task.executeTime}</TableCell>
                <TableCell className="font-mono text-xs">{task.createTime}</TableCell>
                <TableCell className="font-mono text-xs">{task.endTime}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-24">
                    <Progress value={task.progress} className="h-2" />
                    <span className="font-mono text-xs">{task.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusConfig[task.status]}>{task.status}</Badge>
                </TableCell>
                <TableCell className="text-sm">{task.creator}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {(task.status === "待执行") && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="立即执行" onClick={() => toast.success(`任务 ${task.id} 已开始执行`)}>
                        <Play className="h-3.5 w-3.5 text-primary" />
                      </Button>
                    )}
                    {(task.status === "执行中") && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="结束任务" onClick={() => toast.info(`任务 ${task.id} 已结束`)}>
                        <Square className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="任务详情" onClick={() => setDetailTask(task)}>
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">暂无数据</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={!!detailTask} onOpenChange={(open) => !open && setDetailTask(null)}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>任务详情 - {detailTask?.name}</DialogTitle>
          </DialogHeader>
          {detailTask && (
            <div className="space-y-6">
              {/* Parent task info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-muted-foreground">任务ID：</span>{detailTask.id}</div>
                <div><span className="text-muted-foreground">任务类型：</span>{detailTask.type}</div>
                <div><span className="text-muted-foreground">任务状态：</span><Badge variant="outline" className={statusConfig[detailTask.status]}>{detailTask.status}</Badge></div>
                <div><span className="text-muted-foreground">进度：</span>{detailTask.progress}%</div>
                <div><span className="text-muted-foreground">来源：</span>{detailTask.source}</div>
                <div><span className="text-muted-foreground">创建用户：</span>{detailTask.creator}</div>
                <div><span className="text-muted-foreground">创建时间：</span>{detailTask.createTime}</div>
                <div><span className="text-muted-foreground">执行时间：</span>{detailTask.executeTime}</div>
              </div>

              {/* Sub tasks */}
              <div className="space-y-3">
                <h3 className="font-semibold">子任务详情</h3>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="账号/邮箱搜索" className="pl-8" value={subAccountSearch} onChange={(e) => setSubAccountSearch(e.target.value)} />
                  </div>
                  <Select value={subResultFilter} onValueChange={setSubResultFilter}>
                    <SelectTrigger className="w-32"><SelectValue placeholder="结果筛选" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部结果</SelectItem>
                      <SelectItem value="成功">成功</SelectItem>
                      <SelectItem value="失败">失败</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {detailTask.type === "养号" && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>任务ID</TableHead>
                        <TableHead>账号</TableHead>
                        <TableHead>执行日期</TableHead>
                        <TableHead>浏览视频数</TableHead>
                        <TableHead>浏览时长</TableHead>
                        <TableHead>点赞视频数</TableHead>
                        <TableHead>关注人数</TableHead>
                        <TableHead>评论数量</TableHead>
                        <TableHead>开始时间</TableHead>
                        <TableHead>结束时间</TableHead>
                        <TableHead>任务结果</TableHead>
                        <TableHead>失败原因</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subTasks.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-mono text-xs">{s.id}</TableCell>
                          <TableCell className="font-mono text-sm">{s.account}</TableCell>
                          <TableCell className="font-mono text-xs">{s.executeDate}</TableCell>
                          <TableCell>{s.browseVideos}</TableCell>
                          <TableCell>{s.browseTime}</TableCell>
                          <TableCell>{s.likeCount}</TableCell>
                          <TableCell>{s.followCount}</TableCell>
                          <TableCell>{s.commentCount}</TableCell>
                          <TableCell className="font-mono text-xs">{s.startTime}</TableCell>
                          <TableCell className="font-mono text-xs">{s.endTime}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={s.result === "成功" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}>
                              {s.result}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{s.failReason || "-"}</TableCell>
                        </TableRow>
                      ))}
                      {subTasks.length === 0 && (
                        <TableRow><TableCell colSpan={12} className="text-center py-6 text-muted-foreground">暂无子任务数据</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}

                {detailTask.type === "隐藏视频" && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>任务ID</TableHead>
                        <TableHead>账号</TableHead>
                        <TableHead>开始时间</TableHead>
                        <TableHead>结束时间</TableHead>
                        <TableHead>隐藏数量</TableHead>
                        <TableHead>隐藏成功数量</TableHead>
                        <TableHead>隐藏失败数量</TableHead>
                        <TableHead>任务结果</TableHead>
                        <TableHead>失败原因</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subTasks.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-mono text-xs">{s.id}</TableCell>
                          <TableCell className="font-mono text-sm">{s.account}</TableCell>
                          <TableCell className="font-mono text-xs">{s.startTime}</TableCell>
                          <TableCell className="font-mono text-xs">{s.endTime}</TableCell>
                          <TableCell>{s.browseVideos}</TableCell>
                          <TableCell>{s.likeCount}</TableCell>
                          <TableCell>{s.commentCount}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={s.result === "成功" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}>{s.result}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{s.failReason || "-"}</TableCell>
                        </TableRow>
                      ))}
                      {subTasks.length === 0 && (
                        <TableRow><TableCell colSpan={9} className="text-center py-6 text-muted-foreground">暂无子任务数据</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}

                {detailTask.type === "发布作品" && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>任务ID</TableHead>
                        <TableHead>执行日期</TableHead>
                        <TableHead>账号</TableHead>
                        <TableHead>素材标签</TableHead>
                        <TableHead>素材链接</TableHead>
                        <TableHead>素材描述</TableHead>
                        <TableHead>素材</TableHead>
                        <TableHead>营销活动链接</TableHead>
                        <TableHead>素材ID</TableHead>
                        <TableHead>开始时间</TableHead>
                        <TableHead>结束时间</TableHead>
                        <TableHead>任务结果</TableHead>
                        <TableHead>失败原因</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subTasks.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-mono text-xs">{s.id}</TableCell>
                          <TableCell className="font-mono text-xs">{s.executeDate}</TableCell>
                          <TableCell className="font-mono text-sm">{s.account}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell className="font-mono text-xs">{s.startTime}</TableCell>
                          <TableCell className="font-mono text-xs">{s.endTime}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={s.result === "成功" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}>{s.result}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{s.failReason || "-"}</TableCell>
                        </TableRow>
                      ))}
                      {subTasks.length === 0 && (
                        <TableRow><TableCell colSpan={13} className="text-center py-6 text-muted-foreground">暂无子任务数据</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
