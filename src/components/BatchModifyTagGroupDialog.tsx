import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Download, CloudUpload } from "lucide-react";

export function BatchModifyTagGroupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(f.type) && !f.name.endsWith(".xlsx") && !f.name.endsWith(".xls")) {
      toast.error("仅支持 Excel 格式文件");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (!file) {
      toast.error("请选择文件");
      return;
    }
    toast.success(`文件「${file.name}」已上传，正在处理批量修改`);
    setFile(null);
    onOpenChange(false);
  };

  const handleDownloadTemplate = () => {
    toast.success("导入模板已下载");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setFile(null); onOpenChange(v); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex flex-row items-center justify-between pr-8">
          <DialogTitle>批量修改标签/分组</DialogTitle>
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
            <Download className="h-3.5 w-3.5 mr-1" />下载导入模板
          </Button>
        </DialogHeader>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3">
            <CloudUpload className="h-12 w-12 text-muted-foreground/50" />
            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">点击重新选择文件</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">将文件拖到此区域或点击选择文件</p>
                <p className="text-xs text-muted-foreground">1、支持导入格式：Excel；2、单次只能导入1个文件；</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ""; }}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => { setFile(null); onOpenChange(false); }}>取 消</Button>
          <Button onClick={handleConfirm}>确 定</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
