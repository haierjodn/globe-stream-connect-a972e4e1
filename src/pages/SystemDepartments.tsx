import { useState } from "react";
import { departments as mockDepartments, type Department } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, ChevronDown, Plus, Pencil, Trash2, ChevronsUpDown, Search, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface DeptNode {
  id: string;
  name: string;
  parentId: string | null;
  memberCount: number;
  sort: number;
  status: "正常" | "停用";
  createdAt: string;
  children?: DeptNode[];
}

function convertDepts(depts: Department[], parentId: string | null = null): DeptNode[] {
  return depts.map(d => ({
    id: d.id,
    name: d.name,
    parentId: d.parentId ?? parentId,
    memberCount: d.memberCount,
    sort: 0,
    status: "正常" as const,
    createdAt: "2025-09-04 10:19:17",
    children: d.children ? convertDepts(d.children, d.id) : undefined,
  }));
}

function flattenForSelect(nodes: DeptNode[], prefix = ""): { id: string; label: string }[] {
  const result: { id: string; label: string }[] = [];
  for (const n of nodes) {
    result.push({ id: n.id, label: prefix + n.name });
    if (n.children) result.push(...flattenForSelect(n.children, prefix + "  "));
  }
  return result;
}

function filterTree(nodes: DeptNode[], nameFilter: string, statusFilter: string): DeptNode[] {
  return nodes.reduce<DeptNode[]>((acc, node) => {
    const filteredChildren = node.children ? filterTree(node.children, nameFilter, statusFilter) : undefined;
    const nameMatch = !nameFilter || node.name.includes(nameFilter);
    const statusMatch = statusFilter === "全部" || node.status === statusFilter;
    const hasMatchingChildren = filteredChildren && filteredChildren.length > 0;
    if ((nameMatch && statusMatch) || hasMatchingChildren) {
      acc.push({ ...node, children: filteredChildren });
    }
    return acc;
  }, []);
}

