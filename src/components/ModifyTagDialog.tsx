import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface TagItem {
  id: string;
  name: string;
  accountCount: number;
  videoAvailable: number;
  videoTotal: number;
}

const mockTags: TagItem[] = [
  { id: "1", name: "默认", accountCount: 383, videoAvailable: 29, videoTotal: 71 },
  { id: "2", name: "音乐", accountCount: 0, videoAvailable: 0, videoTotal: 0 },
  { id: "3", name: "3C数码", accountCount: 0, videoAvailable: 0, videoTotal: 0 },
  { id: "4", name: "消费电子", accountCount: 1, videoAvailable: 3, videoTotal: 3 },
  { id: "5", name: "我的相机", accountCount: 0, videoAvailable: 0, videoTotal: 0 },
  { id: "6", name: "苹果", accountCount: 0, videoAvailable: 0, videoTotal: 0 },
  { id: "7", name: "音乐.风景", accountCount: 1, videoAvailable: 0, videoTotal: 7 },
  { id: "8", name: "美妆", accountCount: 5, videoAvailable: 12, videoTotal: 20 },
  { id: "9", name: "户外运动", accountCount: 2, videoAvailable: 4, videoTotal: 8 },
  { id: "10", name: "家居生活", accountCount: 3, videoAvailable: 6, videoTotal: 15 },
  { id: "11", name: "美食", accountCount: 8, videoAvailable: 18, videoTotal: 30 },
  { id: "12", name: "萌宠", accountCount: 4, videoAvailable: 9, videoTotal: 14 },
  { id: "13", name: "旅行", accountCount: 2, videoAvailable: 3, videoTotal: 10 },
  { id: "14", name: "穿搭", accountCount: 6, videoAvailable: 15, videoTotal: 25 },
  { id: "15", name: "科技", accountCount: 1, videoAvailable: 2, videoTotal: 5 },
  { id: "16", name: "教育", accountCount: 0, videoAvailable: 0, videoTotal: 0 },
  { id: "17", name: "健身", accountCount: 3, videoAvailable: 7, videoTotal: 12 },
  { id: "18", name: "游戏", accountCount: 7, videoAvailable: 20, videoTotal: 35 },
  { id: "19", name: "汽车", accountCount: 2, videoAvailable: 5, videoTotal: 9 },
  { id: "20", name: "母婴", accountCount: 1, videoAvailable: 1, videoTotal: 4 },
  { id: "21", name: "二次元", accountCount: 4, videoAvailable: 10, videoTotal: 18 },
  { id: "22", name: "摄影", accountCount: 2, videoAvailable: 6, videoTotal: 11 },
  { id: "23", name: "手工", accountCount: 0, videoAvailable: 0, videoTotal: 0 },
  { id: "24", name: "职场", accountCount: 1, videoAvailable: 2, videoTotal: 3 },
  { id: "25", name: "搞笑", accountCount: 9, videoAvailable: 22, videoTotal: 40 },
  { id: "26", name: "情感", accountCount: 3, videoAvailable: 8, videoTotal: 16 },
  { id: "27", name: "知识", accountCount: 2, videoAvailable: 4, videoTotal: 7 },
  { id: "28", name: "设计", accountCount: 1, videoAvailable: 1, videoTotal: 2 },
  { id: "29", name: "农业", accountCount: 0, videoAvailable: 0, videoTotal: 0 },
  { id: "30", name: "体育", accountCount: 5, videoAvailable: 11, videoTotal: 19 },
  { id: "31", name: "医疗", accountCount: 1, videoAvailable: 3, videoTotal: 6 },
  { id: "32", name: "金融", accountCount: 2, videoAvailable: 5, videoTotal: 8 },
  { id: "33", name: "法律", accountCount: 0, videoAvailable: 0, videoTotal: 0 },
  { id: "34", name: "艺术", accountCount: 3, videoAvailable: 7, videoTotal: 13 },
  { id: "35", name: "动漫", accountCount: 6, videoAvailable: 14, videoTotal: 22 },
  { id: "36", name: "历史", accountCount: 1, videoAvailable: 2, videoTotal: 5 },
];

function AddTagDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: (name: string, desc: string) => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleConfirm = () => {
    if (!name.trim()) {
      toast.error("请输入标签名称");
      return;
    }
    onSave(name.trim(), desc.trim());
    setName("");
    setDesc("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>添加标签</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <Label className="whitespace-nowrap shrink-0 w-16 text-right">
              <span className="text-destructive">*</span> 标签名称
            </Label>
            <Input placeholder="请输入标签名称" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex items-start gap-3">
            <Label className="whitespace-nowrap shrink-0 w-16 text-right mt-2">描述</Label>
            <Textarea placeholder="请输入描述" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm}>确 定</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取 消</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ModifyTagDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [tags, setTags] = useState<TagItem[]>(mockTags);
  const [searchName, setSearchName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!searchName.trim()) return tags;
    return tags.filter((t) => t.name.includes(searchName.trim()));
  }, [tags, searchName]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleReset = () => {
    setSearchName("");
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddTag = (name: string, _desc: string) => {
    const newTag: TagItem = {
      id: Date.now().toString(),
      name,
      accountCount: 0,
      videoAvailable: 0,
      videoTotal: 0,
    };
    setTags((prev) => [...prev, newTag]);
    toast.success(`标签「${name}」已创建`);
  };

  const handleConfirm = () => {
    if (selectedIds.size === 0) {
      toast.error("请至少选择一个标签");
      return;
    }
    const selectedNames = tags.filter((t) => selectedIds.has(t.id)).map((t) => t.name);
    toast.success(`已选择标签：${selectedNames.join("、")}`);
    onOpenChange(false);
  };

  const renderPageButtons = () => {
    const buttons: React.ReactNode[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === page ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setPage(i)}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between pr-8">
            <DialogTitle>修改标签</DialogTitle>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>新建标签</Button>
          </DialogHeader>

          {/* Search */}
          <div className="flex items-center gap-3">
            <Label className="whitespace-nowrap shrink-0 text-sm text-muted-foreground">标签名称</Label>
            <Input
              placeholder="请输入"
              value={searchName}
              onChange={(e) => { setSearchName(e.target.value); setPage(1); }}
              className="max-w-[240px]"
            />
            <Button size="sm" onClick={() => setPage(1)}>
              <Search className="h-3.5 w-3.5 mr-1" />搜索
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3.5 w-3.5 mr-1" />重置
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">已选标签：</p>

          {/* Table */}
          <div className="flex-1 overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">标签名称</TableHead>
                  <TableHead className="text-center">账号数量</TableHead>
                  <TableHead className="text-center">视频数量(TikTok可使用/总数)</TableHead>
                  <TableHead className="text-center w-[80px]">选择</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell className="text-center">{tag.accountCount}</TableCell>
                    <TableCell className="text-center">{tag.videoAvailable} / {tag.videoTotal}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.has(tag.id)}
                        onCheckedChange={() => toggleSelect(tag.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">暂无数据</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-sm text-muted-foreground">共 {filtered.length} 条</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {renderPageButtons()}
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10条/页</SelectItem>
                <SelectItem value="20">20条/页</SelectItem>
                <SelectItem value="50">50条/页</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button onClick={handleConfirm}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddTagDialog open={addOpen} onOpenChange={setAddOpen} onSave={handleAddTag} />
    </>
  );
}
