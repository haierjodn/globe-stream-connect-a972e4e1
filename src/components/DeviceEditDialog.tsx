import { useState, useMemo } from "react";
import { type CloudDevice, type BoundAccount, ipResources, orgTree, type OrgNode } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import {
  Smartphone, Globe, Network, Users, CalendarIcon, Plus, Trash2,
  ChevronRight, ChevronDown, Check, Search,
} from "lucide-react";

const platformOptions = ["TikTok", "Facebook", "Instagram", "YouTube"] as const;

interface DeviceEditDialogProps {
  device: CloudDevice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: CloudDevice) => void;
}

// ---- Org tree node ----
function OrgTreeNode({ node, depth, onSelect }: { node: OrgNode; depth: number; onSelect: (node: OrgNode) => void }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div>
      <div
        className="flex items-center gap-1 py-1.5 px-2 rounded hover:bg-muted cursor-pointer text-sm"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => { if (hasChildren) setExpanded(!expanded); onSelect(node); }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />
        ) : <span className="w-3" />}
        <span className={node.type === "department" ? "font-medium" : ""}>{node.name}</span>
        <Badge variant="outline" className="ml-auto text-[10px] h-4">
          {node.type === "department" ? "部门" : "员工"}
        </Badge>
      </div>
      {expanded && hasChildren && node.children!.map((child) => (
        <OrgTreeNode key={child.id} node={child} depth={depth + 1} onSelect={onSelect} />
      ))}
    </div>
  );
}

