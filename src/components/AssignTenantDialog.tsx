import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { SocialAccount } from "@/lib/mock-data";

interface TenantItem {
  id: string;
  name: string;
  contactPerson: string;
  accountCount: number;
  status: "正常" | "停用";
}

const mockTenants: TenantItem[] = [
  { id: "T-001", name: "星辰科技有限公司", contactPerson: "张总", accountCount: 25, status: "正常" },
  { id: "T-002", name: "蓝海电商集团", contactPerson: "李经理", accountCount: 48, status: "正常" },
  { id: "T-003", name: "云帆数字营销", contactPerson: "王总监", accountCount: 12, status: "正常" },
  { id: "T-004", name: "锐创传媒", contactPerson: "赵总", accountCount: 36, status: "正常" },
  { id: "T-005", name: "万象互联", contactPerson: "刘经理", accountCount: 8, status: "停用" },
  { id: "T-006", name: "鼎峰贸易", contactPerson: "陈总", accountCount: 15, status: "正常" },
  { id: "T-007", name: "智远科技", contactPerson: "周经理", accountCount: 0, status: "正常" },
  { id: "T-008", name: "天启数据", contactPerson: "吴总监", accountCount: 22, status: "正常" },
];

interface AssignTenantDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedAccounts: SocialAccount[];
}

export function AssignTenantDialog({ open, onOpenChange, selectedAccounts }: AssignTenantDialogProps) {
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return mockTenants.filter((t) => {
      if (searchName.trim() && !t.name.includes(searchName.trim()) && !t.contactPerson.includes(searchName.trim())) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      return true;
    });
  }, [searchName, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleReset = () => { setSearchName(""); setStatusFilter("all"); setPage(1); };

  const handleConfirm = () => {
    if (!selectedTenantId) {
      toast.error("请选择一个租户");
      return;
    }
    const tenant = mockTenants.find((t) => t.id === selectedTenantId);
    toast.success(`已将 ${selectedAccounts.length} 个账号分配给租户「${tenant?.name}」`);
    setSelectedTenantId(null);
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

  const statusColor: Record<string, string> = {
    "正常": "bg-success/10 text-success border-success/20",
    "停用": "bg-muted text-muted-foreground border-muted",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setSelectedTenantId(null); onOpenChange(v); }}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>分配给指定租户</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          已选择 <span className="font-medium text-foreground">{selectedAccounts.length}</span> 个账号，每个账号只能分配给一个租户
        </div>

        {/* Search / Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">租户名称</Label>
          <Input placeholder="名称/联系人" value={searchName} onChange={(e) => { setSearchName(e.target.value); setPage(1); }} className="max-w-[180px]" />
          <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">状态</Label>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[100px]"><SelectValue placeholder="全部" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="正常">正常</SelectItem>
              <SelectItem value="停用">停用</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setPage(1)}><Search className="h-3.5 w-3.5 mr-1" />搜索</Button>
          <Button variant="outline" size="sm" onClick={handleReset}><RotateCcw className="h-3.5 w-3.5 mr-1" />重置</Button>
        </div>

        {/* Tenant table */}
        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">选择</TableHead>
                <TableHead>租户名称</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead className="text-center">已分配账号数</TableHead>
                <TableHead className="text-center">状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((t) => (
                <TableRow
                  key={t.id}
                  className={`${selectedTenantId === t.id ? "bg-primary/5" : "cursor-pointer"} ${t.status === "停用" ? "opacity-60" : ""}`}
                  onClick={() => t.status === "正常" && setSelectedTenantId(t.id)}
                >
                  <TableCell className="text-center">
                    <input
                      type="radio"
                      name="tenant"
                      checked={selectedTenantId === t.id}
                      disabled={t.status === "停用"}
                      onChange={() => setSelectedTenantId(t.id)}
                      className="accent-primary"
                    />
                  </TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.contactPerson}</TableCell>
                  <TableCell className="text-center">{t.accountCount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={statusColor[t.status]}>{t.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">暂无数据</TableCell></TableRow>
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
