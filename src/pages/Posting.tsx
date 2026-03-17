import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { socialAccounts, contentAssets } from "@/lib/mock-data";
import { Video, Image, Music } from "lucide-react";

const typeIcons = { "视频": Video, "图片": Image, "音频": Music };

export default function Posting() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">批量发帖</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Video selection */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">选择素材</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {contentAssets.filter(a => a.type === "视频").map((asset) => {
              const Icon = typeIcons[asset.type];
              return (
                <label key={asset.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                  <Checkbox />
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm truncate">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">{asset.size}</div>
                  </div>
                </label>
              );
            })}
          </CardContent>
        </Card>

        {/* Middle: Account selection */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">选择账号</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {socialAccounts.filter(a => a.status === "正常").map((acc) => (
              <label key={acc.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                <Checkbox />
                <div>
                  <div className="text-sm font-mono">{acc.username}</div>
                  <div className="text-xs text-muted-foreground">{acc.device} · {acc.followers.toLocaleString()} 粉丝</div>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Right: Schedule */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">发布配置</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>发布标题</Label>
              <Input placeholder="输入视频标题..." />
            </div>
            <div className="space-y-2">
              <Label>话题标签</Label>
              <Input placeholder="#跨境电商 #TikTok" />
            </div>
            <div className="space-y-2">
              <Label>定时发布</Label>
              <Input type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label>发布间隔（分钟）</Label>
              <Input type="number" defaultValue={15} min={5} />
            </div>
            <Button className="w-full">开始批量发布</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
