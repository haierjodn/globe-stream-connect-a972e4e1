import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function RadioOption({ name, value, checked, onChange, label }: {
  name: string; value: string; checked: boolean; onChange: (v: string) => void; label: string;
}) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)}
        className="w-4 h-4 accent-primary" />
      <span className={checked ? "text-primary font-medium" : "text-muted-foreground"}>{label}</span>
    </label>
  );
}

function RequiredLabel({ children, tip }: { children: React.ReactNode; tip?: string }) {
  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <span className="text-destructive">*</span>
      <span>{children}</span>
      {tip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
            <TooltipContent><p className="text-xs">{tip}</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export function HideVideoDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [dimension, setDimension] = useState<"account" | "tag">("account");
  const [selectedAccounts, setSelectedAccounts] = useState(0);
  const [selectedTag, setSelectedTag] = useState("");
  const [taskName, setTaskName] = useState("");
  const [hideMode, setHideMode] = useState<"views" | "time">("views");
  const [viewsMin, setViewsMin] = useState("");
  const [viewsMax, setViewsMax] = useState("");
  const [publishDateStart, setPublishDateStart] = useState("");
  const [publishDateEnd, setPublishDateEnd] = useState("");
  const [shouldDelete, setShouldDelete] = useState<"yes" | "no" | "">("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const handleSubmit = () => {
    toast.success("隐藏视频任务已创建");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>隐藏视频</DialogTitle></DialogHeader>

        <div className="space-y-5">
          {/* 维度 */}
          <div className="space-y-2">
            <RequiredLabel>维度</RequiredLabel>
            <div className="flex items-center gap-4">
              <RadioOption name="hv-dim" value="account" checked={dimension === "account"} onChange={() => setDimension("account")} label="按账号" />
              <RadioOption name="hv-dim" value="tag" checked={dimension === "tag"} onChange={() => setDimension("tag")} label="按标签" />
            </div>
          </div>

          {/* 账号数量 / 标签 */}
          {dimension === "account" ? (
            <div className="space-y-2">
              <span className="text-sm font-medium">账号数量</span>
              <div className="flex gap-2">
                <Input readOnly value={`已选择${selectedAccounts}个账号`} className="flex-1" />
                <Button variant="outline" onClick={() => toast.info("选择账号功能开发中")}>选择账号</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-sm font-medium">标签</span>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tag1">标签1</SelectItem>
                  <SelectItem value="tag2">标签2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 任务名称 */}
          <div className="space-y-2">
            <span className="text-sm font-medium">任务名称</span>
            <Input placeholder="请输入任务名称" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>

          {/* 隐藏方式 */}
          <div className="space-y-2">
            <span className="text-sm font-medium">隐藏方式</span>
            <div className="flex items-center gap-4">
              <RadioOption name="hv-mode" value="views" checked={hideMode === "views"} onChange={() => setHideMode("views")} label="浏览次数" />
              <RadioOption name="hv-mode" value="time" checked={hideMode === "time"} onChange={() => setHideMode("time")} label="发布时间" />
            </div>
          </div>

          {/* 浏览次数 / 发布时间 */}
          {hideMode === "views" ? (
            <div className="space-y-2">
              <RequiredLabel tip="视频浏览次数范围">浏览次数</RequiredLabel>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="请输入" value={viewsMin} onChange={(e) => setViewsMin(e.target.value)} className="flex-1 text-center" />
                <span className="text-muted-foreground">-</span>
                <Input type="number" placeholder="请输入" value={viewsMax} onChange={(e) => setViewsMax(e.target.value)} className="flex-1 text-center" />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <RequiredLabel>发布时间</RequiredLabel>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-8" value={publishDateStart} onChange={(e) => setPublishDateStart(e.target.value)} placeholder="开始时间" />
                </div>
                <span className="text-muted-foreground">-</span>
                <Input type="date" className="flex-1" value={publishDateEnd} onChange={(e) => setPublishDateEnd(e.target.value)} placeholder="结束时间" />
              </div>
            </div>
          )}

          {/* 是否删除 */}
          <div className="space-y-2">
            <RequiredLabel>是否删除</RequiredLabel>
            <div className="flex items-center gap-4">
              <RadioOption name="hv-delete" value="yes" checked={shouldDelete === "yes"} onChange={() => setShouldDelete("yes")} label="是" />
              <RadioOption name="hv-delete" value="no" checked={shouldDelete === "no"} onChange={() => setShouldDelete("no")} label="否" />
            </div>
          </div>

          {/* 执行时间 */}
          <div className="space-y-2">
            <span className="text-sm font-medium">执行时间</span>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="time" className="pl-8" value={timeStart} onChange={(e) => setTimeStart(e.target.value)} placeholder="开始时间" />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative flex-1">
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="time" className="pl-8" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} placeholder="结束时间" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmit}>确 定</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取 消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
