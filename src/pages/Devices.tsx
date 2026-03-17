import { cloudDevices } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, RotateCw, Globe, Cpu, MemoryStick } from "lucide-react";

const statusConfig = {
  online: { label: "在线", className: "bg-success/10 text-success border-success/20" },
  offline: { label: "离线", className: "bg-muted text-muted-foreground border-muted" },
  error: { label: "异常", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Devices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">云机管理</h1>
        <Button>+ 创建云机</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cloudDevices.map((device) => {
          const st = statusConfig[device.status];
          return (
            <Card key={device.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-muted/50 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  <Monitor className="h-10 w-10 text-muted-foreground/30" />
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
                    <Badge variant="outline" className={st.className}>{st.label}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{device.name}</div>
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
    </div>
  );
}
