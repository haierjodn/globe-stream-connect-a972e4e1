import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, RotateCcw, Download, Key, Shield, X, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface SystemUser {
  id: string;
  name: string;
  nickname: string;
  tenant: string;
  email: string;
  phone: string;
  department: string;
  roles: string[];
  gender: string;
  dataPermission: string;
  remark: string;
  status: boolean;
  lastLogin: string;
  createdAt: string;
}

const mockUsers: SystemUser[] = [
  { id: "U-001", name: "zhangwei", nickname: "张伟", tenant: "环球贸易科技有限公司", email: "zhangwei@company.com", phone: "138****1234", department: "运营部", roles: ["运营团队"], gender: "男", dataPermission: "本部门", remark: "", status: true, lastLogin: "2026-03-18 09:30", createdAt: "2025-12-01 10:00:00" },
  { id: "U-002", name: "lina", nickname: "李娜", tenant: "环球贸易科技有限公司", email: "lina@company.com", phone: "139****5678", department: "运营部", roles: ["租户普通用户"], gender: "女", dataPermission: "本人", remark: "", status: true, lastLogin: "2026-03-18 08:15", createdAt: "2026-01-10 14:30:00" },
  { id: "U-003", name: "wangfang", nickname: "王芳", tenant: "环球贸易科技有限公司", email: "wangfang@company.com", phone: "137****9012", department: "运营部", roles: ["租户普通用户"], gender: "女", dataPermission: "本人", remark: "", status: true, lastLogin: "2026-03-17 17:45", createdAt: "2026-01-15 09:00:00" },
  { id: "U-004", name: "zhaoming", nickname: "赵明", tenant: "深圳智联电子商务", email: "zhaoming@company.com", phone: "136****3456", department: "技术部", roles: ["管理员"], gender: "男", dataPermission: "全部", remark: "", status: true, lastLogin: "2026-03-18 10:00", createdAt: "2025-11-20 08:00:00" },
  { id: "U-005", name: "liuyang", nickname: "刘洋", tenant: "深圳智联电子商务", email: "liuyang@company.com", phone: "135****7890", department: "技术部", roles: ["租户普通用户"], gender: "男", dataPermission: "本人", remark: "", status: false, lastLogin: "2026-03-10 14:20", createdAt: "2026-02-01 16:00:00" },
  { id: "U-006", name: "wanglei", nickname: "王磊", tenant: "广州跨境优品", email: "wanglei@company.com", phone: "133****2345", department: "销售部", roles: ["获客专员"], gender: "男", dataPermission: "本部门", remark: "", status: true, lastLogin: "2026-03-18 07:50", createdAt: "2026-01-20 11:30:00" },
  { id: "U-007", name: "chenjing", nickname: "陈静", tenant: "广州跨境优品", email: "chenjing@company.com", phone: "132****6789", department: "销售部", roles: ["租户管理员"], gender: "女", dataPermission: "本部门及以下", remark: "", status: true, lastLogin: "2026-03-17 16:30", createdAt: "2025-12-15 13:00:00" },
  { id: "U-008", name: "zhoujie", nickname: "周杰", tenant: "广州跨境优品", email: "zhoujie@company.com", phone: "131****0123", department: "销售部", roles: ["租户普通用户"], gender: "男", dataPermission: "本人", remark: "", status: true, lastLogin: "2026-03-16 11:00", createdAt: "2026-02-20 09:30:00" },
  { id: "U-009", name: "admin", nickname: "超级管理员", tenant: "平台", email: "admin@seaisee.com", phone: "130****0001", department: "总部", roles: ["管理员", "体验权限"], gender: "男", dataPermission: "超级管理员", remark: "", status: true, lastLogin: "2026-03-18 10:15", createdAt: "2025-01-01 00:00:00" },
];

const deptOptions = ["全部", "总部", "运营部", "技术部", "销售部"];
const statusOptions = ["全部", "启用", "停用"];
const roleOptions = ["管理员", "运营团队", "租户管理员", "租户普通用户", "获客专员", "体验权限"];
const genderOptions = ["男", "女"];
const dataPermOptions = ["超级管理员", "全部", "本部门及以下", "本部门", "本人"];

