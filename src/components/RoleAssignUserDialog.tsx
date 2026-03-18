import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  status: boolean;
  createdAt: string;
}

const mockUsers: UserItem[] = [
  { id: "U-001", name: "zhangwei", nickname: "张伟", email: "zhangwei@company.com", phone: "138****1234", status: true, createdAt: "2025-09-04 10:19:17" },
  { id: "U-002", name: "lina", nickname: "李娜", email: "lina@company.com", phone: "139****5678", status: true, createdAt: "2025-09-04 14:09:42" },
  { id: "U-003", name: "wangfang", nickname: "王芳", email: "wangfang@company.com", phone: "137****9012", status: true, createdAt: "2025-09-04 21:06:52" },
  { id: "U-004", name: "zhaoming", nickname: "赵明", email: "zhaoming@company.com", phone: "136****3456", status: true, createdAt: "2025-09-04 21:08:09" },
  { id: "U-005", name: "liuyang", nickname: "刘洋", email: "liuyang@company.com", phone: "135****7890", status: true, createdAt: "2025-09-12 15:00:22" },
  { id: "U-006", name: "wanglei", nickname: "王磊", email: "wanglei@company.com", phone: "133****2345", status: true, createdAt: "2025-10-20 09:25:01" },
  { id: "U-007", name: "chenjing", nickname: "陈静", email: "chenjing@company.com", phone: "132****6789", status: true, createdAt: "2025-11-05 14:30:00" },
  { id: "U-008", name: "zhoujie", nickname: "周杰", email: "zhoujie@company.com", phone: "131****0123", status: true, createdAt: "2025-11-15 08:45:00" },
  { id: "U-009", name: "admin", nickname: "超级管理员", email: "admin@seaisee.com", phone: "130****0001", status: true, createdAt: "2025-01-01 00:00:00" },
  { id: "U-010", name: "sunli", nickname: "孙丽", email: "sunli@company.com", phone: "158****4567", status: true, createdAt: "2025-12-01 10:00:00" },
  { id: "U-011", name: "huanghai", nickname: "黄海", email: "huanghai@company.com", phone: "159****8901", status: false, createdAt: "2026-01-10 14:30:00" },
  { id: "U-012", name: "xuming", nickname: "徐明", email: "xuming@company.com", phone: "157****2345", status: true, createdAt: "2026-01-15 09:00:00" },
  { id: "U-013", name: "gaofei", nickname: "高飞", email: "gaofei@company.com", phone: "156****6789", status: true, createdAt: "2026-02-01 16:00:00" },
  { id: "U-014", name: "mawei", nickname: "马伟", email: "mawei@company.com", phone: "155****0123", status: true, createdAt: "2026-02-20 09:30:00" },
  { id: "U-015", name: "songyu", nickname: "宋宇", email: "songyu@company.com", phone: "188****4567", status: true, createdAt: "2026-03-01 11:00:00" },
  { id: "U-016", name: "tangxue", nickname: "唐雪", email: "tangxue@company.com", phone: "187****8901", status: true, createdAt: "2026-03-05 13:15:00" },
  { id: "U-017", name: "hejun", nickname: "贺军", email: "hejun@company.com", phone: "186****2345", status: true, createdAt: "2026-03-08 15:30:00" },
  { id: "U-018", name: "dengchao", nickname: "邓超", email: "dengchao@company.com", phone: "185****6789", status: true, createdAt: "2026-03-10 08:00:00" },
  { id: "U-019", name: "fengling", nickname: "冯玲", email: "fengling@company.com", phone: "183****0123", status: true, createdAt: "2026-03-12 10:45:00" },
  { id: "U-020", name: "caojun", nickname: "曹军", email: "caojun@company.com", phone: "182****4567", status: true, createdAt: "2026-03-14 14:00:00" },
  { id: "U-021", name: "pengwei", nickname: "彭伟", email: "pengwei@company.com", phone: "181****8901", status: true, createdAt: "2026-03-15 09:20:00" },
  { id: "U-022", name: "yanfei", nickname: "严飞", email: "yanfei@company.com", phone: "180****2345", status: true, createdAt: "2026-03-15 11:30:00" },
  { id: "U-023", name: "luming", nickname: "陆明", email: "luming@company.com", phone: "170****6789", status: true, createdAt: "2026-03-16 08:10:00" },
  { id: "U-024", name: "jiangnan", nickname: "蒋楠", email: "jiangnan@company.com", phone: "171****0123", status: true, createdAt: "2026-03-16 14:50:00" },
  { id: "U-025", name: "hanmei", nickname: "韩梅", email: "hanmei@company.com", phone: "172****4567", status: true, createdAt: "2026-03-17 09:00:00" },
  { id: "U-026", name: "weihua", nickname: "魏华", email: "weihua@company.com", phone: "173****8901", status: true, createdAt: "2026-03-17 11:30:00" },
  { id: "U-027", name: "taoli", nickname: "陶丽", email: "taoli@company.com", phone: "174****2345", status: true, createdAt: "2026-03-17 14:00:00" },
  { id: "U-028", name: "qinjie", nickname: "秦杰", email: "qinjie@company.com", phone: "175****6789", status: true, createdAt: "2026-03-17 16:30:00" },
  { id: "U-029", name: "shichen", nickname: "施晨", email: "shichen@company.com", phone: "176****0123", status: true, createdAt: "2026-03-18 08:00:00" },
  { id: "U-030", name: "panwei", nickname: "潘伟", email: "panwei@company.com", phone: "177****4567", status: true, createdAt: "2026-03-18 09:15:00" },
  { id: "U-031", name: "duanyu", nickname: "段宇", email: "duanyu@company.com", phone: "178****8901", status: true, createdAt: "2026-03-18 10:00:00" },
  { id: "U-032", name: "fanhua", nickname: "范华", email: "fanhua@company.com", phone: "179****2345", status: true, createdAt: "2026-03-18 10:30:00" },
  { id: "U-033", name: "fangming", nickname: "方明", email: "fangming@company.com", phone: "152****6789", status: true, createdAt: "2026-03-18 11:00:00" },
];

