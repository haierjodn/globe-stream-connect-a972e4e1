import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, RotateCcw, Download, UserPlus, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { RoleAssignUserDialog } from "@/components/RoleAssignUserDialog";

// Menu permission tree structure
interface MenuNode {
  key: string;
  label: string;
  children?: MenuNode[];
}

const menuTree: MenuNode[] = [
  { key: "home", label: "首页" },
  {
    key: "business", label: "业务管理", children: [
      { key: "biz_account", label: "账号管理" },
      { key: "biz_posting", label: "发帖管理" },
      { key: "biz_nurture", label: "养号任务" },
    ]
  },
  {
    key: "ai_leads", label: "AI智能获客", children: [
      { key: "leads_pool", label: "线索池" },
      { key: "leads_crm", label: "客户管理" },
    ]
  },
  {
    key: "assets", label: "素材管理", children: [
      { key: "assets_video", label: "视频素材" },
      { key: "assets_image", label: "图片素材" },
    ]
  },
  {
    key: "ai_video", label: "AI视频创作", children: [
      { key: "video_script", label: "AI脚本" },
      { key: "video_edit", label: "AI剪辑" },
    ]
  },
  {
    key: "device_mgmt", label: "设备管理", children: [
      { key: "device_list", label: "云机列表" },
      { key: "device_ip", label: "IP管理" },
    ]
  },
  {
    key: "package", label: "套餐管理", children: [
      { key: "pkg_bandwidth", label: "带宽套餐" },
      { key: "pkg_billing", label: "计费管理" },
    ]
  },
  {
    key: "live", label: "直播管理", children: [
      { key: "live_room", label: "直播间" },
    ]
  },
  {
    key: "account_mgmt", label: "账户管理", children: [
      { key: "acct_tenant", label: "租户配置" },
    ]
  },
  { key: "openapi", label: "OpenApi" },
  {
    key: "personal", label: "个人中心", children: [
      { key: "personal_info", label: "个人信息" },
    ]
  },
  {
    key: "system", label: "系统管理", children: [
      { key: "sys_dept", label: "部门管理" },
      { key: "sys_role", label: "角色管理" },
      { key: "sys_user", label: "用户管理" },
    ]
  },
];

// Collect all keys from tree
function collectKeys(nodes: MenuNode[]): string[] {
  return nodes.flatMap(n => [n.key, ...(n.children ? collectKeys(n.children) : [])]);
}

function collectChildKeys(node: MenuNode): string[] {
  return node.children ? node.children.flatMap(c => [c.key, ...collectChildKeys(c)]) : [];
}

const allMenuKeys = collectKeys(menuTree);

interface RoleItem {
  id: string;
  name: string;
  sort: number;
  status: boolean;
  permissions: string[];
  remark: string;
  createdAt: string;
  builtIn: boolean;
}

