import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, FileText, Eye } from "lucide-react";

const steps = [
  { icon: Upload, title: "选择素材", desc: "从素材中心选择视频/图片" },
  { icon: FileText, title: "匹配脚本", desc: "选择或生成AI脚本" },
  { icon: Eye, title: "预览成片", desc: "自动合成并预览最终视频" },
];

export default function Editing() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">智能剪辑 / 一键成片</h1>

      {/* Workflow steps */}
      <div className="flex items-center justify-center gap-4 py-8">
        {steps.map((step, i) => (
          <div key={step.title} className="flex items-center gap-4">
            <Card className="w-52 text-center">
              <CardContent className="p-6 space-y-3">
                <step.icon className="h-8 w-8 mx-auto text-primary" />
                <div className="font-medium">{step.title}</div>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
                <Button variant="outline" size="sm" className="w-full">{i === 2 ? "生成" : "选择"}</Button>
              </CardContent>
            </Card>
            {i < steps.length - 1 && <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">最近成片</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">暂无成片记录，请通过上方流程创建视频。</p>
        </CardContent>
      </Card>
    </div>
  );
}