// ---- DateTime picker ----
function DateTimePicker({ value, onChange, label }: { value: string; onChange: (val: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const dateObj = value ? parse(value, "yyyy-MM-dd HH:mm:ss", new Date()) : undefined;
  const isValid = dateObj && !isNaN(dateObj.getTime());
  const [timeValue, setTimeValue] = useState(isValid ? format(dateObj, "HH:mm") : "00:00");

  const handleDateSelect = (day: Date | undefined) => {
    if (!day) return;
    const [hh, mm] = timeValue.split(":").map(Number);
    day.setHours(hh || 0, mm || 0, 0);
    onChange(format(day, "yyyy-MM-dd HH:mm:ss"));
    setOpen(false);
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    if (isValid && dateObj) {
      const [hh, mm] = newTime.split(":").map(Number);
      const updated = new Date(dateObj);
      updated.setHours(hh || 0, mm || 0, 0);
      onChange(format(updated, "yyyy-MM-dd HH:mm:ss"));
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-9 text-sm", !value && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
            {value || `选择${label}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={isValid ? dateObj : undefined}
            onSelect={handleDateSelect}
            className={cn("p-3 pointer-events-auto")}
          />
          <div className="border-t px-3 py-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">时间</span>
            <Input type="time" value={timeValue} onChange={(e) => handleTimeChange(e.target.value)} className="h-7 text-xs w-[100px]" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DeviceEditDialog({ device, open, onOpenChange, onSave }: DeviceEditDialogProps) {
  // Local editable copy
  const [draft, setDraft] = useState<CloudDevice | null>(null);

  // Reset draft when device changes
  const activeDraft = useMemo(() => {
    if (device && (!draft || draft.id !== device.id)) return { ...device, boundAccounts: [...device.boundAccounts] };
    return draft;
  }, [device, draft]);

  const d = activeDraft;

  // IP search
  const [ipSearch, setIpSearch] = useState("");
  // New account inputs
  const [newPlatform, setNewPlatform] = useState<string>("TikTok");
  const [newUsername, setNewUsername] = useState("");
  // Org popover
  const [orgOpen, setOrgOpen] = useState(false);

  if (!d) return null;

  const update = (partial: Partial<CloudDevice>) => setDraft({ ...d, ...partial });

  const availableIPs = ipResources.filter((ip) => {
    if (ip.status === "禁用") return false;
    if (ip.boundDevice && ip.boundDevice !== d.id) return false;
    if (ipSearch) {
      const kw = ipSearch.toLowerCase();
      if (!ip.address.includes(kw) && !ip.region.toLowerCase().includes(kw)) return false;
    }
    return true;
  });

  const handleRemoveAccount = (index: number) => {
    const updated = d.boundAccounts.filter((_, i) => i !== index);
    update({ boundAccounts: updated });
  };

  const handleAddAccount = () => {
    if (!newUsername.trim()) return;
    const updated = [...d.boundAccounts, { platform: newPlatform as BoundAccount["platform"], username: newUsername.trim() }];
    update({ boundAccounts: updated });
    setNewUsername("");
  };

  const handleSave = () => {
    onSave(d);
    onOpenChange(false);
    toast({ title: "设备信息已保存", description: `${d.id} 的配置已更新` });
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    online: { label: "在线", className: "bg-success/10 text-success border-success/20" },
    offline: { label: "离线", className: "bg-muted text-muted-foreground border-muted" },
    error: { label: "异常", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  const st = statusConfig[d.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[85vh] overflow-y-auto p-0 gap-0">
        <DialogTitle className="sr-only">编辑设备 - {d.name}</DialogTitle>

        {/* Header */}
        <div className="px-6 py-4 border-b bg-card sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{d.name}</span>
                <Badge variant="outline" className={st.className + " text-[10px]"}>{st.label}</Badge>
              </div>
              <div className="text-xs text-muted-foreground font-mono">{d.id} · {d.sn}</div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Section 1: Network / IP */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Network className="h-4 w-4 text-muted-foreground" />
              网络配置
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">当前IP</label>
                <div className="font-mono text-sm px-3 py-2 rounded-md border bg-muted/30">{d.ip}</div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">区域</label>
                <div className="text-sm px-3 py-2 rounded-md border bg-muted/30">{d.region}</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">换绑IP（从资源池选择）</label>
              <Input
                placeholder="搜索IP或区域…"
                value={ipSearch}
                onChange={(e) => setIpSearch(e.target.value)}
                className="h-8 text-xs"
              />
              <div className="max-h-[160px] overflow-auto border rounded-md divide-y">
                {availableIPs.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-4 text-center">无可用IP</div>
                ) : (
                  availableIPs.map((ip) => (
                    <button
                      key={ip.id}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-accent transition-colors text-left",
                        ip.address === d.ip && "bg-primary/5"
                      )}
                      onClick={() => update({ ip: ip.address, region: ip.region })}
                    >
                      <div className="flex items-center gap-2">
                        {ip.address === d.ip && <Check className="h-3 w-3 text-primary" />}
                        <span className="font-mono">{ip.address}</span>
                        <span className="text-muted-foreground">{ip.region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-4">{ip.type}</Badge>
                        <span className={cn(
                          "text-[10px]",
                          ip.purity >= 90 ? "text-success" : ip.purity >= 70 ? "text-warning" : "text-destructive"
                        )}>
                          {ip.purity}%
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* Section 2: Accounts */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Globe className="h-4 w-4 text-muted-foreground" />
              绑定账号
            </div>
            <div className="space-y-1.5">
              {d.boundAccounts.length === 0 && (
                <div className="text-xs text-muted-foreground py-3 text-center border rounded-md bg-muted/20">暂无绑定账号</div>
              )}
              {d.boundAccounts.map((a, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-md border bg-muted/20 text-sm">
                  <div className="flex items-center gap-2 font-mono">
                    <Badge variant="outline" className="text-[10px] h-5">{a.platform}</Badge>
                    {a.username}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemoveAccount(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger className="w-[110px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                placeholder="@username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddAccount(); }}
                className="h-8 text-sm flex-1"
              />
              <Button size="sm" className="h-8" onClick={handleAddAccount} disabled={!newUsername.trim()}>
                <Plus className="h-3.5 w-3.5 mr-1" /> 添加
              </Button>
            </div>
          </section>

          <Separator />

          {/* Section 3: Org binding */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-muted-foreground" />
              组织归属
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">部门</label>
                <Popover open={orgOpen} onOpenChange={setOrgOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal h-9 text-sm">
                      {d.boundDepartment || "选择部门"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-2 max-h-[260px] overflow-auto" align="start">
                    {orgTree.map((node) => (
                      <OrgTreeNode key={node.id} node={node} depth={0} onSelect={(n) => {
                        if (n.type === "department") update({ boundDepartment: n.name });
                        else update({ boundEmployee: n.name });
                        setOrgOpen(false);
                      }} />
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">员工</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal h-9 text-sm">
                      {d.boundEmployee || "选择员工"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-2 max-h-[260px] overflow-auto" align="start">
                    {orgTree.map((node) => (
                      <OrgTreeNode key={node.id} node={node} depth={0} onSelect={(n) => {
                        if (n.type === "employee") update({ boundEmployee: n.name });
                      }} />
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </section>

          <Separator />

          {/* Section 4: Time */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              时间管理
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DateTimePicker
                value={d.bindTime || ""}
                onChange={(val) => update({ bindTime: val })}
                label="绑定时间"
              />
              <DateTimePicker
                value={d.expiryTime || ""}
                onChange={(val) => update({ expiryTime: val })}
                label="到期时间"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-card sticky bottom-0 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleSave}>保存修改</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
