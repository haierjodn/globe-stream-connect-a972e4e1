import { useState, useMemo } from "react";
import { socialAccounts, SocialAccount, AccountPlatform } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus, MoreHorizontal, Edit2, Trash2, Eye, Users, Upload, Monitor, UserPlus,
  AlertTriangle, Ban, CheckCircle2, MessageCircle, Instagram, Video,
  RefreshCw, Download, Tag, FolderOpen, Settings, Play, EyeOff, ShoppingBag, FileText
} from "lucide-react";
import { PublishVideoDialog } from "@/components/PublishVideoDialog";
import { AutoNurtureDialog } from "@/components/AutoNurtureDialog";

// ── Platform config ──
const platformConfig: Record<AccountPlatform, { label: string; color: string; icon: React.ReactNode }> = {
  TikTok: { label: "TikTok", color: "bg-foreground/10 text-foreground border-foreground/20", icon: <Video className="h-3.5 w-3.5" /> },
  Instagram: { label: "Instagram", color: "bg-pink-500/10 text-pink-600 border-pink-500/20", icon: <Instagram className="h-3.5 w-3.5" /> },
  WhatsApp: { label: "WhatsApp", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: <MessageCircle className="h-3.5 w-3.5" /> },
};

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  "正常": { color: "bg-success/10 text-success border-success/20", icon: <CheckCircle2 className="h-3 w-3" /> },
  "受限": { color: "bg-warning/10 text-warning border-warning/20", icon: <AlertTriangle className="h-3 w-3" /> },
  "封禁": { color: "bg-destructive/10 text-destructive border-destructive/20", icon: <Ban className="h-3 w-3" /> },
};

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "w";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

// ── Stats Card ──
function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-bold font-mono leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </Card>
  );
}

// ── Add Account Dialog ──
function AddAccountDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [platform, setPlatform] = useState<AccountPlatform>("TikTok");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>添加账号</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>所属平台</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as AccountPlatform)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["TikTok", "Instagram", "WhatsApp"] as AccountPlatform[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      <span className="flex items-center gap-2">{platformConfig[p].icon} {p}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>账号ID / 用户名</Label>
              <Input placeholder={platform === "WhatsApp" ? "+1-xxx-xxx-xxxx" : "@username"} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>昵称</Label>
              <Input placeholder="输入昵称" />
            </div>
            <div className="space-y-2">
              <Label>负责人</Label>
              <Select><SelectTrigger><SelectValue placeholder="选择负责人" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="张伟">张伟</SelectItem>
                  <SelectItem value="李娜">李娜</SelectItem>
                  <SelectItem value="王芳">王芳</SelectItem>
                  <SelectItem value="王磊">王磊</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>分组</Label>
              <Select><SelectTrigger><SelectValue placeholder="选择分组" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="默认分组">默认分组</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>标签</Label>
              <Input placeholder="输入标签，用逗号分隔" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>备注</Label>
            <Textarea placeholder="可选" rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => { toast.success("账号已添加"); onOpenChange(false); }}>确认添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Account Detail Dialog ──
