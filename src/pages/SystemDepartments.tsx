import { useState } from "react";
import { departments as mockDepartments, type Department } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, ChevronRight, ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeptNode {
  id: string;
  name: string;
  parentId: string | null;
  memberCount: number;
  children?: DeptNode[];
}

function flattenForSelect(nodes: DeptNode[], prefix = ""): { id: string; label: string }[] {
  const result: { id: string; label: string }[] = [];
  for (const n of nodes) {
    result.push({ id: n.id, label: prefix + n.name });
    if (n.children) {
      result.push(...flattenForSelect(n.children, prefix + "  "));
    }
  }
  return result;
}

export default function SystemDepartments() {
  const [deptTree, setDeptTree] = useState<DeptNode[]>(mockDepartments);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["D-001"]));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DeptNode | null>(null);
  const [formName, setFormName] = useState("");
  const [formParent, setFormParent] = useState<string>("none");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDept, setDeletingDept] = useState<DeptNode | null>(null);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allDepts = flattenForSelect(deptTree);

  const openAdd = () => {
    setEditingDept(null);
    setFormName("");
    setFormParent("none");
    setDialogOpen(true);
  };

  const openEdit = (dept: DeptNode) => {
    setEditingDept(dept);
    setFormName(dept.name);
    setFormParent(dept.parentId || "none");
    setDialogOpen(true);
  };

  const openDelete = (dept: DeptNode) => {
    setDeletingDept(dept);
    setDeleteDialogOpen(true);
  };

  const findAndRemove = (nodes: DeptNode[], id: string): DeptNode[] => {
    return nodes.filter(n => n.id !== id).map(n => ({
      ...n,
      children: n.children ? findAndRemove(n.children, id) : undefined,
    }));
  };

  const addToParent = (nodes: DeptNode[], parentId: string, newNode: DeptNode): DeptNode[] => {
    return nodes.map(n => {
      if (n.id === parentId) {
        return { ...n, children: [...(n.children || []), newNode] };
      }
      return { ...n, children: n.children ? addToParent(n.children, parentId, newNode) : undefined };
    });
  };

  const updateInTree = (nodes: DeptNode[], id: string, name: string): DeptNode[] => {
    return nodes.map(n => {
      if (n.id === id) return { ...n, name };
      return { ...n, children: n.children ? updateInTree(n.children, id, name) : undefined };
    });
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error("请输入部门名称");
      return;
    }
    if (editingDept) {
      setDeptTree(prev => updateInTree(prev, editingDept.id, formName.trim()));
      toast.success("部门已更新");
    } else {
      const newDept: DeptNode = {
        id: `D-${Date.now()}`,
        name: formName.trim(),
        parentId: formParent === "none" ? null : formParent,
        memberCount: 0,
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

  const renderTree = (nodes: DeptNode[], level = 0) => {
    return nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expanded.has(node.id);
      return (
        <div key={node.id}>
          <div
            className="flex items-center justify-between py-2.5 px-3 hover:bg-muted/50 rounded-md transition-colors group"
            style={{ paddingLeft: `${level * 24 + 12}px` }}
          >
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <button onClick={() => toggle(node.id)} className="p-0.5 hover:bg-muted rounded">
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>
              ) : (
                <span className="w-5" />
              )}
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{node.name}</span>
              <span className="text-xs text-muted-foreground ml-2">{node.memberCount} 人</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(node)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => openDelete(node)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {hasChildren && isExpanded && renderTree(node.children!, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">部门管理</h1>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" />添加部门</Button>
      </div>

      <div className="rounded-lg border bg-card p-4">
        {renderTree(deptTree)}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDept ? "编辑部门" : "添加部门"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>部门名称</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="请输入部门名称" />
            </div>
            {!editingDept && (
              <div className="space-y-2">
                <Label>上级部门</Label>
                <Select value={formParent} onValueChange={setFormParent}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无（顶级部门）</SelectItem>
                    {allDepts.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
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
