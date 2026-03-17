import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TenantConfig() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">租户配置</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">套餐信息</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">当前套餐</span>
            <Badge>企业旗舰版</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">云机额度</span>
            <span className="font-mono">60 台</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">IP额度</span>
            <span className="font-mono">80 个</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">月点数</span>
            <span className="font-mono">50,000 点</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">功能开关</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "ai-video", label: "AI视频创作", desc: "启用AI脚本与智能剪辑功能", on: true },
            { id: "crm", label: "获客CRM", desc: "启用线索采集与CRM管理", on: true },
            { id: "customs", label: "海关数据", desc: "启用海关贸易数据检索", on: false },
            { id: "dedicated-bw", label: "专线带宽", desc: "启用直播专用带宽通道", on: true },
          ].map(feat => (
            <div key={feat.id} className="flex items-center justify-between">
              <div>
                <Label>{feat.label}</Label>
                <p className="text-xs text-muted-foreground">{feat.desc}</p>
              </div>
              <Switch defaultChecked={feat.on} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
