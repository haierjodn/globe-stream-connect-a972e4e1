import { UploadCloud, WandSparkles } from "lucide-react";

import { AssetsSubnav } from "@/components/AssetsSubnav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function HandheldProductImage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">素材中心</h1>
            <p className="text-sm text-muted-foreground">在二级功能中配置商品文案、语音与字幕参数，生成手持商品图视频素材。</p>
          </div>
        </div>
        <AssetsSubnav />
      </div>

      <Card>
        <CardContent className="space-y-8 p-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-base font-semibold after:ml-1 after:text-destructive after:content-['*']">上传营销图</Label>
              <Button variant="link" className="h-auto px-0 text-sm">素材选择</Button>
            </div>
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
              <UploadCloud className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-medium">请上传图片素材文档</p>
              <p className="mt-2 text-sm text-muted-foreground">支持 JPG、PNG 与商品营销图说明文档，后续可接入素材库选择。</p>
            </div>
          </section>

          <section className="space-y-3">
            <Label htmlFor="product-copy" className="text-base font-semibold after:ml-1 after:text-destructive after:content-['*']">商品文案</Label>
            <div className="rounded-xl border border-border bg-background p-1">
              <Textarea
                id="product-copy"
                rows={6}
                maxLength={500}
                placeholder="请输入商品文案"
                className="min-h-40 resize-none border-0 shadow-none focus-visible:ring-0"
              />
              <div className="px-3 pb-3 text-right text-sm text-muted-foreground">0 / 500</div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-base font-semibold after:ml-1 after:text-destructive after:content-['*']">口播语音</Label>
                <Button variant="link" className="h-auto px-0 text-sm">编辑音色</Button>
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择口播语音" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female-warm">知性女声</SelectItem>
                  <SelectItem value="male-steady">沉稳男声</SelectItem>
                  <SelectItem value="young-bright">活力青年音</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold after:ml-1 after:text-destructive after:content-['*']">配音语种</Label>
              <Select defaultValue="zh-cn">
                <SelectTrigger>
                  <SelectValue placeholder="请选择配音语种" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-cn">中文(简体)</SelectItem>
                  <SelectItem value="en-us">English</SelectItem>
                  <SelectItem value="es-es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">口播情绪</Label>
              <Select defaultValue="calm">
                <SelectTrigger>
                  <SelectValue placeholder="请选择口播情绪" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calm">默认/平和</SelectItem>
                  <SelectItem value="excited">兴奋带货</SelectItem>
                  <SelectItem value="professional">专业讲解</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-base font-semibold">视频背景音乐</Label>
                <Button variant="link" className="h-auto px-0 text-sm">编辑背景音乐</Button>
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择背景音乐" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">轻快带货</SelectItem>
                  <SelectItem value="clean">简洁讲解</SelectItem>
                  <SelectItem value="warm">温暖生活感</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
            <div className="space-y-3">
              <Label className="text-base font-semibold">字幕效果</Label>
              <div className="flex min-h-14 items-center rounded-xl border border-border bg-background px-4">
                <div className="flex items-center gap-3">
                  <Switch defaultChecked aria-label="字幕效果开关" />
                  <span className="text-sm text-muted-foreground">开启后自动生成字幕与基础时间轴。</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">字幕样式</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择字幕样式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clean">简洁白底</SelectItem>
                  <SelectItem value="highlight">关键词高亮</SelectItem>
                  <SelectItem value="promo">电商促销风</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <div className="flex justify-end">
            <Button size="lg" className="min-w-44">
              <WandSparkles className="mr-2 h-4 w-4" />
              立即生成
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
