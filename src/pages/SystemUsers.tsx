import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, RotateCcw, Download, Key } from "lucide-react";
import { toast } from "sonner";

interface SystemUser {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: boolean;
  lastLogin: string;
  createdAt: string;
}

const mockUsers: SystemUser[] = [
  { id: "U-001", name: "zhangwei", nickname: "张伟", email: "zhangwei@company.com", phone: "138****1234", department: "运营部", role: "运营团队", status: true, lastLogin: "2026-03-18 09:30", createdAt: "2025-12-01 10:00:00" },
  { id: "U-002", name: "lina", nickname: "李娜", email: "lina@company.com", phone: "139****5678", department: "运营部", role: "租户普通用户", status: true, lastLogin: "2026-03-18 08:15", createdAt: "2026-01-10 14:30:00" },
  { id: "U-003", name: "wangfang", nickname: "王芳", email: "wangfang@company.com", phone: "137****9012", department: "运营部", role: "租户普通用户", status: true, lastLogin: "2026-03-17 17:45", createdAt: "2026-01-15 09:00:00" },
  { id: "U-004", name: "zhaoming", nickname: "赵明", email: "zhaoming@company.com", phone: "136****3456", department: "技术部", role: "管理员", status: true, lastLogin: "2026-03-18 10:00", createdAt: "2025-11-20 08:00:00" },
  { id: "U-005", name: "liuyang", nickname: "刘洋", email: "liuyang@company.com", phone: "135****7890", department: "技术部", role: "租户普通用户", status: false, lastLogin: "2026-03-10 14:20", createdAt: "2026-02-01 16:00:00" },
  { id: "U-006", name: "wanglei", nickname: "王磊", email: "wanglei@company.com", phone: "133****2345", department: "销售部", role: "获客专员", status: true, lastLogin: "2026-03-18 07:50", createdAt: "2026-01-20 11:30:00" },
  { id: "U-007", name: "chenjing", nickname: "陈静", email: "chenjing@company.com", phone: "132****6789", department: "销售部", role: "租户管理员", status: true, lastLogin: "2026-03-17 16:30", createdAt: "2025-12-15 13:00:00" },
  { id: "U-008", name: "zhoujie", nickname: "周杰", email: "zhoujie@company.com", phone: "131****0123", department: "销售部", role: "租户普通用户", status: true, lastLogin: "2026-03-16 11:00", createdAt: "2026-02-20 09:30:00" },
  { id: "U-009", name: "admin", nickname: "超级管理员", email: "admin@seaisee.com", phone: "130****0001", department: "总部", role: "管理员", status: true, lastLogin: "2026-03-18 10:15", createdAt: "2025-01-01 00:00:00" },
];

const deptOptions = ["全部", "总部", "运营部", "技术部", "销售部"];
const statusOptions = ["全部", "启用", "停用"];

