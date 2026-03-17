import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cloudDevices, orgTree, type CloudDevice, type OrgNode } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Monitor, RotateCw, Globe,
  LayoutGrid, List, Search, X, ChevronRight, ChevronDown,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

const statusConfig = {
  online: { label: "在线", className: "bg-success/10 text-success border-success/20" },
  offline: { label: "离线", className: "bg-muted text-muted-foreground border-muted" },
  error: { label: "异常", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const phoneStatusConfig: Record<string, { label: string; className: string }> = {
  "正常": { label: "正常", className: "bg-success/10 text-success border-success/20" },
  "离线": { label: "离线", className: "bg-muted text-muted-foreground border-muted" },
  "故障": { label: "故障", className: "bg-destructive/10 text-destructive border-destructive/20" },
  "维护中": { label: "维护中", className: "bg-warning/10 text-warning border-warning/20" },
};

// ---- Inline editable name cell ----
function EditableNameCell({ device, onNameChange }: { device: CloudDevice; onNameChange: (id: string, name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(device.name);
  const originalRef = useRef(device.name);

  const handleBlur = () => {
    setEditing(false);
    if (value.trim() && value !== originalRef.current) {
      onNameChange(device.id, value.trim());
      originalRef.current = value.trim();
    } else {
      setValue(originalRef.current);
    }
  };

  if (editing) {
    return (
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        className="h-7 text-sm w-[140px]"
      />
    );
  }

  return (
    <span
      className="cursor-pointer hover:text-primary hover:underline underline-offset-2 transition-colors"
      onClick={() => setEditing(true)}
    >
      {device.name}
    </span>
  );
}

// ---- Department / Employee tree selector ----
function OrgTreeNode({ node, depth, onSelect }: { node: OrgNode; depth: number; onSelect: (node: OrgNode) => void }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-1 py-1.5 px-2 rounded hover:bg-muted cursor-pointer text-sm"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect(node);
        }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />
        ) : (
          <span className="w-3" />
        )}
        <span className={node.type === "department" ? "font-medium" : ""}>{node.name}</span>
        <Badge variant="outline" className="ml-auto text-[10px] h-4">
          {node.type === "department" ? "部门" : "员工"}
        </Badge>
      </div>
      {expanded && hasChildren && node.children!.map((child) => (
        <OrgTreeNode key={child.id} node={child} depth={depth + 1} onSelect={onSelect} />
      ))}
    </div>
  );
}

