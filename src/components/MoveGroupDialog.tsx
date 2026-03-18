import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface GroupItem {
  id: string;
  name: string;
  accountCount: number;
}

const mockGroups: GroupItem[] = [
  { id: "1", name: "默认分组", accountCount: 400 },
  { id: "2", name: "B", accountCount: 1 },
  { id: "3", name: "A", accountCount: 0 },
  { id: "4", name: "小成", accountCount: 0 },
  { id: "5", name: "1", accountCount: 2 },
];

function NewGroupDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: (name: string) => void }) {
  const [name, setName] = useState("");

  const handleConfirm = () => {
    if (!name.trim()) {
      toast.error("请输入分组名称");
      return;
    }
    if (name.trim().length > 30) {
      toast.error("分组名称不能超过30个字符");
      return;
    }
    onSave(name.trim());
    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>新建分组</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Label><span className="text-destructive">*</span> 分组名称</Label>
          <div className="relative">
            <Input
              placeholder="请输入分组名称"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              maxLength={30}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{name.length} / 30</span>
          </div>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>取 消</Button>
          <Button onClick={handleConfirm}>确 定</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MoveGroupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [groups, setGroups] = useState<GroupItem[]>(mockGroups);
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newGroupOpen, setNewGroupOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!searchName.trim()) return groups;
    return groups.filter((g) => g.name.includes(searchName.trim()));
  }, [groups, searchName]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleReset = () => { setSearchName(""); setPage(1); };

  const handleSelect = (group: GroupItem) => {
    toast.success(`已移动到分组「${group.name}」`);
    onOpenChange(false);
  };

  const handleAddGroup = (name: string) => {
    setGroups((prev) => [...prev, { id: Date.now().toString(), name, accountCount: 0 }]);
    toast.success(`分组「${name}」已创建`);
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between pr-8">
            <DialogTitle>移动分组</DialogTitle>
            <Button variant="outline" size="sm" onClick={() => setNewGroupOpen(true)}>新建分组</Button>
          </DialogHeader>

          <div className="flex items-center gap-3">
            <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">分组名称</Label>
            <Input placeholder="请输入" value={searchName} onChange={(e) => { setSearchName(e.target.value); setPage(1); }} className="max-w-[240px]" />
            <Button variant="outline" size="sm" onClick={handleReset}><RotateCcw className="h-3.5 w-3.5 mr-1" />重置</Button>
            <Button size="sm" onClick={() => setPage(1)}><Search className="h-3.5 w-3.5 mr-1" />搜索</Button>
          </div>

          <div className="flex-1 overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>分组名称</TableHead>
                  <TableHead className="text-center">账号数量</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.name}</TableCell>
                    <TableCell className="text-center">{g.accountCount}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="link" className="text-primary p-0 h-auto" onClick={() => handleSelect(g)}>选择</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">暂无数据</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

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
        </DialogContent>
      </Dialog>
      <NewGroupDialog open={newGroupOpen} onOpenChange={setNewGroupOpen} onSave={handleAddGroup} />
    </>
  );
}
