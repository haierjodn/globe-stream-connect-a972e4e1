import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cloudDevices, type CloudDevice } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft, Camera, Volume2, VolumeX, RotateCw, Lock,
  ChevronLeft, Circle, Square, Power, Maximize2, Minimize2,
  Smartphone, Wifi, MoreVertical, Upload, Download, Keyboard,
  Settings, Info,
} from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  online: { label: "在线", className: "bg-success/10 text-success border-success/20" },
  offline: { label: "离线", className: "bg-muted text-muted-foreground border-muted" },
  error: { label: "异常", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

interface ToolAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

export default function RemoteControl() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get("id") || "";
  const [device, setDevice] = useState<CloudDevice | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const found = cloudDevices.find((d) => d.id === deviceId);
    setDevice(found || null);
    if (found) {
      // Simulate connection
      const timer = setTimeout(() => setIsConnected(true), 800);
      return () => clearTimeout(timer);
    }
  }, [deviceId]);

  if (!device) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <Smartphone className="h-16 w-16 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground">设备未找到</p>
          <Button variant="outline" onClick={() => navigate("/devices")}>
            <ArrowLeft className="h-4 w-4 mr-2" />返回设备列表
          </Button>
        </div>
      </div>
    );
  }

  const st = statusConfig[device.status];

  const handleAction = (action: string) => {
    toast({ title: `${action}`, description: `已向 ${device.name} 发送${action}指令` });
  };

  const toolbarActions: ToolAction[] = [
    { icon: <Camera className="h-4 w-4" />, label: "截图", onClick: () => handleAction("截图") },
    { icon: <Volume2 className="h-4 w-4" />, label: "音量+", onClick: () => handleAction("音量增加") },
    { icon: <VolumeX className="h-4 w-4" />, label: "音量-", onClick: () => handleAction("音量减少") },
    { icon: <Upload className="h-4 w-4" />, label: "上传文件", onClick: () => handleAction("上传文件") },
    { icon: <Download className="h-4 w-4" />, label: "下载文件", onClick: () => handleAction("下载文件") },
    { icon: <Keyboard className="h-4 w-4" />, label: "输入法", onClick: () => handleAction("切换输入法") },
    { icon: <Settings className="h-4 w-4" />, label: "设置", onClick: () => handleAction("打开设置") },
  ];

  const dangerActions: ToolAction[] = [
    { icon: <RotateCw className="h-4 w-4" />, label: "重启", onClick: () => handleAction("重启"), variant: "destructive" },
    { icon: <Lock className="h-4 w-4" />, label: "锁屏", onClick: () => handleAction("锁屏") },
    { icon: <Power className="h-4 w-4" />, label: "关机", onClick: () => handleAction("关机"), variant: "destructive" },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/devices")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">返回</span>
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{device.name}</span>
            <span className="font-mono text-xs text-muted-foreground">({device.id})</span>
          </div>
          <Badge variant="outline" className={st.className + " text-[10px]"}>{st.label}</Badge>
          {isConnected && (
            <div className="flex items-center gap-1.5 text-xs text-success">
              <Wifi className="h-3 w-3" />
              <span>已连接</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? "退出全屏" : "全屏"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 text-xs">
                <div>SN: {device.sn}</div>
                <div>IP: {device.ip}</div>
                <div>区域: {device.region}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex bg-[hsl(var(--muted)/0.3)] overflow-hidden">
        {/* Phone screen area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="relative flex flex-col items-center">
            {/* Phone frame */}
            <div className="relative rounded-[2rem] border-[3px] border-foreground/10 bg-foreground/5 shadow-2xl overflow-hidden"
              style={{ width: "320px", height: "640px" }}
            >
              {/* Screen content */}
              {!isConnected ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-background/80">
                  <div className="relative">
                    <Smartphone className="h-12 w-12 text-muted-foreground/40 animate-pulse" />
                  </div>
                  <div className="text-sm text-muted-foreground">正在连接...</div>
                  <div className="w-32 h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
                  </div>
                </div>
              ) : device.screenshot ? (
                <img
                  src={device.screenshot}
                  alt="Phone screen"
                  className="w-full h-full object-cover cursor-pointer"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-sky-400 to-teal-300 flex items-end justify-center pb-16">
                  <div className="text-white/60 text-xs">实时画面</div>
                </div>
              )}
            </div>

            {/* Android navigation bar */}
            <div className="mt-4 flex items-center gap-8">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleAction("返回")}
                    className="h-10 w-10 rounded-full flex items-center justify-center bg-card border border-border hover:bg-accent transition-colors shadow-sm"
                  >
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>返回</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleAction("主页")}
                    className="h-12 w-12 rounded-full flex items-center justify-center bg-card border-2 border-border hover:bg-accent transition-colors shadow-sm"
                  >
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>主页</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleAction("最近任务")}
                    className="h-10 w-10 rounded-full flex items-center justify-center bg-card border border-border hover:bg-accent transition-colors shadow-sm"
                  >
                    <Square className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>最近任务</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Right toolbar */}
        <div className="w-16 border-l bg-card flex flex-col items-center py-4 gap-1">
          <div className="text-[10px] font-medium text-muted-foreground mb-2 tracking-wider">工具</div>
          
          {toolbarActions.map((action, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <button
                  onClick={action.onClick}
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {action.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">{action.label}</TooltipContent>
            </Tooltip>
          ))}

          <Separator className="my-2 w-8" />
          
          <div className="text-[10px] font-medium text-muted-foreground mb-2 tracking-wider">控制</div>
          
          {dangerActions.map((action, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <button
                  onClick={action.onClick}
                  className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
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
                <button className="h-10 w-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">更多</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
