import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, RotateCcw, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { cloudDevices, CloudDevice, SocialAccount } from "@/lib/mock-data";

interface BindDeviceDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedAccounts: SocialAccount[];
}

export function BindDeviceDialog({ open, onOpenChange, selectedAccounts }: BindDeviceDialogProps) {
  const [searchKey, setSearchKey] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Check if any selected account already has a bound device
  const alreadyBoundAccounts = selectedAccounts.filter((a) => a.bindStatus === "绑定" && a.device);

  const uniqueRegions = useMemo(() => [...new Set(cloudDevices.map((d) => d.region))], []);

  const filtered = useMemo(() => {
    return cloudDevices.filter((d) => {
      if (searchKey.trim()) {
        const q = searchKey.toLowerCase();
        if (!d.id.toLowerCase().includes(q) && !d.sn.toLowerCase().includes(q) && !d.name.toLowerCase().includes(q) && !d.ip.toLowerCase().includes(q)) return false;
      }
      if (regionFilter !== "all" && d.region !== regionFilter) return false;
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      return true;
    });
  }, [searchKey, regionFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleReset = () => { setSearchKey(""); setRegionFilter("all"); setStatusFilter("all"); setPage(1); };

  const statusLabel: Record<string, { text: string; color: string }> = {
    online: { text: "在线", color: "bg-success/10 text-success border-success/20" },
    offline: { text: "离线", color: "bg-muted text-muted-foreground border-muted" },
    error: { text: "故障", color: "bg-destructive/10 text-destructive border-destructive/20" },
  };

  const handleConfirm = () => {
    if (alreadyBoundAccounts.length > 0) {
      toast.error(`以下账号已绑定云机，请先解绑：${alreadyBoundAccounts.map((a) => a.username).join("、")}`);
      return;
    }
    if (!selectedDeviceId) {
      toast.error("请选择一台云机");
      return;
    }
    const device = cloudDevices.find((d) => d.id === selectedDeviceId);
    toast.success(`已将 ${selectedAccounts.length} 个账号绑定到云机「${device?.name || selectedDeviceId}」`);
    setSelectedDeviceId(null);
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
    <Dialog open={open} onOpenChange={(v) => { if (!v) setSelectedDeviceId(null); onOpenChange(v); }}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>绑定云机</DialogTitle>
        </DialogHeader>

        {/* Warning for already bound accounts */}
        {alreadyBoundAccounts.length > 0 && (
          <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 p-3">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">以下账号已绑定云机，需先解绑后才能重新绑定：</p>
              <p className="text-muted-foreground mt-1">
                {alreadyBoundAccounts.map((a) => `${a.username}（${a.device}）`).join("、")}
              </p>
            </div>
          </div>
        )}

        {/* Selected accounts summary */}
        <div className="text-sm text-muted-foreground">
          已选择 <span className="font-medium text-foreground">{selectedAccounts.length}</span> 个账号
          {alreadyBoundAccounts.length > 0 && (
            <span>，其中 <span className="text-warning font-medium">{alreadyBoundAccounts.length}</span> 个已绑定云机</span>
          )}
        </div>

        {/* Search / Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">搜索</Label>
          <Input placeholder="ID/SN/名称/IP" value={searchKey} onChange={(e) => { setSearchKey(e.target.value); setPage(1); }} className="max-w-[180px]" />
          <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">地域</Label>
          <Select value={regionFilter} onValueChange={(v) => { setRegionFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="全部" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {uniqueRegions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">状态</Label>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[100px]"><SelectValue placeholder="全部" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="online">在线</SelectItem>
              <SelectItem value="offline">离线</SelectItem>
              <SelectItem value="error">故障</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setPage(1)}><Search className="h-3.5 w-3.5 mr-1" />搜索</Button>
          <Button variant="outline" size="sm" onClick={handleReset}><RotateCcw className="h-3.5 w-3.5 mr-1" />重置</Button>
        </div>

        {/* Device table */}
        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">选择</TableHead>
                <TableHead>设备ID</TableHead>
                <TableHead>设备名称</TableHead>
                <TableHead>IP地址</TableHead>
                <TableHead>地域</TableHead>
                <TableHead className="text-center">状态</TableHead>
                <TableHead className="text-center">已绑账号数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((d) => (
                <TableRow
                  key={d.id}
                  className={selectedDeviceId === d.id ? "bg-primary/5" : "cursor-pointer"}
                  onClick={() => setSelectedDeviceId(d.id)}
                >
                  <TableCell className="text-center">
                    <input
                      type="radio"
                      name="device"
                      checked={selectedDeviceId === d.id}
                      onChange={() => setSelectedDeviceId(d.id)}
                      className="accent-primary"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell className="font-mono text-xs">{d.ip}</TableCell>
                  <TableCell>{d.region}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={statusLabel[d.status]?.color}>
                      {statusLabel[d.status]?.text}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{d.boundAccounts.length}</TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">暂无数据</TableCell></TableRow>
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
          <Button onClick={handleConfirm} disabled={alreadyBoundAccounts.length > 0}>确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