// Assign Role Dialog (similar to RoleAssignUserDialog)
function AssignRoleDialog({ open, onOpenChange, userName }: { open: boolean; onOpenChange: (v: boolean) => void; userName: string }) {
  const [searchRole, setSearchRole] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [rolePage, setRolePage] = useState(1);
  const rolePageSize = 10;

  const allRoles = [
    { id: "SR-001", name: "管理员", sort: 1, status: true, createdAt: "2025-09-04 10:19:17" },
    { id: "SR-002", name: "运营团队", sort: 1, status: true, createdAt: "2026-01-09 14:09:55" },
    { id: "SR-003", name: "租户管理员", sort: 1, status: true, createdAt: "2026-01-19 14:48:27" },
    { id: "SR-004", name: "租户普通用户", sort: 1, status: true, createdAt: "2026-03-04 10:04:43" },
    { id: "SR-005", name: "获客专员", sort: 1, status: true, createdAt: "2026-03-04 10:24:26" },
    { id: "SR-006", name: "体验权限", sort: 31, status: true, createdAt: "2026-01-16 09:36:10" },
  ];

  const filtered = useMemo(() => allRoles.filter(r => !searchRole.trim() || r.name.includes(searchRole.trim())), [searchRole]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / rolePageSize));
  const paged = filtered.slice((rolePage - 1) * rolePageSize, rolePage * rolePageSize);

  const toggleRole = (id: string) => {
    setSelectedRoles(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAllRoles = () => {
    if (paged.every(r => selectedRoles.has(r.id))) {
      setSelectedRoles(prev => { const n = new Set(prev); paged.forEach(r => n.delete(r.id)); return n; });
    } else {
      setSelectedRoles(prev => { const n = new Set(prev); paged.forEach(r => n.add(r.id)); return n; });
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { setSelectedRoles(new Set()); setSearchRole(""); } onOpenChange(v); }}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader><DialogTitle>分配角色 - {userName}</DialogTitle></DialogHeader>
        <div className="flex items-center gap-4 flex-wrap">
          <Label className="shrink-0 text-sm text-muted-foreground">角色名称</Label>
          <Input placeholder="请输入角色名称" value={searchRole} onChange={e => { setSearchRole(e.target.value); setRolePage(1); }} className="max-w-[200px]" />
          <Button variant="outline" size="sm" onClick={() => { setSearchRole(""); setRolePage(1); }}><RotateCcw className="h-3.5 w-3.5 mr-1" />重置</Button>
          <Button size="sm" onClick={() => setRolePage(1)}><Search className="h-3.5 w-3.5 mr-1" />搜索</Button>
        </div>
        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px] text-center"><Checkbox checked={paged.length > 0 && paged.every(r => selectedRoles.has(r.id))} onCheckedChange={toggleAllRoles} /></TableHead>
                <TableHead>角色名称</TableHead>
                <TableHead className="text-center">显示顺序</TableHead>
                <TableHead className="text-center">状态</TableHead>
                <TableHead>创建时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map(r => (
                <TableRow key={r.id} className={selectedRoles.has(r.id) ? "bg-primary/5" : "cursor-pointer"} onClick={() => toggleRole(r.id)}>
                  <TableCell className="text-center"><Checkbox checked={selectedRoles.has(r.id)} onCheckedChange={() => toggleRole(r.id)} /></TableCell>
                  <TableCell className="text-sm font-medium">{r.name}</TableCell>
                  <TableCell className="text-center font-mono text-sm">{r.sort}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={r.status ? "border-green-500 text-green-600 bg-green-50" : ""}>
                      {r.status ? "正常" : "停用"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.createdAt}</TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">暂无数据</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-start gap-2 pt-1 text-sm text-muted-foreground">
          <span>共 {filtered.length} 条</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={rolePage <= 1} onClick={() => setRolePage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="default" size="sm" className="h-8 w-8 p-0">{rolePage}</Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={rolePage >= totalPages} onClick={() => setRolePage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <DialogFooter>
          <Button onClick={() => { if (selectedRoles.size === 0) { toast.error("请至少选择一个角色"); return; } toast.success(`已为「${userName}」分配 ${selectedRoles.size} 个角色`); setSelectedRoles(new Set()); onOpenChange(false); }}>确定</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  const [formNickname, setFormNickname] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDept, setFormDept] = useState("运营部");
  const [formRoles, setFormRoles] = useState<string[]>([]);
  const [formGender, setFormGender] = useState("男");
  const [formDataPerm, setFormDataPerm] = useState("本人");
  const [formStatus, setFormStatus] = useState(true);
  const [formRemark, setFormRemark] = useState("");
  const [formPassword, setFormPassword] = useState("");

  // Reset password
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetUser, setResetUser] = useState<SystemUser | null>(null);
  const [resetSuccessOpen, setResetSuccessOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Assign role
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [assignRoleUser, setAssignRoleUser] = useState<SystemUser | null>(null);

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
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selectedIds.size === paged.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map(u => u.id)));
  };

  const openAdd = () => {
    setEditingUser(null);
    setFormNickname(""); setFormEmail(""); setFormPhone(""); setFormPassword("");
    setFormDept("运营部"); setFormRoles([]); setFormGender("男"); setFormDataPerm("本人");
    setFormStatus(true); setFormRemark("");
    setDialogOpen(true);
  };

  const openEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormNickname(user.nickname); setFormEmail(user.email); setFormPhone(user.phone);
    setFormDept(user.department); setFormRoles([...user.roles]); setFormGender(user.gender);
    setFormDataPerm(user.dataPermission); setFormStatus(user.status); setFormRemark(user.remark);
    setFormPassword("");
    setDialogOpen(true);
  };

  const removeFormRole = (role: string) => {
    setFormRoles(prev => prev.filter(r => r !== role));
  };
  const addFormRole = (role: string) => {
    if (role && !formRoles.includes(role)) setFormRoles(prev => [...prev, role]);
  };

  const handleSave = () => {
    if (!formNickname.trim()) { toast.error("请填写用户昵称"); return; }
    if (!formPhone.trim()) { toast.error("请填写手机号码"); return; }
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u, nickname: formNickname.trim(), email: formEmail.trim(),
        phone: formPhone, department: formDept, roles: formRoles, gender: formGender,
        dataPermission: formDataPerm, status: formStatus, remark: formRemark,
      } : u));
      toast.success("用户已更新");
    } else {
      const now = new Date();
      const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setUsers(prev => [...prev, {
        id: `U-${Date.now()}`, name: formNickname.trim().toLowerCase().replace(/\s/g, ""), nickname: formNickname.trim(),
        tenant: "环球贸易科技有限公司", email: formEmail.trim(), phone: formPhone, department: formDept, roles: formRoles,
        gender: formGender, dataPermission: formDataPerm, status: formStatus, remark: formRemark,
        lastLogin: "-", createdAt: ts,
      }]);
      toast.success("用户已创建");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingUser) { setUsers(prev => prev.filter(u => u.id !== deletingUser.id)); toast.success("用户已删除"); }
    setDeleteOpen(false);
  };

  const handleResetConfirm = () => {
    const pwd = Math.random().toString(36).slice(-8);
    setNewPassword(pwd);
    setResetConfirmOpen(false);
    setResetSuccessOpen(true);
  };

  const handleReset = () => {
    setSearchName(""); setSearchPhone(""); setDeptFilter("全部"); setStatusFilter("全部");
    setDateStart(""); setDateEnd("");
  };

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
              <TableHead>所属租户</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>手机号码</TableHead>
              <TableHead className="w-24 text-center">状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-48 text-right">操作</TableHead>
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
                <TableCell className="text-sm">{user.tenant}</TableCell>
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
                      onClick={() => { setResetUser(user); setResetConfirmOpen(true); }} title="重置密码">
                      <Key className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary"
                      onClick={() => { setAssignRoleUser(user); setAssignRoleOpen(true); }} title="分配角色">
                      <Shield className="h-3.5 w-3.5" />
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingUser ? "修改用户" : "添加用户"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* 用户昵称 + 归属部门 */}
            <div className="flex items-center gap-4">
              <Label className="w-20 text-right shrink-0"><span className="text-destructive">*</span> 用户昵称</Label>
              <Input className="flex-1" value={formNickname} onChange={e => setFormNickname(e.target.value)} placeholder="请输入用户昵称" />
              <Label className="w-20 text-right shrink-0"><span className="text-destructive">*</span> 归属部门</Label>
              <Select value={formDept} onValueChange={setFormDept}>
                <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["总部", "运营部", "技术部", "销售部"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* 手机号码 + 邮箱 */}
            <div className="flex items-center gap-4">
              <Label className="w-20 text-right shrink-0"><span className="text-destructive">*</span> 手机号码</Label>
              <Input className="flex-1" value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="请输入手机号码" />
              <Label className="w-20 text-right shrink-0">邮箱</Label>
              <Input className="flex-1" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="请输入邮箱" />
            </div>
            {/* 用户性别 + 状态 */}
            <div className="flex items-center gap-4">
              <Label className="w-20 text-right shrink-0">用户性别</Label>
              <Select value={formGender} onValueChange={setFormGender}>
                <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {genderOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
              <Label className="w-20 text-right shrink-0">状态</Label>
              <RadioGroup value={formStatus ? "正常" : "停用"} onValueChange={v => setFormStatus(v === "正常")} className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="正常" id="user-status-normal" />
                  <Label htmlFor="user-status-normal" className="text-sm font-normal text-primary cursor-pointer">正常</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="停用" id="user-status-disabled" />
                  <Label htmlFor="user-status-disabled" className="text-sm font-normal cursor-pointer">停用</Label>
                </div>
              </RadioGroup>
            </div>
            {/* 角色 (multi-select with tags) + 数据权限 */}
            <div className="flex items-center gap-4">
              <Label className="w-20 text-right shrink-0"><span className="text-destructive">*</span> 角色</Label>
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-1 border rounded-md px-2 py-1.5 min-h-[36px]">
                  {formRoles.map(r => (
                    <Badge key={r} variant="secondary" className="gap-1 pr-1">
                      {r}
                      <button onClick={() => removeFormRole(r)} className="hover:bg-muted rounded-full p-0.5"><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                  <Select value="" onValueChange={addFormRole}>
                    <SelectTrigger className="border-0 shadow-none h-6 w-auto min-w-[60px] p-0 text-muted-foreground text-sm">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.filter(r => !formRoles.includes(r)).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Label className="w-20 text-right shrink-0"><span className="text-destructive">*</span> 数据权限</Label>
              <Select value={formDataPerm} onValueChange={setFormDataPerm}>
                <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {dataPermOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* 备注 */}
            <div className="flex items-start gap-4">
              <Label className="w-20 text-right shrink-0 pt-2">备注</Label>
              <Textarea className="flex-1" placeholder="请输入内容" value={formRemark} onChange={e => setFormRemark(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>确 定</Button>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取 消</Button>
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

      {/* Reset Password Confirm */}
      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>提示</DialogTitle></DialogHeader>
          <div className="flex items-center gap-3 py-2">
            <AlertCircle className="h-6 w-6 text-primary shrink-0" />
            <span className="text-sm">确定要重置密码吗？</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>取消</Button>
            <Button onClick={handleResetConfirm}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Success */}
      <Dialog open={resetSuccessOpen} onOpenChange={setResetSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>重置密码成功</DialogTitle></DialogHeader>
          <div className="flex items-center gap-3 py-2">
            <span className="text-sm shrink-0">新密码为：</span>
            <Input readOnly value={newPassword} className="flex-1 bg-muted" />
            <Button size="sm" onClick={() => { navigator.clipboard.writeText(newPassword); toast.success("密码已复制"); }}>复制密码</Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setResetSuccessOpen(false)}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <AssignRoleDialog open={assignRoleOpen} onOpenChange={setAssignRoleOpen} userName={assignRoleUser?.nickname || ""} />
    </div>
  );
}
