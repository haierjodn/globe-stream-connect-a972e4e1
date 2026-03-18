import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: "启用" | "停用";
  lastLogin: string;
  createdAt: string;
}

const mockUsers: SystemUser[] = [
  { id: "U-001", name: "张伟", email: "zhangwei@company.com", phone: "138****1234", department: "运营部", role: "租户管理员", status: "启用", lastLogin: "2026-03-18 09:30", createdAt: "2025-12-01" },
  { id: "U-002", name: "李娜", email: "lina@company.com", phone: "139****5678", department: "运营部", role: "租户普通用户", status: "启用", lastLogin: "2026-03-18 08:15", createdAt: "2026-01-10" },
  { id: "U-003", name: "王芳", email: "wangfang@company.com", phone: "137****9012", department: "运营部", role: "租户普通用户", status: "启用", lastLogin: "2026-03-17 17:45", createdAt: "2026-01-15" },
  { id: "U-004", name: "赵明", email: "zhaoming@company.com", phone: "136****3456", department: "技术部", role: "平台运营", status: "启用", lastLogin: "2026-03-18 10:00", createdAt: "2025-11-20" },
  { id: "U-005", name: "刘洋", email: "liuyang@company.com", phone: "135****7890", department: "技术部", role: "租户普通用户", status: "停用", lastLogin: "2026-03-10 14:20", createdAt: "2026-02-01" },
  { id: "U-006", name: "王磊", email: "wanglei@company.com", phone: "133****2345", department: "销售部", role: "租户普通用户", status: "启用", lastLogin: "2026-03-18 07:50", createdAt: "2026-01-20" },
  { id: "U-007", name: "陈静", email: "chenjing@company.com", phone: "132****6789", department: "销售部", role: "租户管理员", status: "启用", lastLogin: "2026-03-17 16:30", createdAt: "2025-12-15" },
  { id: "U-008", name: "周杰", email: "zhoujie@company.com", phone: "131****0123", department: "销售部", role: "租户普通用户", status: "启用", lastLogin: "2026-03-16 11:00", createdAt: "2026-02-20" },
  { id: "U-009", name: "admin", email: "admin@seaisee.com", phone: "130****0001", department: "总部", role: "平台超级管理员", status: "启用", lastLogin: "2026-03-18 10:15", createdAt: "2025-01-01" },
];

const deptOptions = ["全部", "总部", "运营部", "技术部", "销售部"];
const roleOptions = ["全部", "平台超级管理员", "平台运营", "租户管理员", "租户普通用户"];
const statusOptions = ["全部", "启用", "停用"];

const roleColorMap: Record<string, string> = {
  "平台超级管理员": "bg-destructive/10 text-destructive border-destructive/20",
  "平台运营": "bg-primary/10 text-primary border-primary/20",
  "租户管理员": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "租户普通用户": "bg-muted text-muted-foreground border-border",
};

export default function SystemUsers() {
  const [users, setUsers] = useState<SystemUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("全部");
  const [roleFilter, setRoleFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<SystemUser | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDept, setFormDept] = useState("运营部");
  const [formRole, setFormRole] = useState("租户普通用户");
  const [formStatus, setFormStatus] = useState<"启用" | "停用">("启用");

  const filtered = users.filter(u => {
    if (search && !u.name.includes(search) && !u.email.includes(search)) return false;
    if (deptFilter !== "全部" && u.department !== deptFilter) return false;
    if (roleFilter !== "全部" && u.role !== roleFilter) return false;
    if (statusFilter !== "全部" && u.status !== statusFilter) return false;
    return true;
  });

  const openAdd = () => {
    setEditingUser(null);
    setFormName(""); setFormEmail(""); setFormPhone("");
    setFormDept("运营部"); setFormRole("租户普通用户"); setFormStatus("启用");
    setDialogOpen(true);
  };

  const openEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormName(user.name); setFormEmail(user.email); setFormPhone(user.phone);
    setFormDept(user.department); setFormRole(user.role); setFormStatus(user.status);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formEmail.trim()) { toast.error("请填写必填字段"); return; }
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u, name: formName.trim(), email: formEmail.trim(), phone: formPhone,
        department: formDept, role: formRole, status: formStatus,
      } : u));
      toast.success("用户已更新");
    } else {
      setUsers(prev => [...prev, {
        id: `U-${Date.now()}`, name: formName.trim(), email: formEmail.trim(), phone: formPhone,
        department: formDept, role: formRole, status: formStatus,
        lastLogin: "-", createdAt: new Date().toISOString().split("T")[0],
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

  const toggleStatus = (user: SystemUser) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === "启用" ? "停用" : "启用" } : u));
    toast.success(`用户已${user.status === "启用" ? "停用" : "启用"}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" />添加用户</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="搜索姓名/邮箱" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>{deptOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{roleOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>{statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>手机号</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>角色</TableHead>
              <TableHead className="text-center">状态</TableHead>
              <TableHead>最近登录</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell className="text-sm">{user.phone}</TableCell>
                <TableCell className="text-sm">{user.department}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleColorMap[user.role] || ""}>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={user.status === "启用" ? "default" : "secondary"}
                    className={user.status === "启用" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.createdAt}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(user)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleStatus(user)}>
                      {user.status === "启用" ? "停用" : "启用"}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                      onClick={() => { setDeletingUser(user); setDeleteOpen(true); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                <Label>姓名 *</Label>
                <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="请输入姓名" />
              </div>
              <div className="space-y-2">
                <Label>邮箱 *</Label>
                <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="请输入邮箱" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>手机号</Label>
                <Input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="请输入手机号" />
              </div>
              <div className="space-y-2">
                <Label>部门</Label>
                <Select value={formDept} onValueChange={setFormDept}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["总部", "运营部", "技术部", "销售部"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>角色</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roleOptions.filter(r => r !== "全部").map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select value={formStatus} onValueChange={v => setFormStatus(v as "启用" | "停用")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="启用">启用</SelectItem>
                    <SelectItem value="停用">停用</SelectItem>
                  </SelectContent>
                </Select>
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
          <p className="text-sm text-muted-foreground">确定要删除用户「{deletingUser?.name}」吗？</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
