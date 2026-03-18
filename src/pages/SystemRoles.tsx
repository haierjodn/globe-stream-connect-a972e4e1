import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, RotateCcw, Download, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { RoleAssignUserDialog } from "@/components/RoleAssignUserDialog";

// Permission modules for edit dialog
const permModules = [
  { key: "config", label: "系统配置" },
  { key: "operations", label: "运营管理" },
  { key: "tenant", label: "租户管理" },
  { key: "device", label: "云机管理" },
  { key: "ip", label: "IP管理" },
  { key: "account", label: "账号管理" },
  { key: "posting", label: "发帖管理" },
  { key: "crm", label: "CRM" },
  { key: "billing", label: "计费统计" },
  { key: "audit", label: "审计日志" },
  { key: "data", label: "数据查看" },
];

const allPermKeys = permModules.map(m => m.key);

interface RoleItem {
  id: string;
  name: string;
  sort: number;
  status: boolean;
  permissions: string[];
  createdAt: string;
  builtIn: boolean;
}

const defaultRoles: RoleItem[] = [
  { id: "SR-001", name: "管理员", sort: 1, status: true, permissions: [...allPermKeys], createdAt: "2025-09-04 10:19:17", builtIn: true },
  { id: "SR-002", name: "运营团队", sort: 1, status: true, permissions: ["device", "ip", "account", "posting", "operations"], createdAt: "2026-01-09 14:09:55", builtIn: false },
  { id: "SR-003", name: "租户管理员", sort: 1, status: true, permissions: ["device", "ip", "account", "posting", "crm", "billing", "data"], createdAt: "2026-01-19 14:48:27", builtIn: false },
  { id: "SR-004", name: "租户普通用户", sort: 1, status: true, permissions: ["account", "posting"], createdAt: "2026-03-04 10:04:43", builtIn: false },
  { id: "SR-005", name: "获客专员", sort: 1, status: true, permissions: ["crm", "data"], createdAt: "2026-03-04 10:24:26", builtIn: false },
  { id: "SR-006", name: "体验权限", sort: 31, status: true, permissions: ["data"], createdAt: "2026-01-16 09:36:10", builtIn: false },
];