function AccountDetailDialog({ account, open, onOpenChange }: { account: SocialAccount | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!account) return null;
  const pc = platformConfig[account.platform];
  const sc = statusConfig[account.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>账号详情</DialogTitle></DialogHeader>
        <div className="space-y-6 py-2">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
              {account.nickname.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{account.nickname}</h3>
                <Badge variant="outline" className={pc.color}>
                  <span className="flex items-center gap-1">{pc.icon} {pc.label}</span>
                </Badge>
                <Badge variant="outline" className={sc.color}>
                  <span className="flex items-center gap-1">{sc.icon} {account.status}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono mt-0.5">{account.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3 text-center">
              <p className="text-xl font-bold font-mono">{formatNumber(account.followers)}</p>
              <p className="text-xs text-muted-foreground">粉丝</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-bold font-mono">{account.following}</p>
              <p className="text-xs text-muted-foreground">关注</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-bold font-mono">{formatNumber(account.likes)}</p>
              <p className="text-xs text-muted-foreground">点赞</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-bold font-mono">{formatNumber(account.views)}</p>
              <p className="text-xs text-muted-foreground">播放量</p>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">绑定云机</span><span className="font-mono">{account.device || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">绑定IP</span><span className="font-mono text-xs">{account.ip || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">地区</span><span>{account.region}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">负责人</span><span>{account.boundEmployee}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">分组</span><span>{account.group}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">绑定状态</span><span>{account.bindStatus}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">创建时间</span><span>{account.createdAt}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">最后活跃</span><span>{account.lastActive}</span></div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">标签</p>
            <div className="flex gap-1.5 flex-wrap">
              {account.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
          <Button><Edit2 className="h-4 w-4 mr-1" />编辑</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──
export default function Accounts() {
  const [accounts] = useState<SocialAccount[]>(socialAccounts);
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [deviceSearch, setDeviceSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [detailAccount, setDetailAccount] = useState<SocialAccount | null>(null);
  const [publishVideoOpen, setPublishVideoOpen] = useState(false);
  const [autoNurtureOpen, setAutoNurtureOpen] = useState(false);

  const uniqueAccounts = useMemo(() => [...new Set(accounts.map((a) => a.username))], [accounts]);
  const uniqueCountries = useMemo(() => [...new Set(accounts.map((a) => a.region))], [accounts]);
  const uniqueTags = useMemo(() => [...new Set(accounts.flatMap((a) => a.tags))], [accounts]);
  const uniqueGroups = useMemo(() => [...new Set(accounts.map((a) => a.group).filter(Boolean))], [accounts]);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (accountFilter !== "all" && a.username !== accountFilter) return false;
      if (platformFilter !== "all" && a.platform !== platformFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (countryFilter !== "all" && a.region !== countryFilter) return false;
      if (tagFilter !== "all" && !a.tags.includes(tagFilter)) return false;
      if (groupFilter !== "all" && a.group !== groupFilter) return false;
      if (deviceSearch) {
        const q = deviceSearch.toLowerCase();
        if (!a.device.toLowerCase().includes(q)) return false;
      }
      if (dateFrom && a.createdAt < dateFrom) return false;
      if (dateTo && a.createdAt > dateTo) return false;
      return true;
    });
  }, [accounts, accountFilter, platformFilter, statusFilter, countryFilter, tagFilter, groupFilter, deviceSearch, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const total = accounts.length;
    const normal = accounts.filter((a) => a.status === "正常").length;
    const restricted = accounts.filter((a) => a.status === "受限").length;
    const banned = accounts.filter((a) => a.status === "封禁").length;
    return { total, normal, restricted, banned };
  }, [accounts]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const handleReset = () => {
    setAccountFilter("all");
    setDeviceSearch("");
    setGroupFilter("all");
    setPlatformFilter("all");
    setStatusFilter("all");
    setCountryFilter("all");
    setTagFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">账号管理</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.info("批量导入功能开发中")}><Upload className="h-4 w-4 mr-1" />批量导入</Button>
          <Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-1" />添加账号</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="总账号数" value={stats.total} icon={<Users className="h-5 w-5 text-primary" />} />
        <StatCard label="正常" value={stats.normal} icon={<CheckCircle2 className="h-5 w-5 text-success" />} />
        <StatCard label="受限" value={stats.restricted} icon={<AlertTriangle className="h-5 w-5 text-warning" />} />
        <StatCard label="封禁" value={stats.banned} icon={<Ban className="h-5 w-5 text-destructive" />} />
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="grid grid-cols-3 gap-x-6 gap-y-3">
          {/* Row 1 */}
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap w-16 shrink-0 text-right">账号</Label>
            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectTrigger><SelectValue placeholder="全部" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {uniqueAccounts.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap w-16 shrink-0 text-right">手机编号</Label>
            <Input placeholder="请输入手机编号" value={deviceSearch} onChange={(e) => setDeviceSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap w-16 shrink-0 text-right">分组</Label>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger><SelectValue placeholder="全部" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {uniqueGroups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap w-16 shrink-0 text-right">账号状态</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="全部" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="正常">正常</SelectItem>
                <SelectItem value="受限">受限</SelectItem>
                <SelectItem value="封禁">封禁</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap w-16 shrink-0 text-right">国家</Label>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger><SelectValue placeholder="全部" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {uniqueCountries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap w-16 shrink-0 text-right">标签</Label>
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger><SelectValue placeholder="全部" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {uniqueTags.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Row 3 */}
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap w-16 shrink-0 text-right">所属平台</Label>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger><SelectValue placeholder="全部" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Instagram">Ins</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap w-16 shrink-0 text-right">发布时间</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="flex-1" />
            <span className="text-muted-foreground text-sm">~</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="flex-1" />
          </div>
        </div>

        {/* Reset & Search */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={handleReset}><RefreshCw className="h-3.5 w-3.5 mr-1" />重置</Button>
          <Button size="sm" onClick={() => toast.info("搜索已应用")}>🔍 搜索</Button>
        </div>

        {/* Batch actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">已选 {selectedIds.size} 项</span>
            <Button variant="outline" size="sm">批量编辑</Button>
            <Button variant="destructive" size="sm">批量删除</Button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setPublishVideoOpen(true)}><Play className="h-3.5 w-3.5 mr-1" />发布视频</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><Settings className="h-3.5 w-3.5 mr-1" />自动养号</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><EyeOff className="h-3.5 w-3.5 mr-1" />隐藏视频</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><Tag className="h-3.5 w-3.5 mr-1" />修改标签</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><FolderOpen className="h-3.5 w-3.5 mr-1" />移动分组</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><Settings className="h-3.5 w-3.5 mr-1" />分组管理</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><RefreshCw className="h-3.5 w-3.5 mr-1" />同步账号数据</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><Download className="h-3.5 w-3.5 mr-1" />导出作品数据</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><ShoppingBag className="h-3.5 w-3.5 mr-1" />添加TAP商品</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><Edit2 className="h-3.5 w-3.5 mr-1" />批量修改标签/分组</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><Monitor className="h-3.5 w-3.5 mr-1" />绑定云机</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><UserPlus className="h-3.5 w-3.5 mr-1" />分配给用户</Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.info("功能开发中")}><Plus className="h-3.5 w-3.5 mr-1" />标签管理</Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>账号</TableHead>
              <TableHead>粉丝</TableHead>
              <TableHead>关注</TableHead>
              <TableHead>点赞</TableHead>
              <TableHead>播放量</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>手机编号</TableHead>
              <TableHead>标签</TableHead>
              <TableHead>分组</TableHead>
              <TableHead>发布时间</TableHead>
              <TableHead>绑定状态</TableHead>
              <TableHead>国家</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((acc) => {
              const sc = statusConfig[acc.status];
              return (
                <TableRow key={acc.id} className="group">
                  <TableCell>
                    <Checkbox checked={selectedIds.has(acc.id)} onCheckedChange={() => toggleSelect(acc.id)} />
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-primary hover:underline text-sm font-medium text-left"
                      onClick={() => setDetailAccount(acc)}
                    >
                      {acc.username}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{formatNumber(acc.followers)}</TableCell>
                  <TableCell className="font-mono text-sm">{acc.following}</TableCell>
                  <TableCell className="font-mono text-sm">{formatNumber(acc.likes)}</TableCell>
                  <TableCell className="font-mono text-sm">{formatNumber(acc.views)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={sc.color}>
                      <span className="flex items-center gap-1">{sc.icon} {acc.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground text-xs">{acc.device || "—"}</TableCell>
                  <TableCell className="text-sm">{acc.tags.join(", ")}</TableCell>
                  <TableCell className="text-sm">{acc.group}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{acc.createdAt || "—"}</TableCell>
                  <TableCell>
                    <span className={`text-sm ${acc.bindStatus === "绑定" ? "text-primary" : "text-muted-foreground"}`}>
                      {acc.bindStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{acc.region}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button className="text-xs text-primary hover:underline whitespace-nowrap" onClick={() => toast.info("账号数据功能开发中")}>账号数据</button>
                      <button className="text-xs text-primary hover:underline whitespace-nowrap" onClick={() => setDetailAccount(acc)}>基本信息</button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-xs text-primary hover:underline whitespace-nowrap">更多</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailAccount(acc)}><Eye className="h-4 w-4 mr-2" />查看详情</DropdownMenuItem>
                          <DropdownMenuItem><Edit2 className="h-4 w-4 mr-2" />编辑</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={14} className="text-center text-muted-foreground py-12">
                  暂无匹配的账号数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <span>共 {filtered.length} 条</span>
        </div>
      </div>

      {/* Dialogs */}
      <AddAccountDialog open={addOpen} onOpenChange={setAddOpen} />
      <AccountDetailDialog account={detailAccount} open={!!detailAccount} onOpenChange={(v) => !v && setDetailAccount(null)} />
      <PublishVideoDialog open={publishVideoOpen} onOpenChange={setPublishVideoOpen} />
    </div>
  );
}
