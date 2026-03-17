import { useState, useMemo } from "react";
import { ipResources } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Search, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  "空闲": "bg-success/10 text-success border-success/20",
  "已绑定": "bg-primary/10 text-primary border-primary/20",
  "冷却中": "bg-warning/10 text-warning border-warning/20",
  "禁用": "bg-destructive/10 text-destructive border-destructive/20",
};

const allTypes = ["ISP住宅", "数据中心", "移动"] as const;
const allStatuses = ["空闲", "已绑定", "冷却中", "禁用"] as const;
const allRegions = [...new Set(ipResources.map((ip) => ip.region))];
const allDevices = [...new Set(ipResources.map((ip) => ip.boundDevice).filter(Boolean))] as string[];

export default function IPPool() {
  const [searchIP, setSearchIP] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");

  const filtered = useMemo(() => {
    return ipResources.filter((ip) => {
      if (searchIP && !ip.address.includes(searchIP)) return false;
      if (filterType !== "all" && ip.type !== filterType) return false;
      if (filterStatus !== "all" && ip.status !== filterStatus) return false;
      if (filterRegion !== "all" && ip.region !== filterRegion) return false;
      if (filterDevice !== "all" && ip.boundDevice !== filterDevice) return false;
      return true;
    });
  }, [searchIP, filterType, filterStatus, filterRegion, filterDevice]);

  const hasFilters = searchIP || filterType !== "all" || filterStatus !== "all" || filterRegion !== "all" || filterDevice !== "all";

  const clearFilters = () => {
    setSearchIP("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterRegion("all");
    setFilterDevice("all");
  };

  const copyIP = (ip: string) => {
    navigator.clipboard.writeText(ip);
    toast({ title: "已复制", description: ip });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">IP资源池</h1>
        <Button>+ 导入IP</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索IP地址..."
            value={searchIP}
            onChange={(e) => setSearchIP(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-32"><SelectValue placeholder="类型" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            {allTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32"><SelectValue placeholder="状态" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            {allStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterRegion} onValueChange={setFilterRegion}>
          <SelectTrigger className="w-36"><SelectValue placeholder="归属地" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部归属地</SelectItem>
            {allRegions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterDevice} onValueChange={setFilterDevice}>
          <SelectTrigger className="w-32"><SelectValue placeholder="绑定设备" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部设备</SelectItem>
            {allDevices.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" /> 清除
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP地址</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>代理服务器</TableHead>
              <TableHead>纯净度</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>归属地</TableHead>
              <TableHead>绑定设备</TableHead>
              <TableHead>代理到期</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  没有匹配的IP资源
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell>
                    <button onClick={() => copyIP(ip.address)} className="flex items-center gap-2 font-mono text-sm hover:text-primary transition-colors group">
                      {ip.address}
                      <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </TableCell>
                  <TableCell><Badge variant="outline">{ip.type}</Badge></TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{ip.proxyServer || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 w-28">
                      <Progress value={ip.purity} className="h-2" />
                      <span className={`font-mono text-xs ${ip.purity >= 90 ? "text-success" : ip.purity >= 70 ? "text-warning" : "text-destructive"}`}>
                        {ip.purity}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[ip.status]}>{ip.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{ip.region}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{ip.boundDevice || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ip.proxyExpiry || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
