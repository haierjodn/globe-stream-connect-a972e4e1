import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Calendar, Clock } from "lucide-react";

interface AddTapProductDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedCount: number;
}

export function AddTapProductDialog({ open, onOpenChange, selectedCount }: AddTapProductDialogProps) {
  const [taskName, setTaskName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    const remaining = 9 - images.length;
    const selected = Array.from(files).slice(0, remaining);
    for (const f of selected) {
      if (!allowed.includes(f.type)) {
        toast.error(`文件 ${f.name} 格式不支持，仅允许 .jpeg .png .jpg`);
        continue;
      }
      const preview = URL.createObjectURL(f);
      setImages((prev) => [...prev, { file: f, preview }]);
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleConfirm = () => {
    if (!taskName.trim()) { toast.error("请输入任务名称"); return; }
    toast.success("TAP商品添加任务已创建");
    setTaskName("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setImages([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>添加TAP商品</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          {/* 任务名称 */}
          <div className="space-y-2">
            <Label className="font-medium">任务名称</Label>
            <Input placeholder="请输入任务名称" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>

          {/* 发布时间 */}
          <div className="space-y-2">
            <Label className="font-medium">发布时间</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-9" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative flex-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="time" className="pl-9" placeholder="开始时间" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative flex-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="time" className="pl-9" placeholder="结束时间" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
          </div>

          {/* 商品二维码 */}
          <div className="space-y-2">
            <Label className="font-medium">商品二维码</Label>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => fileRef.current?.click()} disabled={images.length >= 9}>
                <Upload className="h-3.5 w-3.5 mr-1" />上传图片
              </Button>
              <span className="text-xs text-muted-foreground">只允许上传格式为 .jpeg .png .jpg 的文件, 最多上传 9 个文件</span>
              <input ref={fileRef} type="file" accept=".jpeg,.jpg,.png" multiple className="hidden" onChange={handleFileChange} />
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 rounded border overflow-hidden group">
                    <img src={img.preview} alt="" className="h-full w-full object-cover" />
                    <button
                      className="absolute top-0 right-0 bg-foreground/60 text-background rounded-bl p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(i)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 账号数量 */}
          <div className="space-y-2">
            <Label className="font-medium">账号数量</Label>
            <div className="inline-block border rounded px-3 py-1.5 text-sm">{selectedCount} 个</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={handleConfirm}>确 定</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取 消</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
