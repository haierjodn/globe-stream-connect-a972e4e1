import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Plus, Trash2, Clock, Calendar, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ── Radio helper ──
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

function OptionalLabel({ children, tip }: { children: React.ReactNode; tip?: string }) {
  return (
    <div className="flex items-center gap-1 text-sm font-medium">
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

// ── RangeInput with switch ──
function RangeWithSwitch({ label, enabled, onToggle, min, max, minVal, maxVal, onMinChange, onMaxChange, tip }: {
  label: string; enabled: boolean; onToggle: (v: boolean) => void;
  min: number; max: number; minVal: number; maxVal: number;
  onMinChange: (v: number) => void; onMaxChange: (v: number) => void; tip?: string;
}) {
  return (
    <div className="space-y-2">
      <OptionalLabel tip={tip}>{label}</OptionalLabel>
      <div className="flex items-center gap-2">
        <Switch checked={enabled} onCheckedChange={onToggle} />
        <Input type="number" min={min} max={max} value={minVal} onChange={(e) => onMinChange(Number(e.target.value))}
          className="w-20 text-center" disabled={!enabled} placeholder={`${min}-${max}`} />
        <span className="text-muted-foreground">-</span>
        <Input type="number" min={min} max={max} value={maxVal} onChange={(e) => onMaxChange(Number(e.target.value))}
          className="w-20 text-center" disabled={!enabled} placeholder={`${min}-${max}`} />
        {tip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent><p className="text-xs">{tip}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

// ── Script Template interfaces ──
interface ScriptTemplate {
  id: string;
  name: string;
  scripts: string[];
}

// ── New Template Dialog ──
function NewTemplateDialog({ open, onOpenChange, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void; onSave: (t: ScriptTemplate) => void;
}) {
  const [name, setName] = useState("");
  const [scripts, setScripts] = useState<string[]>([""]);

  const handleSave = () => {
    if (!name.trim()) { toast.error("请输入模板名称"); return; }
    if (scripts.some(s => !s.trim())) { toast.error("请填写所有话术内容"); return; }
    onSave({ id: Date.now().toString(), name, scripts });
    setName(""); setScripts([""]); onOpenChange(false);
    toast.success("话术模板创建成功");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>新建话术模板</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium whitespace-nowrap"><span className="text-destructive">*</span> 模板名称</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {scripts.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm font-medium whitespace-nowrap"><span className="text-destructive">*</span> 话术{i + 1}</span>
              <Input value={s} onChange={(e) => { const next = [...scripts]; next[i] = e.target.value; setScripts(next); }} />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setScripts([...scripts, ""])}><Plus className="h-3.5 w-3.5" /></Button>
              {scripts.length > 1 && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setScripts(scripts.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>确 定</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取 消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Template Management Dialog ──
function TemplateManageDialog({ open, onOpenChange, templates, onDelete, onNew }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  templates: ScriptTemplate[]; onDelete: (id: string) => void; onNew: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle>话术模版管理</DialogTitle>
            <Button variant="outline" size="sm" onClick={onNew}>新建模板</Button>
          </div>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>模板名称</TableHead>
              <TableHead>话术数量</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">暂无数据</TableCell></TableRow>
            ) : templates.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.scripts.length}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(t.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Dialog ──
export function AutoNurtureDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  // Dimension
  const [dimension, setDimension] = useState<"account" | "tag">("account");
  const [selectedAccounts, setSelectedAccounts] = useState(0);
  const [selectedTag, setSelectedTag] = useState("");

  // Basic
  const [taskName, setTaskName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Shanghai");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [nurtureDuration, setNurtureDuration] = useState("");

  // Ratios
  const [likeEnabled, setLikeEnabled] = useState(false);
  const [likeMin, setLikeMin] = useState(0);
  const [likeMax, setLikeMax] = useState(15);
  const [followEnabled, setFollowEnabled] = useState(false);
  const [followMin, setFollowMin] = useState(0);
  const [followMax, setFollowMax] = useState(15);
  const [commentEnabled, setCommentEnabled] = useState(false);
  const [commentMin, setCommentMin] = useState(0);
  const [commentMax, setCommentMax] = useState(15);

  // Browse duration
  const [browseMin, setBrowseMin] = useState(1);
  const [browseMax, setBrowseMax] = useState(120);

  // Comment emoji
  const [commentEmoji, setCommentEmoji] = useState<"on" | "off">("on");

  // Random search
  const [randomSearch, setRandomSearch] = useState<"on" | "off">("on");

  // Script template
  const [scriptTemplate, setScriptTemplate] = useState("");
  const [templates, setTemplates] = useState<ScriptTemplate[]>([]);
  const [manageOpen, setManageOpen] = useState(false);
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);

  // Keywords
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordOnly, setKeywordOnly] = useState<"on" | "off">("off");

  const now = new Date();
  const localTimeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  const handleSubmit = () => {
    toast.success("自动养号任务已创建");
    onOpenChange(false);
  };

  const addKeyword = () => setKeywords([...keywords, ""]);

  const handleNewTemplate = (t: ScriptTemplate) => {
    setTemplates([...templates, t]);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>自动养号</DialogTitle></DialogHeader>

          <div className="space-y-5">
            {/* 维度 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <RequiredLabel>维度</RequiredLabel>
                <div className="flex items-center gap-4">
                  <RadioOption name="dimension" value="account" checked={dimension === "account"} onChange={() => setDimension("account")} label="按账号" />
                  <RadioOption name="dimension" value="tag" checked={dimension === "tag"} onChange={() => setDimension("tag")} label="按标签" />
                </div>
              </div>
              {dimension === "tag" && (
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
            </div>

            {/* 账号数量 (only for account dimension) */}
            {dimension === "account" && (
              <div className="space-y-2">
                <span className="text-sm font-medium">账号数量</span>
                <div className="flex gap-2">
                  <Input readOnly value={`已选择${selectedAccounts}个账号`} className="flex-1" />
                  <Button variant="outline" onClick={() => toast.info("选择账号功能开发中")}>选择账号</Button>
                </div>
              </div>
            )}

            {/* 任务名称 */}
            <div className="space-y-2">
              <span className="text-sm font-medium">任务名称</span>
              <Input placeholder="请输入任务名称" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
            </div>

            {/* 时区 + 养号日期 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <RequiredLabel>时区 (当地时间: {localTimeStr})</RequiredLabel>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Shanghai">中国-上海 (UTC+08:00)</SelectItem>
                    <SelectItem value="America/New_York">美国-纽约 (UTC-05:00)</SelectItem>
                    <SelectItem value="America/Los_Angeles">美国-洛杉矶 (UTC-08:00)</SelectItem>
                    <SelectItem value="Europe/London">英国-伦敦 (UTC+00:00)</SelectItem>
                    <SelectItem value="Asia/Tokyo">日本-东京 (UTC+09:00)</SelectItem>
                    <SelectItem value="Asia/Bangkok">泰国-曼谷 (UTC+07:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <RequiredLabel tip="养号日期范围">养号日期</RequiredLabel>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-8" value={dateStart} onChange={(e) => setDateStart(e.target.value)} placeholder="请选择开始时间" />
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <Input type="date" className="flex-1" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} placeholder="请选择结束时间" />
                </div>
              </div>
            </div>

            {/* 执行时间 + 养号时长 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <RequiredLabel tip="每天执行的时间段">执行时间</RequiredLabel>
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
              <div className="space-y-2">
                <RequiredLabel tip="每次养号的时长">养号时长</RequiredLabel>
                <Select value={nurtureDuration} onValueChange={setNurtureDuration}>
                  <SelectTrigger><SelectValue placeholder="请选择养号时长" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5分钟</SelectItem>
                    <SelectItem value="10">10分钟</SelectItem>
                    <SelectItem value="15">15分钟</SelectItem>
                    <SelectItem value="20">20分钟</SelectItem>
                    <SelectItem value="30">30分钟</SelectItem>
                    <SelectItem value="45">45分钟</SelectItem>
                    <SelectItem value="60">60分钟</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 点赞/关注/评论比例 */}
            <div className="grid grid-cols-2 gap-6">
              <div /> {/* empty for layout alignment */}
              <RangeWithSwitch label="点赞比例" enabled={likeEnabled} onToggle={setLikeEnabled}
                min={0} max={15} minVal={likeMin} maxVal={likeMax}
                onMinChange={setLikeMin} onMaxChange={setLikeMax} tip="每浏览N个视频点赞一次" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <RangeWithSwitch label="关注比例" enabled={followEnabled} onToggle={setFollowEnabled}
                min={0} max={15} minVal={followMin} maxVal={followMax}
                onMinChange={setFollowMin} onMaxChange={setFollowMax} tip="每浏览N个视频关注一次" />
              <RangeWithSwitch label="评论比例" enabled={commentEnabled} onToggle={setCommentEnabled}
                min={0} max={15} minVal={commentMin} maxVal={commentMax}
                onMinChange={setCommentMin} onMaxChange={setCommentMax} tip="每浏览N个视频评论一次" />
            </div>

            {/* 视频浏览时长 + 评论插入表情 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <RequiredLabel tip="每个视频浏览时长范围(秒)">视频浏览时长</RequiredLabel>
                <div className="flex items-center gap-2">
                  <Input type="number" min={1} max={120} value={browseMin} onChange={(e) => setBrowseMin(Number(e.target.value))}
                    className="flex-1 text-center" placeholder="1s - 120s" />
                  <span className="text-muted-foreground">-</span>
                  <Input type="number" min={1} max={120} value={browseMax} onChange={(e) => setBrowseMax(Number(e.target.value))}
                    className="flex-1 text-center" placeholder="1s - 120s" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">评论插入表情</span>
                <div className="flex items-center gap-4">
                  <RadioOption name="emoji" value="on" checked={commentEmoji === "on"} onChange={() => setCommentEmoji("on")} label="开启" />
                  <RadioOption name="emoji" value="off" checked={commentEmoji === "off"} onChange={() => setCommentEmoji("off")} label="关闭" />
                </div>
              </div>
            </div>

            {/* 随机搜索 + 话术模版 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-sm font-medium">随机搜索</span>
                <div className="flex items-center gap-4">
                  <RadioOption name="random" value="on" checked={randomSearch === "on"} onChange={() => setRandomSearch("on")} label="开启" />
                  <RadioOption name="random" value="off" checked={randomSearch === "off"} onChange={() => setRandomSearch("off")} label="关闭" />
                </div>
              </div>
              <div className="space-y-2">
                <OptionalLabel tip="评论时使用的话术模版">话术模版</OptionalLabel>
                <div className="flex items-center gap-2">
                  <Select value={scriptTemplate} onValueChange={setScriptTemplate}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => setManageOpen(true)}>话术模版管理</Button>
                </div>
              </div>
            </div>

            {/* 关键词 + 仅关键词互动 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <OptionalLabel tip="搜索使用的关键词">关键词</OptionalLabel>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Input value={kw} onChange={(e) => { const next = [...keywords]; next[i] = e.target.value; setKeywords(next); }}
                        className="w-28" placeholder={`关键词${i + 1}`} />
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setKeywords(keywords.filter((_, j) => j !== i))}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addKeyword}><Plus className="h-3.5 w-3.5 mr-1" />关键词</Button>
                </div>
              </div>
              <div className="space-y-2">
                <OptionalLabel tip="仅对包含关键词的视频进行互动">仅关键词互动</OptionalLabel>
                <div className="flex items-center gap-4">
                  <RadioOption name="kwonly" value="on" checked={keywordOnly === "on"} onChange={() => setKeywordOnly("on")} label="开启" />
                  <RadioOption name="kwonly" value="off" checked={keywordOnly === "off"} onChange={() => setKeywordOnly("off")} label="关闭" />
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

      {/* Sub-dialogs */}
      <TemplateManageDialog open={manageOpen} onOpenChange={setManageOpen} templates={templates}
        onDelete={(id) => setTemplates(templates.filter(t => t.id !== id))}
        onNew={() => { setNewTemplateOpen(true); }} />
      <NewTemplateDialog open={newTemplateOpen} onOpenChange={setNewTemplateOpen} onSave={handleNewTemplate} />
    </>
  );
}