interface RoleAssignUserDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  roleName: string;
}

export function RoleAssignUserDialog({ open, onOpenChange, roleName }: RoleAssignUserDialogProps) {
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return mockUsers.filter((u) => {
      if (searchName.trim() && !u.name.includes(searchName.trim()) && !u.nickname.includes(searchName.trim())) return false;
      if (searchPhone.trim() && !u.phone.includes(searchPhone.trim())) return false;
      return true;
    });
  }, [searchName, searchPhone]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleReset = () => { setSearchName(""); setSearchPhone(""); setPage(1); };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (paged.every(u => selectedIds.has(u.id))) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        paged.forEach(u => next.delete(u.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        paged.forEach(u => next.add(u.id));
        return next;
      });
    }
  };

  const handleConfirm = () => {
    if (selectedIds.size === 0) {
      toast.error("请至少选择一个用户");
      return;
    }
    toast.success(`已将 ${selectedIds.size} 个用户分配到角色「${roleName}」`);
    setSelectedIds(new Set());
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
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setSelectedIds(new Set()); setSearchName(""); setSearchPhone(""); } onOpenChange(v); }}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>分配用户</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="flex items-center gap-4 flex-wrap">
          <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">用户名称</Label>
          <Input placeholder="请输入用户名称" value={searchName} onChange={(e) => { setSearchName(e.target.value); setPage(1); }} className="max-w-[200px]" />
          <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">手机号码</Label>
          <Input placeholder="请输入手机号码" value={searchPhone} onChange={(e) => { setSearchPhone(e.target.value); setPage(1); }} className="max-w-[200px]" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}><RotateCcw className="h-3.5 w-3.5 mr-1" />重置</Button>
          <Button size="sm" onClick={() => setPage(1)}><Search className="h-3.5 w-3.5 mr-1" />搜索</Button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px] text-center">
                  <Checkbox checked={paged.length > 0 && paged.every(u => selectedIds.has(u.id))} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead>用户名称</TableHead>
                <TableHead>用户昵称</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>手机</TableHead>
                <TableHead className="text-center">状态</TableHead>
                <TableHead>创建时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((u) => (
                <TableRow key={u.id} className={selectedIds.has(u.id) ? "bg-primary/5" : "cursor-pointer"} onClick={() => toggleSelect(u.id)}>
                  <TableCell className="text-center">
                    <Checkbox checked={selectedIds.has(u.id)} onCheckedChange={() => toggleSelect(u.id)} />
                  </TableCell>
                  <TableCell className="text-sm">{u.name}</TableCell>
                  <TableCell className="text-sm">{u.nickname}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="text-sm">{u.phone}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={u.status ? "outline" : "secondary"} className={u.status ? "border-green-500 text-green-600 bg-green-50" : ""}>
                      {u.status ? "正常" : "停用"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.createdAt}</TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">暂无数据</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-start gap-2 pt-1 text-sm text-muted-foreground">
          <span>共 {filtered.length} 条</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-[100px] h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10条/页</SelectItem>
              <SelectItem value="20">20条/页</SelectItem>
              <SelectItem value="50">50条/页</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          {renderPageButtons()}
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
          <span>前往</span>
          <Input className="w-14 h-8 text-center" value={page} onChange={e => { const v = Number(e.target.value); if (v >= 1 && v <= totalPages) setPage(v); }} />
          <span>页</span>
        </div>

        <DialogFooter>
          <Button onClick={handleConfirm}>确定</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