export default function SystemDepartments() {
  const [deptTree, setDeptTree] = useState<DeptNode[]>(convertDepts(mockDepartments));
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["D-001"]));
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DeptNode | null>(null);
  const [addParentId, setAddParentId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSort, setFormSort] = useState("0");
  const [formStatus, setFormStatus] = useState<"正常" | "停用">("正常");
  const [formParent, setFormParent] = useState<string>("none");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDept, setDeletingDept] = useState<DeptNode | null>(null);
  const [allExpanded, setAllExpanded] = useState(true);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const collectAllIds = (nodes: DeptNode[]): string[] => {
    return nodes.flatMap(n => [n.id, ...(n.children ? collectAllIds(n.children) : [])]);
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpanded(new Set());
    } else {
      setExpanded(new Set(collectAllIds(deptTree)));
    }
    setAllExpanded(!allExpanded);
  };

  const allDepts = flattenForSelect(deptTree);
  const displayTree = filterTree(deptTree, searchName, statusFilter);

  const openAdd = (parentId?: string) => {
    setEditingDept(null);
    setAddParentId(parentId || null);
    setFormName("");
    setFormSort("0");
    setFormStatus("正常");
    setFormParent(parentId || "none");
    setDialogOpen(true);
  };

  const openEdit = (dept: DeptNode) => {
    setEditingDept(dept);
    setAddParentId(null);
    setFormName(dept.name);
    setFormSort(String(dept.sort));
    setFormStatus(dept.status);
    setFormParent(dept.parentId || "none");
    setDialogOpen(true);
  };

  const findAndRemove = (nodes: DeptNode[], id: string): DeptNode[] => {
    return nodes.filter(n => n.id !== id).map(n => ({
      ...n, children: n.children ? findAndRemove(n.children, id) : undefined,
    }));
  };

  const addToParent = (nodes: DeptNode[], parentId: string, newNode: DeptNode): DeptNode[] => {
    return nodes.map(n => {
      if (n.id === parentId) return { ...n, children: [...(n.children || []), newNode] };
      return { ...n, children: n.children ? addToParent(n.children, parentId, newNode) : undefined };
    });
  };

  const updateInTree = (nodes: DeptNode[], id: string, updates: Partial<DeptNode>): DeptNode[] => {
    return nodes.map(n => {
      if (n.id === id) return { ...n, ...updates };
      return { ...n, children: n.children ? updateInTree(n.children, id, updates) : undefined };
    });
  };

  const handleSave = () => {
    if (!formName.trim()) { toast.error("请输入部门名称"); return; }
    if (editingDept) {
      setDeptTree(prev => updateInTree(prev, editingDept.id, {
        name: formName.trim(), sort: Number(formSort) || 0, status: formStatus,
      }));
      toast.success("部门已更新");
    } else {
      const now = new Date();
      const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const newDept: DeptNode = {
        id: `D-${Date.now()}`, name: formName.trim(), parentId: formParent === "none" ? null : formParent,
        memberCount: 0, sort: Number(formSort) || 0, status: formStatus, createdAt: ts,
      };
      if (formParent === "none") {
        setDeptTree(prev => [...prev, newDept]);
      } else {
        setDeptTree(prev => addToParent(prev, formParent, newDept));
        setExpanded(prev => new Set([...prev, formParent]));
      }
      toast.success("部门已添加");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingDept) {
      setDeptTree(prev => findAndRemove(prev, deletingDept.id));
      toast.success("部门已删除");
    }
    setDeleteDialogOpen(false);
  };

  const handleReset = () => {
    setSearchName("");
    setStatusFilter("全部");
  };

  const renderTreeRows = (nodes: DeptNode[], level = 0): React.ReactNode[] => {
    return nodes.flatMap(node => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expanded.has(node.id);
      const rows: React.ReactNode[] = [];
      rows.push(
        <TableRow key={node.id} className="group">
          <TableCell>
            <div className="flex items-center gap-1" style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren ? (
                <button onClick={() => toggle(node.id)} className="p-0.5 hover:bg-muted rounded shrink-0">
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>
              ) : (
                <span className="w-5 shrink-0" />
              )}
              <span className="text-sm">{node.name}</span>
            </div>
          </TableCell>
          <TableCell className="text-center font-mono text-sm">{node.sort}</TableCell>
          <TableCell className="text-center">
            <Badge variant="outline" className={node.status === "正常" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}>
              {node.status}
            </Badge>
          </TableCell>
          <TableCell className="text-sm text-muted-foreground">{node.createdAt}</TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => openEdit(node)} title="编辑">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => openAdd(node.id)} title="添加子部门">
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setDeletingDept(node); setDeleteDialogOpen(true); }} title="删除">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
      if (hasChildren && isExpanded) {
        rows.push(...renderTreeRows(node.children!, level + 1));
      }
      return rows;
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">部门管理</h1>

      {/* Search bar */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">部门</Label>
            <Input className="w-56" placeholder="请输入部门名称" value={searchName} onChange={e => setSearchName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">状态</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="部门状态" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部</SelectItem>
                <SelectItem value="正常">正常</SelectItem>
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
          <Button size="sm" onClick={() => openAdd()}><Plus className="h-4 w-4 mr-1" />新增</Button>
          <Button variant="outline" size="sm" onClick={toggleAll}>
            <ChevronsUpDown className="h-4 w-4 mr-1" />展开/折叠
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px]">部门</TableHead>
              <TableHead className="w-24 text-center">排序</TableHead>
              <TableHead className="w-24 text-center">状态</TableHead>
              <TableHead className="w-48">创建时间</TableHead>
              <TableHead className="w-36 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTreeRows(displayTree)}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDept ? "编辑部门" : "添加部门"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editingDept && (
              <div className="space-y-2">
                <Label>上级部门</Label>
                <Select value={formParent} onValueChange={setFormParent}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无（顶级部门）</SelectItem>
                    {allDepts.map(d => <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>部门名称</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="请输入部门名称" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>排序</Label>
                <Input type="number" value={formSort} onChange={e => setFormSort(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select value={formStatus} onValueChange={v => setFormStatus(v as "正常" | "停用")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="正常">正常</SelectItem>
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>确认删除</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">确定要删除部门「{deletingDept?.name}」吗？该操作不可恢复。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