export default function SystemRoles() {
  const [roles, setRoles] = useState<RoleItem[]>(defaultRoles);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSort, setFormSort] = useState("1");
  const [formStatus, setFormStatus] = useState(true);
  const [formPerms, setFormPerms] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);
  // Assign user dialog
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignRole, setAssignRole] = useState<RoleItem | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = roles.filter(r => {
    if (searchName && !r.name.includes(searchName)) return false;
    if (statusFilter === "启用" && !r.status) return false;
    if (statusFilter === "停用" && r.status) return false;
    if (dateStart && r.createdAt < dateStart) return false;
    if (dateEnd && r.createdAt > dateEnd + " 23:59:59") return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === paged.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paged.map(r => r.id)));
    }
  };

  const openAdd = () => {
    setEditingRole(null);
    setFormName(""); setFormSort("1"); setFormStatus(true); setFormPerms([]);
    setDialogOpen(true);
  };

  const openEdit = (role: RoleItem) => {
    setEditingRole(role);
    setFormName(role.name); setFormSort(String(role.sort)); setFormStatus(role.status); setFormPerms([...role.permissions]);
    setDialogOpen(true);
  };

  const togglePerm = (key: string) => {
    setFormPerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  const handleSave = () => {
    if (!formName.trim()) { toast.error("请输入角色名称"); return; }
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? {
        ...r, name: formName.trim(), sort: Number(formSort) || 1, status: formStatus, permissions: formPerms,
      } : r));
      toast.success("角色已更新");
    } else {
      const now = new Date();
      const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setRoles(prev => [...prev, {
        id: `SR-${Date.now()}`, name: formName.trim(), sort: Number(formSort) || 1,
        status: formStatus, permissions: formPerms, createdAt: ts, builtIn: false,
      }]);
      toast.success("角色已创建");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingRole) {
      setRoles(prev => prev.filter(r => r.id !== deletingRole.id));
      toast.success("角色已删除");
    }
    setDeleteOpen(false);
  };

  const toggleRoleStatus = (id: string) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r));
  };

  const handleReset = () => {
    setSearchName(""); setStatusFilter("全部"); setDateStart(""); setDateEnd("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">角色管理</h1>

      {/* Search bar */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">角色名称</Label>
            <Input className="w-52" placeholder="请输入角色名称" value={searchName} onChange={e => setSearchName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">创建时间</Label>
            <div className="flex items-center gap-2">
              <Input type="date" className="w-40" value={dateStart} onChange={e => setDateStart(e.target.value)} />
              <span className="text-muted-foreground">-</span>
              <Input type="date" className="w-40" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">状态</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="角色状态" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部</SelectItem>
                <SelectItem value="启用">启用</SelectItem>
                <SelectItem value="停用">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handleReset}><RotateCcw className="h-3.5 w-3.5 mr-1" />重置</Button>
            <Button size="sm"><Search className="h-3.5 w-3.5 mr-1" />搜索</Button>
          </div>
        </div>
      </div>

      {/* Toolbar + Table */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-3 p-4 border-b">
          <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />新增</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("导出功能开发中")}><Download className="h-4 w-4 mr-1" />导出</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">
                <Checkbox checked={paged.length > 0 && selectedIds.size === paged.length} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>角色名称</TableHead>
              <TableHead className="w-28 text-center">显示顺序</TableHead>
              <TableHead className="w-24 text-center">状态</TableHead>
              <TableHead className="w-48">创建时间</TableHead>
              <TableHead className="w-36 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map(role => (
              <TableRow key={role.id}>
                <TableCell className="text-center">
                  <Checkbox checked={selectedIds.has(role.id)} onCheckedChange={() => toggleSelect(role.id)} />
                </TableCell>
                <TableCell className="font-medium text-sm">{role.name}</TableCell>
                <TableCell className="text-center font-mono text-sm">{role.sort}</TableCell>
                <TableCell className="text-center">
                  <Switch checked={role.status} onCheckedChange={() => toggleRoleStatus(role.id)} className="data-[state=checked]:bg-primary" />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{role.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => openEdit(role)} title="编辑">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {!role.builtIn && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                        onClick={() => { setDeletingRole(role); setDeleteOpen(true); }} title="删除">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary"
                      onClick={() => { setAssignRole(role); setAssignOpen(true); }} title="分配用户">
                      <UserPlus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 p-4 border-t text-sm text-muted-foreground">
          <span>共 {filtered.length} 条</span>
          <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10条/页</SelectItem>
              <SelectItem value="20">20条/页</SelectItem>
              <SelectItem value="50">50条/页</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</Button>
            <Button variant="default" size="icon" className="h-8 w-8">{page}</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>›</Button>
          </div>
          <div className="flex items-center gap-1">
            <span>前往</span>
            <Input className="w-14 h-8 text-center" value={page} onChange={e => {
              const v = Number(e.target.value);
              if (v >= 1 && v <= totalPages) setPage(v);
            }} />
            <span>页</span>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRole ? "编辑角色" : "新建角色"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>角色名称</Label>
                <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="请输入角色名称" />
              </div>
              <div className="space-y-2">
                <Label>显示顺序</Label>
                <Input type="number" value={formSort} onChange={e => setFormSort(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <div className="flex items-center gap-2">
                <Switch checked={formStatus} onCheckedChange={setFormStatus} className="data-[state=checked]:bg-primary" />
                <span className="text-sm">{formStatus ? "启用" : "停用"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>菜单权限</Label>
              <div className="grid grid-cols-3 gap-2 p-3 border rounded-md">
                {permModules.map(m => (
                  <label key={m.key} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={formPerms.includes(m.key)} onCheckedChange={() => togglePerm(m.key)} />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>确认删除</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">确定要删除角色「{deletingRole?.name}」吗？</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign User Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>分配用户 - {assignRole?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">为角色「{assignRole?.name}」分配用户的功能正在开发中。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
