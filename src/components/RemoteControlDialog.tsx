import { useState, useEffect } from "react";
import { type CloudDevice } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Camera, Volume2, VolumeX, RotateCw, Lock,
  ChevronLeft, Circle, Square, Power,
  Smartphone, Wifi, Upload, Download, MoreVertical, X,
} from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  online: { label: "在线", className: "bg-success/10 text-success border-success/20" },
  offline: { label: "离线", className: "bg-muted text-muted-foreground border-muted" },
  error: { label: "异常", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

interface RemoteControlDialogProps {
  device: CloudDevice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemoteControlDialog({ device, open, onOpenChange }: RemoteControlDialogProps) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (open && device) {
      setIsConnected(false);
      const timer = setTimeout(() => setIsConnected(true), 800);
      return () => clearTimeout(timer);
    }
  }, [open, device]);

  if (!device) return null;

  const st = statusConfig[device.status];

  const handleAction = (action: string) => {
    toast({ title: action, description: `已向 ${device.name} 发送${action}指令` });
  };

  const toolbarActions = [
    { icon: <Camera className="h-4 w-4" />, label: "截图", onClick: () => handleAction("截图") },
    { icon: <Volume2 className="h-4 w-4" />, label: "音量+", onClick: () => handleAction("音量增加") },
    { icon: <VolumeX className="h-4 w-4" />, label: "音量-", onClick: () => handleAction("音量减少") },
    { icon: <Upload className="h-4 w-4" />, label: "上传文件", onClick: () => handleAction("上传文件") },
    { icon: <Download className="h-4 w-4" />, label: "下载文件", onClick: () => handleAction("下载文件") },
  ];

  const dangerActions = [
    { icon: <RotateCw className="h-4 w-4" />, label: "重启", onClick: () => handleAction("重启"), variant: "destructive" as const },
    { icon: <Lock className="h-4 w-4" />, label: "锁屏", onClick: () => handleAction("锁屏") },
    { icon: <Power className="h-4 w-4" />, label: "关机", onClick: () => handleAction("关机"), variant: "destructive" as const },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[680px] h-[85vh] p-0 gap-0 overflow-hidden [&>button]:hidden flex flex-col">
        <DialogTitle className="sr-only">远程控制 - {device.name}</DialogTitle>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-card">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{device.name}</span>
            <span className="font-mono text-[11px] text-muted-foreground">({device.id})</span>
            <Badge variant="outline" className={st.className + " text-[10px]"}>{st.label}</Badge>
            {isConnected && (
              <div className="flex items-center gap-1 text-[11px] text-success">
                <Wifi className="h-3 w-3" />
                <span>已连接</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex flex-1 bg-muted/30 overflow-hidden">
          {/* Phone screen */}
          <div className="flex-1 flex flex-col items-center justify-center py-5 px-4">
            <div
              className="relative rounded-lg border-2 border-foreground/10 bg-foreground/5 shadow-xl overflow-hidden"
              style={{ width: "340px", height: "calc(85vh - 140px)" }}
            >
              {!isConnected ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-background/80">
                  <Smartphone className="h-10 w-10 text-muted-foreground/40 animate-pulse" />
                  <div className="text-xs text-muted-foreground">正在连接...</div>
                  <div className="w-24 h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
                  </div>
                </div>
              ) : device.screenshot ? (
                <img src={device.screenshot} alt="Phone screen" className="w-full h-full object-cover cursor-pointer" draggable={false} />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-primary/30 to-accent/40 flex items-end justify-center pb-12">
                  <div className="text-white/60 text-xs">实时画面</div>
                </div>
              )}
            </div>

            {/* Android nav */}
            <div className="mt-3 flex items-center gap-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => handleAction("返回")} className="h-8 w-8 rounded-full flex items-center justify-center bg-card border border-border hover:bg-accent transition-colors">
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>返回</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => handleAction("主页")} className="h-10 w-10 rounded-full flex items-center justify-center bg-card border-2 border-border hover:bg-accent transition-colors">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>主页</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => handleAction("最近任务")} className="h-8 w-8 rounded-full flex items-center justify-center bg-card border border-border hover:bg-accent transition-colors">
                    <Square className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>最近任务</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Right toolbar */}
          <div className="w-14 border-l bg-card flex flex-col items-center py-3 gap-0.5">
            <div className="text-[9px] font-medium text-muted-foreground mb-1.5 tracking-wider">工具</div>
            {toolbarActions.map((action, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <button onClick={action.onClick} className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    {action.icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">{action.label}</TooltipContent>
              </Tooltip>
            ))}

            <Separator className="my-1.5 w-7" />
            <div className="text-[9px] font-medium text-muted-foreground mb-1.5 tracking-wider">控制</div>
            {dangerActions.map((action, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <button
                    onClick={action.onClick}
                    className={`h-9 w-9 rounded-md flex items-center justify-center transition-colors ${
                      action.variant === "destructive"
                        ? "text-destructive hover:bg-destructive/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {action.icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">{action.label}</TooltipContent>
              </Tooltip>
            ))}

            <div className="mt-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">更多</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