export default function SystemUsers() {
  const [users, setUsers] = useState<SystemUser[]>(mockUsers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [deptFilter, setDeptFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<SystemUser | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formNickname, setFormNickname] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDept, setFormDept] = useState("运营部");
  const [formRole, setFormRole] = useState("租户普通用户");
  const [formStatus, setFormStatus] = useState(true);
  const [formPassword, setFormPassword] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = users.filter(u => {
    if (searchName && !u.name.includes(searchName) && !u.nickname.includes(searchName)) return false;
    if (searchPhone && !u.phone.includes(searchPhone)) return false;
    if (deptFilter !== "全部" && u.department !== deptFilter) return false;
    if (statusFilter === "启用" && !u.status) return false;
    if (statusFilter === "停用" && u.status) return false;
    if (dateStart && u.createdAt < dateStart) return false;
    if (dateEnd && u.createdAt > dateEnd + " 23:59:59") return false;
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
    if (selectedIds.size === paged.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map(u => u.id)));
  };

  const openAdd = () => {
    setEditingUser(null);
    setFormName(""); setFormNickname(""); setFormEmail(""); setFormPhone(""); setFormPassword("");
    setFormDept("运营部"); setFormRole("租户普通用户"); setFormStatus(true);
    setDialogOpen(true);
  };

  const openEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormName(user.name); setFormNickname(user.nickname); setFormEmail(user.email); setFormPhone(user.phone);
    setFormDept(user.department); setFormRole(user.role); setFormStatus(user.status); setFormPassword("");
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formNickname.trim()) { toast.error("请填写必填字段"); return; }
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u, name: formName.trim(), nickname: formNickname.trim(), email: formEmail.trim(),
        phone: formPhone, department: formDept, role: formRole, status: formStatus,
      } : u));
      toast.success("用户已更新");
    } else {
      const now = new Date();
      const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setUsers(prev => [...prev, {
        id: `U-${Date.now()}`, name: formName.trim(), nickname: formNickname.trim(),
        email: formEmail.trim(), phone: formPhone, department: formDept, role: formRole,
        status: formStatus, lastLogin: "-", createdAt: ts,
      }]);
      toast.success("用户已创建");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingUser) {
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      toast.success("用户已删除");
    }
    setDeleteOpen(false);
  };

  const handleReset = () => {
    setSearchName(""); setSearchPhone(""); setDeptFilter("全部"); setStatusFilter("全部");
    setDateStart(""); setDateEnd("");
  };

  const roleOptions = ["管理员", "运营团队", "租户管理员", "租户普通用户", "获客专员", "体验权限"];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">用户管理</h1>

      {/* Search bar */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">用户名称</Label>
            <Input className="w-48" placeholder="请输入用户名称" value={searchName} onChange={e => setSearchName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">手机号码</Label>
            <Input className="w-40" placeholder="请输入手机号码" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">部门</Label>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>{deptOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">状态</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>{statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">创建时间</Label>
            <div className="flex items-center gap-2">
              <Input type="date" className="w-36" value={dateStart} onChange={e => setDateStart(e.target.value)} />
              <span className="text-muted-foreground">-</span>
              <Input type="date" className="w-36" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
            </div>
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
              <TableHead>用户名称</TableHead>
              <TableHead>用户昵称</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>手机号码</TableHead>
              <TableHead className="w-24 text-center">状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-40 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map(user => (
              <TableRow key={user.id}>
                <TableCell className="text-center">
                  <Checkbox checked={selectedIds.has(user.id)} onCheckedChange={() => toggleSelect(user.id)} />
                </TableCell>
                <TableCell className="font-medium text-sm">{user.name}</TableCell>
                <TableCell className="text-sm">{user.nickname}</TableCell>
                <TableCell className="text-sm">{user.department}</TableCell>
                <TableCell className="text-sm">{user.phone}</TableCell>
                <TableCell className="text-center">
                  <Switch checked={user.status} onCheckedChange={() => {
                    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: !u.status } : u));
                  }} className="data-[state=checked]:bg-primary" />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => openEdit(user)} title="编辑">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                      onClick={() => { setDeletingUser(user); setDeleteOpen(true); }} title="删除">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary"
                      onClick={() => toast.info("重置密码功能开发中")} title="重置密码">
                      <Key className="h-3.5 w-3.5" />
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
            <DialogTitle>{editingUser ? "编辑用户" : "添加用户"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>用户名称 *</Label>
                <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="请输入用户名称" />
              </div>
              <div className="space-y-2">
                <Label>用户昵称 *</Label>
                <Input value={formNickname} onChange={e => setFormNickname(e.target.value)} placeholder="请输入用户昵称" />
              </div>
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label>登录密码 *</Label>
                <Input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="请输入登录密码" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>邮箱</Label>
                <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="请输入邮箱" />
              </div>
              <div className="space-y-2">
                <Label>手机号码</Label>
                <Input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="请输入手机号码" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>归属部门</Label>
                <Select value={formDept} onValueChange={setFormDept}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["总部", "运营部", "技术部", "销售部"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>角色</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <div className="flex items-center gap-2">
                <Switch checked={formStatus} onCheckedChange={setFormStatus} className="data-[state=checked]:bg-primary" />
                <span className="text-sm">{formStatus ? "启用" : "停用"}</span>
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
          <p className="text-sm text-muted-foreground">确定要删除用户「{deletingUser?.nickname}」吗？</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