const defaultRoles: RoleItem[] = [
  { id: "SR-001", name: "管理员", sort: 1, status: true, permissions: [...allMenuKeys], remark: "", createdAt: "2025-09-04 10:19:17", builtIn: true },
  { id: "SR-002", name: "运营团队", sort: 1, status: true, permissions: ["home", "business", "biz_account", "biz_posting", "biz_nurture", "device_mgmt", "device_list", "device_ip"], remark: "", createdAt: "2026-01-09 14:09:55", builtIn: false },
  { id: "SR-003", name: "租户管理员", sort: 1, status: true, permissions: ["home", "business", "biz_account", "biz_posting", "device_mgmt", "device_list", "ai_leads", "leads_pool", "leads_crm", "package", "pkg_billing"], remark: "", createdAt: "2026-01-19 14:48:27", builtIn: false },
  { id: "SR-004", name: "租户普通用户", sort: 1, status: true, permissions: ["home", "business", "biz_account", "biz_posting"], remark: "", createdAt: "2026-03-04 10:04:43", builtIn: false },
  { id: "SR-005", name: "获客专员", sort: 1, status: true, permissions: ["home", "ai_leads", "leads_pool", "leads_crm"], remark: "", createdAt: "2026-03-04 10:24:26", builtIn: false },
  { id: "SR-006", name: "体验权限", sort: 31, status: true, permissions: ["home"], remark: "", createdAt: "2026-01-16 09:36:10", builtIn: false },
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
  const [formRemark, setFormRemark] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignRole, setAssignRole] = useState<RoleItem | null>(null);
  // Menu tree state
  const [treeExpanded, setTreeExpanded] = useState<Set<string>>(new Set());
  const [parentChildLink, setParentChildLink] = useState(true);

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
    setFormName(""); setFormSort("1"); setFormStatus(true); setFormPerms([]); setFormRemark("");
    setTreeExpanded(new Set());
    setDialogOpen(true);
  };

  const openEdit = (role: RoleItem) => {
    setEditingRole(role);
    setFormName(role.name); setFormSort(String(role.sort)); setFormStatus(role.status);
    setFormPerms([...role.permissions]); setFormRemark(role.remark || "");
    // Auto-expand parents that have checked children
    const expandSet = new Set<string>();
    menuTree.forEach(node => {
      if (node.children) {
        const childKeys = collectChildKeys(node);
        if (childKeys.some(k => role.permissions.includes(k))) expandSet.add(node.key);
      }
    });
    setTreeExpanded(expandSet);
    setDialogOpen(true);
  };

  const toggleMenuPerm = (node: MenuNode) => {
    const isChecked = formPerms.includes(node.key);
    setFormPerms(prev => {
      let next = [...prev];
      if (isChecked) {
        // Uncheck this node
        next = next.filter(k => k !== node.key);
        // If parent-child linked, also uncheck all children
        if (parentChildLink && node.children) {
          const childKeys = collectChildKeys(node);
          next = next.filter(k => !childKeys.includes(k));
        }
      } else {
        // Check this node
        next.push(node.key);
        // If parent-child linked, also check all children
        if (parentChildLink && node.children) {
          const childKeys = collectChildKeys(node);
          childKeys.forEach(k => { if (!next.includes(k)) next.push(k); });
        }
      }
      // If parent-child linked, update parent state
      if (parentChildLink) {
        menuTree.forEach(parent => {
          if (parent.children) {
            const childKeys = parent.children.map(c => c.key);
            const anyChecked = childKeys.some(k => next.includes(k));
            if (anyChecked && !next.includes(parent.key)) next.push(parent.key);
            if (!anyChecked) next = next.filter(k => k !== parent.key);
          }
        });
      }
      return next;
    });
  };

  const getNodeCheckState = (node: MenuNode): "checked" | "unchecked" | "indeterminate" => {
    if (!node.children) return formPerms.includes(node.key) ? "checked" : "unchecked";
    const childKeys = collectChildKeys(node);
    const checkedCount = childKeys.filter(k => formPerms.includes(k)).length;
    if (checkedCount === 0) return formPerms.includes(node.key) ? "checked" : "unchecked";
    if (checkedCount === childKeys.length) return "checked";
    return "indeterminate";
  };

  const toggleTreeExpand = (key: string) => {
    setTreeExpanded(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const expandAllTree = () => {
    const allParents = menuTree.filter(n => n.children).map(n => n.key);
    setTreeExpanded(prev => prev.size === allParents.length ? new Set() : new Set(allParents));
  };

  const selectAllPerms = () => {
    setFormPerms(prev => prev.length === allMenuKeys.length ? [] : [...allMenuKeys]);
  };

  const handleSave = () => {
    if (!formName.trim()) { toast.error("请输入角色名称"); return; }
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? {
        ...r, name: formName.trim(), sort: Number(formSort) || 1, status: formStatus, permissions: formPerms, remark: formRemark,
      } : r));
      toast.success("角色已更新");
    } else {
      const now = new Date();
      const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setRoles(prev => [...prev, {
        id: `SR-${Date.now()}`, name: formName.trim(), sort: Number(formSort) || 1,
        status: formStatus, permissions: formPerms, remark: formRemark, createdAt: ts, builtIn: false,
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

  const handleExport = () => {
    const exportData = selectedIds.size > 0
      ? filtered.filter(r => selectedIds.has(r.id))
      : filtered;
    if (exportData.length === 0) { toast.error("没有可导出的数据"); return; }
    const header = ["角色名称", "显示顺序", "状态", "创建时间"];
    const rows = exportData.map(r => [r.name, r.sort, r.status ? "正常" : "停用", r.createdAt]);
    const csvContent = "\uFEFF" + [header, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `角色管理_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`已导出 ${exportData.length} 条数据`);
  };

  const renderMenuTree = (nodes: MenuNode[], level = 0) => {
    return nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = treeExpanded.has(node.key);
      const checkState = getNodeCheckState(node);
      return (
        <div key={node.key}>
          <div
            className={`flex items-center gap-1 py-1.5 px-2 hover:bg-muted/50 cursor-pointer ${level === 0 && hasChildren ? "bg-muted/30" : ""}`}
            style={{ paddingLeft: `${level * 20 + 8}px` }}
          >
            {hasChildren ? (
              <button onClick={() => toggleTreeExpand(node.key)} className="p-0.5 shrink-0">
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
            ) : (
              <span className="w-[18px] shrink-0" />
            )}
            <Checkbox
              checked={checkState === "checked" ? true : checkState === "indeterminate" ? "indeterminate" : false}
              onCheckedChange={() => toggleMenuPerm(node)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary"
            />
            <span className="text-sm ml-1" onClick={() => toggleMenuPerm(node)}>{node.label}</span>
          </div>
          {hasChildren && isExpanded && renderMenuTree(node.children!, level + 1)}
        </div>
      );
    });
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
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" />导出</Button>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? "修改角色" : "新建角色"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* 角色名称 */}
            <div className="flex items-center gap-4">
              <Label className="w-20 text-right shrink-0"><span className="text-destructive">*</span> 角色名称</Label>
              <Input className="flex-1" value={formName} onChange={e => setFormName(e.target.value)} placeholder="请输入角色名称" />
            </div>
            {/* 角色顺序 */}
            <div className="flex items-center gap-4">
              <Label className="w-20 text-right shrink-0"><span className="text-destructive">*</span> 角色顺序</Label>
              <Input type="number" className="flex-1" value={formSort} onChange={e => setFormSort(e.target.value)} />
            </div>
            {/* 状态 */}
            <div className="flex items-center gap-4">
              <Label className="w-20 text-right shrink-0">状态</Label>
              <RadioGroup value={formStatus ? "正常" : "停用"} onValueChange={v => setFormStatus(v === "正常")} className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="正常" id="role-status-normal" />
                  <Label htmlFor="role-status-normal" className="text-sm font-normal text-primary cursor-pointer">正常</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="停用" id="role-status-disabled" />
                  <Label htmlFor="role-status-disabled" className="text-sm font-normal cursor-pointer">停用</Label>
                </div>
              </RadioGroup>
            </div>
            {/* 菜单权限 */}
            <div className="flex items-start gap-4">
              <Label className="w-20 text-right shrink-0 pt-1">菜单权限</Label>
              <div className="flex-1 space-y-2">
                {/* Toolbar */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <Checkbox onCheckedChange={expandAllTree} checked={treeExpanded.size === menuTree.filter(n => n.children).length} />
                    展开/折叠
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <Checkbox checked={formPerms.length === allMenuKeys.length} onCheckedChange={selectAllPerms} />
                    全选/全不选
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <Checkbox checked={parentChildLink} onCheckedChange={v => setParentChildLink(!!v)} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <span className="text-primary font-medium">父子联动</span>
                  </label>
                </div>
                {/* Tree */}
                <div className="border rounded-md max-h-[320px] overflow-y-auto">
                  {renderMenuTree(menuTree)}
                </div>
              </div>
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
          <p className="text-sm text-muted-foreground">确定要删除角色「{deletingRole?.name}」吗？</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign User Dialog */}
      <RoleAssignUserDialog open={assignOpen} onOpenChange={setAssignOpen} roleName={assignRole?.name || ""} />
    </div>
  );
}