function DeptEmployeeSelector({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs font-normal justify-start min-w-[80px]">
          {value || "绑定"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2 max-h-[300px] overflow-auto" align="start">
        <div className="text-xs font-medium text-muted-foreground mb-2 px-2">选择部门/员工</div>
        {orgTree.map((node) => (
          <OrgTreeNode
            key={node.id}
            node={node}
            depth={0}
            onSelect={(n) => {
              onChange(n.name);
              setOpen(false);
            }}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}

// ---- Filters ----
function getUniqueValues<T>(arr: T[], getter: (item: T) => string): string[] {
  return [...new Set(arr.map(getter).filter(Boolean))].sort();
}

export default function Devices() {
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [devices, setDevices] = useState(cloudDevices);

  // Filters
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPhoneStatus, setFilterPhoneStatus] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const regions = useMemo(() => getUniqueValues(devices, (d) => d.region), [devices]);
  const depts = useMemo(() => getUniqueValues(devices, (d) => d.boundDepartment || ""), [devices]);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        const matchFields = [d.id, d.sn, d.name, d.ip, ...d.boundAccounts.map((a) => `${a.platform}:${a.username}`)].join(" ").toLowerCase();
        if (!matchFields.includes(kw)) return false;
      }
      if (filterStatus !== "all" && d.status !== filterStatus) return false;
      if (filterPhoneStatus !== "all" && d.phoneStatus !== filterPhoneStatus) return false;
      if (filterRegion !== "all" && d.region !== filterRegion) return false;
      if (filterDepartment !== "all" && (d.boundDepartment || "") !== filterDepartment) return false;
      return true;
    });
  }, [devices, searchKeyword, filterStatus, filterPhoneStatus, filterRegion, filterDepartment]);

  const hasFilters = searchKeyword || filterStatus !== "all" || filterPhoneStatus !== "all" || filterRegion !== "all" || filterDepartment !== "all";

  const clearFilters = () => {
    setSearchKeyword("");
    setFilterStatus("all");
    setFilterPhoneStatus("all");
    setFilterRegion("all");
    setFilterDepartment("all");
  };

  // Inline name edit handler (mock)
  const handleNameChange = (id: string, newName: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, name: newName } : d)));
    toast({ title: "名称已更新", description: `设备 ${id} 名称已修改为 "${newName}"` });
    // TODO: call backend API here
  };

  // Dept/employee bind handler (mock)
  const handleBindChange = (id: string, field: "boundDepartment" | "boundEmployee", value: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
    toast({ title: "绑定已更新", description: `设备 ${id} 已绑定至 "${value}"` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">云机管理</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button>+ 创建云机</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索编号/SN/名称/IP/账号…"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-9 h-9 w-[240px]"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[110px] h-9"><SelectValue placeholder="设备状态" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="online">在线</SelectItem>
            <SelectItem value="offline">离线</SelectItem>
            <SelectItem value="error">异常</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPhoneStatus} onValueChange={setFilterPhoneStatus}>
          <SelectTrigger className="w-[110px] h-9"><SelectValue placeholder="手机状态" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="正常">正常</SelectItem>
            <SelectItem value="离线">离线</SelectItem>
            <SelectItem value="故障">故障</SelectItem>
            <SelectItem value="维护中">维护中</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRegion} onValueChange={setFilterRegion}>
          <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="区域" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部区域</SelectItem>
            {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="部门" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部部门</SelectItem>
            {depts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-xs">
            <X className="h-3.5 w-3.5 mr-1" />清除
          </Button>
        )}
        <span className="text-sm text-muted-foreground ml-auto">共 {filteredDevices.length} 台设备</span>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredDevices.map((device) => {
            const st = statusConfig[device.status];
            return (
              <Card key={device.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-[9/16] bg-muted/30 rounded-t-lg relative overflow-hidden">
                    {device.screenshot ? (
                      <img
                        src={device.screenshot}
                        alt={`${device.name} screenshot`}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-muted/20 to-muted/50">
                        <div className="relative">
                          <div className="w-16 h-24 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                            <Monitor className="h-7 w-7 text-muted-foreground/25" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                            <span className="text-[10px] text-muted-foreground/40">?</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground/40 tracking-wide">暂无截图</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className={st.className + " text-[10px] backdrop-blur-sm"}>{st.label}</Badge>
                    </div>
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="h-8 text-xs">远程控制</Button>
                      <Button size="sm" variant="secondary" className="h-8 text-xs"><RotateCw className="h-3 w-3" /></Button>
                      <Button size="sm" variant="secondary" className="h-8 text-xs"><Globe className="h-3 w-3" /></Button>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-medium">{device.id}</span>
                      <span className="text-xs text-muted-foreground truncate ml-2">{device.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span>{device.region}</span>
                    </div>
                    {device.boundAccounts.length > 0 && (
                      <div className="space-y-0.5">
                        {device.boundAccounts.map((a, i) => (
                          <div key={i} className="text-[11px] font-mono text-primary truncate">
                            {a.platform}:{a.username}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-[11px] font-mono text-muted-foreground">{device.ip}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">编号</TableHead>
                  <TableHead className="w-[120px]">SN码</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>设备状态</TableHead>
                  <TableHead>手机状态</TableHead>
                  <TableHead>区域</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>绑定账号</TableHead>
                  <TableHead>绑定部门/员工</TableHead>
                  <TableHead>绑定时间</TableHead>
                  <TableHead>到期时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => {
                  const st = statusConfig[device.status];
                  const ps = phoneStatusConfig[device.phoneStatus] || phoneStatusConfig["正常"];
                  return (
                    <TableRow key={device.id}>
                      <TableCell className="font-mono text-sm">{device.id}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{device.sn}</TableCell>
                      <TableCell>
                        <EditableNameCell device={device} onNameChange={handleNameChange} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={st.className}>{st.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={ps.className}>{ps.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{device.region}</TableCell>
                      <TableCell className="font-mono text-sm">{device.ip}</TableCell>
                      <TableCell>
                        {device.boundAccounts.length > 0 ? (
                          <div className="space-y-0.5">
                            {device.boundAccounts.map((a, i) => (
                              <div key={i} className="text-xs font-mono text-primary whitespace-nowrap">
                                {a.platform}:{a.username}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DeptEmployeeSelector
                            value={[device.boundDepartment, device.boundEmployee].filter(Boolean).join(" / ")}
                            onChange={(val) => handleBindChange(device.id, "boundDepartment", val)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{device.bindTime || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{device.expiryTime || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" className="h-7 text-xs">控制</Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2"><RotateCw className="h-3 w-3" /></Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2"><Globe className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
