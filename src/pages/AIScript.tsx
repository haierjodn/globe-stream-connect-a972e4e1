import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

export default function AIScript() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI脚本生成</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Config */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">生成配置</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>产品知识库</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择知识库..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion">时尚服饰</SelectItem>
                  <SelectItem value="beauty">美妆护肤</SelectItem>
                  <SelectItem value="electronics">消费电子</SelectItem>
                  <SelectItem value="home">家居用品</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>目标语言</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择语言..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="th">ภาษาไทย</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>脚本风格</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择风格..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">产品测评</SelectItem>
                  <SelectItem value="tutorial">使用教程</SelectItem>
                  <SelectItem value="story">故事叙述</SelectItem>
                  <SelectItem value="promo">促销推广</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>补充要求</Label>
              <Textarea placeholder="例如：突出产品性价比，适合年轻女性..." rows={3} />
            </div>
            <Button className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />生成脚本
            </Button>
          </CardContent>
        </Card>

        {/* Right: Output */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">脚本输出</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border bg-muted/30 p-4 min-h-[400px]">
              <p className="text-sm text-muted-foreground italic">点击「生成脚本」按钮，AI将根据知识库和配置自动生成营销脚本...</p>
              <div className="mt-4 space-y-3 text-sm">
                <p className="font-medium text-muted-foreground">[示例输出]</p>
                <p>🎬 Hook: "你还在为选品发愁吗？"</p>
                <p>📍 Scene 1: 产品特写镜头，展示细节质感</p>
                <p>💬 Voiceover: "This product changed my morning routine..."</p>
                <p>🏷️ CTA: "限时优惠，点击链接立即购买！"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
