import { useState } from "react";
import { cloudDevices } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Monitor, RotateCw, Globe, Cpu, MemoryStick,
  LayoutGrid, List,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const statusConfig = {
  online: { label: "在线", className: "bg-success/10 text-success border-success/20" },
  offline: { label: "离线", className: "bg-muted text-muted-foreground border-muted" },
  error: { label: "异常", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Devices() {
  const [view, setView] = useState<"grid" | "list">("grid");

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

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cloudDevices.map((device) => {
            const st = statusConfig[device.status];
            return (
              <Card key={device.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* Screenshot / Thumbnail */}
                  <div className="aspect-video bg-muted/50 rounded-t-lg relative overflow-hidden">
                    {device.screenshot ? (
                      <img
                        src={device.screenshot}
                        alt={`${device.name} screenshot`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Monitor className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Status indicator */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className={st.className + " text-[10px] backdrop-blur-sm"}>{st.label}</Badge>
                    </div>
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="h-8 text-xs">远程控制</Button>
                      <Button size="sm" variant="secondary" className="h-8 text-xs"><RotateCw className="h-3 w-3" /></Button>
                      <Button size="sm" variant="secondary" className="h-8 text-xs"><Globe className="h-3 w-3" /></Button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-medium">{device.id}</span>
                      <span className="text-sm text-muted-foreground">{device.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        <span>{device.region}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <span className={device.latency > 200 ? "text-destructive" : device.latency > 100 ? "text-warning" : "text-success"}>
                          {device.latency}ms
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Cpu className="h-3 w-3" />
                        <span className="font-mono">{device.cpu}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MemoryStick className="h-3 w-3" />
                        <span className="font-mono">{device.memory}%</span>
                      </div>
                    </div>
                    {device.boundAccount && (
                      <div className="text-xs font-mono text-primary truncate">{device.boundAccount}</div>
                    )}
                    <div className="text-xs font-mono text-muted-foreground">{device.ip}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px]">编号</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>区域</TableHead>
                <TableHead className="text-right">延迟</TableHead>
                <TableHead className="text-right">CPU</TableHead>
                <TableHead className="text-right">内存</TableHead>
                <TableHead>绑定账号</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cloudDevices.map((device) => {
                const st = statusConfig[device.status];
                return (
                  <TableRow key={device.id}>
                    <TableCell className="font-mono text-sm">{device.id}</TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={st.className}>{st.label}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{device.ip}</TableCell>
                    <TableCell>{device.region}</TableCell>
                    <TableCell className="text-right font-mono">
                      <span className={device.latency > 200 ? "text-destructive" : device.latency > 100 ? "text-warning" : "text-success"}>
                        {device.latency}ms
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">{device.cpu}%</TableCell>
                    <TableCell className="text-right font-mono">{device.memory}%</TableCell>
                    <TableCell className="font-mono text-xs text-primary">{device.boundAccount || "—"}</TableCell>
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
        </Card>
      )}
    </div>
  );
}