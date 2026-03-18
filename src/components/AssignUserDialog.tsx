import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { orgTree, OrgNode, SocialAccount } from "@/lib/mock-data";

interface UserItem {
  id: string;
  name: string;
  department: string;
}

function flattenEmployees(nodes: OrgNode[], dept?: string): UserItem[] {
  const result: UserItem[] = [];
  for (const node of nodes) {
    if (node.type === "employee") {
      result.push({ id: node.id, name: node.name, department: dept || "" });
    }
    if (node.children) {
      result.push(...flattenEmployees(node.children, node.type === "department" ? node.name : dept));
    }
  }
  return result;
}

const allUsers = flattenEmployees(orgTree);
const allDepartments = [...new Set(allUsers.map((u) => u.department))];

interface AssignUserDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedAccounts: SocialAccount[];
}

export function AssignUserDialog({ open, onOpenChange, selectedAccounts }: AssignUserDialogProps) {
  const [searchName, setSearchName] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      if (searchName.trim() && !u.name.includes(searchName.trim())) return false;
      if (deptFilter !== "all" && u.department !== deptFilter) return false;
      return true;
    });
  }, [searchName, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleReset = () => { setSearchName(""); setDeptFilter("all"); setPage(1); };

  const handleConfirm = () => {
    if (!selectedUserId) {
      toast.error("请选择一个用户");
      return;
    }
    const user = allUsers.find((u) => u.id === selectedUserId);
    toast.success(`已将 ${selectedAccounts.length} 个账号分配给「${user?.name}」`);
    setSelectedUserId(null);
    onOpenChange(false);
  };

  const renderPageButtons = () => {
    const buttons: React.ReactNode[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button key={i} variant={i === page ? "default" : "outline"} size="sm" className="h-8 w-8 p-0" onClick={() => setPage(i)}>{i}</Button>
      );
    }
    return buttons;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setSelectedUserId(null); onOpenChange(v); }}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>分配给用户</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          已选择 <span className="font-medium text-foreground">{selectedAccounts.length}</span> 个账号，每个账号只能分配给一个用户
        </div>

        {/* Search / Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">用户名</Label>
          <Input placeholder="请输入" value={searchName} onChange={(e) => { setSearchName(e.target.value); setPage(1); }} className="max-w-[180px]" />
          <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">部门</Label>
          <Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="全部" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {allDepartments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setPage(1)}><Search className="h-3.5 w-3.5 mr-1" />搜索</Button>
          <Button variant="outline" size="sm" onClick={handleReset}><RotateCcw className="h-3.5 w-3.5 mr-1" />重置</Button>
        </div>

        {/* User table */}
        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">选择</TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>部门</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((u) => (
                <TableRow
                  key={u.id}
                  className={selectedUserId === u.id ? "bg-primary/5" : "cursor-pointer"}
                  onClick={() => setSelectedUserId(u.id)}
                >
                  <TableCell className="text-center">
                    <input type="radio" name="user" checked={selectedUserId === u.id} onChange={() => setSelectedUserId(u.id)} className="accent-primary" />
                  </TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.department}</TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">暂无数据</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-sm text-muted-foreground">共 {filtered.length} 条</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          {renderPageButtons()}
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-[100px] h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10条/页</SelectItem>
              <SelectItem value="20">20条/页</SelectItem>
              <SelectItem value="50">50条/页</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleConfirm}>确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
