import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Permission modules
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
  type: "平台超级管理员" | "平台运营" | "租户管理员" | "租户普通用户";
  description: string;
  permissions: string[];
  memberCount: number;
  builtIn: boolean;
}

const defaultRoles: RoleItem[] = [
  {
    id: "SR-001", name: "平台超级管理员", type: "平台超级管理员",
    description: "所有权限（配置、运营、租户、数据），唯一能改系统核心规则",
    permissions: [...allPermKeys], memberCount: 2, builtIn: true,
  },
  {
    id: "SR-002", name: "平台运营", type: "平台运营",
    description: "租户管理、云机分配",
    permissions: ["tenant", "device", "ip", "operations"], memberCount: 4, builtIn: true,
  },
  {
    id: "SR-003", name: "租户管理员", type: "租户管理员",
    description: "管理本租户下的子用户、云机、任务，查看本租户数据",
    permissions: ["device", "ip", "account", "posting", "crm", "billing", "data"], memberCount: 8, builtIn: true,
  },
  {
    id: "SR-004", name: "租户普通用户", type: "租户普通用户",
    description: "仅能使用被分配的云机、执行被授权的任务（无管理权限）",
    permissions: ["account", "posting"], memberCount: 15, builtIn: false,
  },
];

const roleTypes: RoleItem["type"][] = ["平台超级管理员", "平台运营", "租户管理员", "租户普通用户"];

const typeColorMap: Record<string, string> = {
  "平台超级管理员": "bg-destructive/10 text-destructive border-destructive/20",
  "平台运营": "bg-primary/10 text-primary border-primary/20",
  "租户管理员": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "租户普通用户": "bg-muted text-muted-foreground border-border",
};

export default function SystemRoles() {
  const [roles, setRoles] = useState<RoleItem[]>(defaultRoles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<RoleItem["type"]>("租户普通用户");
  const [formDesc, setFormDesc] = useState("");
  const [formPerms, setFormPerms] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);

  const openAdd = () => {
    setEditingRole(null);
    setFormName("");
    setFormType("租户普通用户");
    setFormDesc("");
    setFormPerms([]);
    setDialogOpen(true);
  };

  const openEdit = (role: RoleItem) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormType(role.type);
    setFormDesc(role.description);
    setFormPerms([...role.permissions]);
    setDialogOpen(true);
  };

  const togglePerm = (key: string) => {
    setFormPerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  const handleSave = () => {
    if (!formName.trim()) { toast.error("请输入角色名称"); return; }
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? {
        ...r, name: formName.trim(), type: formType, description: formDesc, permissions: formPerms,
      } : r));
      toast.success("角色已更新");
    } else {
      setRoles(prev => [...prev, {
        id: `SR-${Date.now()}`, name: formName.trim(), type: formType,
        description: formDesc, permissions: formPerms, memberCount: 0, builtIn: false,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">角色管理</h1>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" />新建角色</Button>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">角色名称</TableHead>
              <TableHead className="w-28">角色类型</TableHead>
              <TableHead className="min-w-[200px]">描述</TableHead>
              <TableHead className="w-20 text-center">成员数</TableHead>
              {permModules.map(m => (
                <TableHead key={m.key} className="text-center w-20 text-xs">{m.label}</TableHead>
              ))}
              <TableHead className="w-24 text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={typeColorMap[role.type]}>{role.type}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{role.description}</TableCell>
                <TableCell className="text-center font-mono">{role.memberCount}</TableCell>
                {permModules.map(m => (
                  <TableCell key={m.key} className="text-center">
                    <Checkbox checked={role.permissions.includes(m.key)} disabled />
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(role)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                      disabled={role.builtIn}
                      onClick={() => { setDeletingRole(role); setDeleteOpen(true); }}
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
            <DialogTitle>{editingRole ? "编辑角色" : "新建角色"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>角色名称</Label>
                <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="请输入角色名称" />
              </div>
              <div className="space-y-2">
                <Label>角色类型</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formType}
                  onChange={e => setFormType(e.target.value as RoleItem["type"])}
                >
                  {roleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>描述</Label>
              <Input value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="请输入角色描述" />
            </div>
            <div className="space-y-2">
              <Label>模块权限</Label>
              <div className="grid grid-cols-3 gap-2">
                {permModules.map(m => (
                  <label key={m.key} className="flex items-center gap-2 p-2 rounded-md border hover:bg-muted/50 cursor-pointer text-sm">
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
    </div>
  );
}
