import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { HelpCircle, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ── BGM违规设置 子弹窗 ──
function BGMSettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [replaceSwitch, setReplaceSwitch] = useState<"on" | "off">("off");
  const [replaceRule, setReplaceRule] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>BGM违规设置</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4">
            <Label className="shrink-0">替换开关</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="bgm-switch"
                  checked={replaceSwitch === "on"}
                  onChange={() => setReplaceSwitch("on")}
                  className="accent-primary"
                />
                <span className={replaceSwitch === "on" ? "text-primary font-medium" : "text-muted-foreground"}>开启</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="bgm-switch"
                  checked={replaceSwitch === "off"}
                  onChange={() => setReplaceSwitch("off")}
                  className="accent-primary"
                />
                <span className={replaceSwitch === "off" ? "text-primary font-medium" : "text-muted-foreground"}>关闭</span>
              </label>
            </div>
          </div>

          {replaceSwitch === "on" && (
            <div className="flex items-center gap-4">
              <Label className="shrink-0">替换规则</Label>
              <Select value={replaceRule} onValueChange={setReplaceRule}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">随机替换BGM</SelectItem>
                  <SelectItem value="keyword">关键词替换</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            提示：发布作品时，当出现视频的背景音乐违规时，按照设置的规则自动替换
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取 消</Button>
          <Button onClick={() => { toast.success("BGM违规设置已保存"); onOpenChange(false); }}>确 定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Radio 组件 ──
function RadioOption({ name, value, checked, onChange, label }: {
  name: string; value: string; checked: boolean; onChange: (v: string) => void; label: string;
}) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input type="radio" name={name} checked={checked} onChange={() => onChange(value)} className="accent-primary" />
      <span className={checked ? "text-primary font-medium" : "text-muted-foreground"}>{label}</span>
    </label>
  );
}

// ── 带问号提示的Label ──
function LabelWithTip({ label, tip, required }: { label: string; tip?: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-1 mb-1.5">
      {required && <span className="text-destructive">*</span>}
      <Label className="text-sm">{label}</Label>
      {tip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent><p className="max-w-[200px] text-xs">{tip}</p></TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

// ── 主弹窗 ──
export function PublishVideoDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  // 维度
  const [dimension, setDimension] = useState<"account" | "tag">("account");
  // 发布方式
  const [publishMode, setPublishMode] = useState<"fuzzy" | "precise">("precise");
  // 基本字段
  const [taskName, setTaskName] = useState("");
  const [location, setLocation] = useState("disabled");
  const [timezone, setTimezone] = useState("Asia/Shanghai");
  // 日期时间 - 精准发布
  const [publishDate, setPublishDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // 日期时间 - 模糊匹配
  const [dateMode, setDateMode] = useState<"range" | "custom">("range");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [publishCount, setPublishCount] = useState(1);
  const [videoTag, setVideoTag] = useState("");
  // 配音
  const [dubbing, setDubbing] = useState<"auto" | "none">("none");
  const [musicSource, setMusicSource] = useState("recommend");
  // 开关
  const [saveMaterialCode, setSaveMaterialCode] = useState(false);
  const [linkEnabled, setLinkEnabled] = useState(false);
  // 挂链接
  const [linkType, setLinkType] = useState<"product" | "campaign">("product");
  const [productId, setProductId] = useState("");
  const [cartTitle, setCartTitle] = useState("");
  const [productLink, setProductLink] = useState("");
  const [linkCount, setLinkCount] = useState("1");
  const [campaignLink, setCampaignLink] = useState("");
  // BGM弹窗
  const [bgmOpen, setBgmOpen] = useState(false);

  const now = new Date();
  const localTimeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between pr-8">
            <DialogTitle>发布视频</DialogTitle>
            <Button variant="outline" size="sm" onClick={() => setBgmOpen(true)}>BGM违规设置</Button>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Row 1: 维度 + 账号数量/标签 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <LabelWithTip label="维度" required />
                <div className="flex items-center gap-4 mt-1">
                  <RadioOption name="dimension" value="account" checked={dimension === "account"} onChange={() => setDimension("account")} label="按账号" />
                  <RadioOption name="dimension" value="tag" checked={dimension === "tag"} onChange={() => setDimension("tag")} label="按标签" />
                </div>
              </div>
              <div>
                {dimension === "account" ? (
                  <>
                    <LabelWithTip label="账号数量" />
                    <div className="flex items-center gap-2">
                      <Input value="已选择0个账号" readOnly className="flex-1" />
                      <Button variant="outline" size="sm">选择账号</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <LabelWithTip label="标签" />
                    <Select>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tag1">热门</SelectItem>
                        <SelectItem value="tag2">电商</SelectItem>
                        <SelectItem value="tag3">种草</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
            </div>

            {/* Row 2: 发布方式 + 任务名称 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <LabelWithTip label="发布方式" />
                <div className="flex items-center gap-4 mt-1">
                  <RadioOption name="publish-mode" value="fuzzy" checked={publishMode === "fuzzy"} onChange={() => setPublishMode("fuzzy")} label="模糊匹配" />
                  <RadioOption name="publish-mode" value="precise" checked={publishMode === "precise"} onChange={() => setPublishMode("precise")} label="精准发布" />
                </div>
              </div>
              <div>
                <LabelWithTip label="任务名称" />
                <Input placeholder="请输入任务名称" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
              </div>
            </div>

            {/* Row 3: 添加位置 + 时区 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <LabelWithTip label="添加位置" />
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">禁用</SelectItem>
                    <SelectItem value="enabled">启用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <LabelWithTip label={`时区 (当地时间: ${localTimeStr})`} required />
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Shanghai">中国-上海 (UTC+08:00)</SelectItem>
                    <SelectItem value="America/New_York">美国-纽约 (UTC-05:00)</SelectItem>
                    <SelectItem value="America/Los_Angeles">美国-洛杉矶 (UTC-08:00)</SelectItem>
                    <SelectItem value="Europe/London">英国-伦敦 (UTC+00:00)</SelectItem>
                    <SelectItem value="Asia/Tokyo">日本-东京 (UTC+09:00)</SelectItem>
                    <SelectItem value="Asia/Dubai">阿联酋-迪拜 (UTC+04:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 精准发布: 发布日期 + 发布时间 */}
            {publishMode === "precise" && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <LabelWithTip label="发布日期" required />
                  <Input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
                </div>
                <div>
                  <LabelWithTip label="发布时间" required />
                  <div className="flex items-center gap-2">
                    <Input type="time" placeholder="开始时间" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    <span className="text-muted-foreground">-</span>
                    <Input type="time" placeholder="结束时间" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* 模糊匹配: 发布日期模式 */}
            {publishMode === "fuzzy" && (
              <>
                <div>
                  <LabelWithTip label="发布日期" required />
                  <div className="flex items-center gap-4 mt-1">
                    <RadioOption name="date-mode" value="range" checked={dateMode === "range"} onChange={() => setDateMode("range")} label="时间段" />
                    <RadioOption name="date-mode" value="custom" checked={dateMode === "custom"} onChange={() => setDateMode("custom")} label="自定义日期" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <LabelWithTip label="日期：" required />
                    <div className="flex items-center gap-2">
                      <Input type="date" placeholder="开始日期" value={dateRangeStart} onChange={(e) => setDateRangeStart(e.target.value)} />
                      <span className="text-muted-foreground">-</span>
                      <Input type="date" placeholder="结束日期" value={dateRangeEnd} onChange={(e) => setDateRangeEnd(e.target.value)} />
                      <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 cursor-help" /></TooltipTrigger>
                        <TooltipContent><p className="text-xs">选择发布的日期范围</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <LabelWithTip label="时间" required />
                    <div className="flex items-center gap-2">
                      <Input type="time" placeholder="开始时间" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                      <span className="text-muted-foreground">-</span>
                      <Input type="time" placeholder="结束时间" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                      <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 cursor-help" /></TooltipTrigger>
                        <TooltipContent><p className="text-xs">选择每天的发布时间范围</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <LabelWithTip label="发布数量" required />
                    <Input type="number" min={1} value={publishCount} onChange={(e) => setPublishCount(Number(e.target.value))} />
                  </div>
                  <div>
                    <LabelWithTip label="视频标签" />
                    <Input placeholder="请选择标签" value={videoTag} onChange={(e) => setVideoTag(e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {/* 配音设置 + 条件音乐来源 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <LabelWithTip label="配音设置" required />
                <div className="flex items-center gap-4 mt-1">
                  <RadioOption name="dubbing" value="auto" checked={dubbing === "auto"} onChange={() => setDubbing("auto")} label="自动配音" />
                  <Tooltip>
                    <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                    <TooltipContent><p className="text-xs">系统自动为视频添加配音</p></TooltipContent>
                  </Tooltip>
                  <RadioOption name="dubbing" value="none" checked={dubbing === "none"} onChange={() => setDubbing("none")} label="不配音" />
                  <Tooltip>
                    <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                    <TooltipContent><p className="text-xs">不添加配音，使用原始音频</p></TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {dubbing === "auto" && (
                <div>
                  <LabelWithTip label="音乐来源" required />
                  <div className="flex items-center gap-2">
                    <Select value={musicSource} onValueChange={setMusicSource}>
                      <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommend">推荐</SelectItem>
                        <SelectItem value="favorite">收藏</SelectItem>
                        <SelectItem value="keyword">关键词搜索</SelectItem>
                        <SelectItem value="same">发同款音乐</SelectItem>
                      </SelectContent>
                    </Select>
                    <Tooltip>
                      <TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground shrink-0 cursor-help" /></TooltipTrigger>
                      <TooltipContent><p className="text-xs">选择配音的音乐来源方式</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            {/* 保存素材码 + 作品挂链接 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <LabelWithTip label="保存素材码" />
                <div className="flex items-center gap-2 mt-1">
                  <Switch checked={saveMaterialCode} onCheckedChange={setSaveMaterialCode} />
                  <Tooltip>
                    <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                    <TooltipContent><p className="text-xs">是否保存素材码用于后续追踪</p></TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div>
                <LabelWithTip label="作品挂链接" />
                <div className="flex items-center gap-2 mt-1">
                  <Switch checked={linkEnabled} onCheckedChange={setLinkEnabled} />
                  <Tooltip>
                    <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                    <TooltipContent><p className="text-xs">是否在作品中添加商品或营销链接</p></TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* 挂链接详细配置 */}
            {linkEnabled && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <LabelWithTip label="链接类型" required />
                    <div className="flex items-center gap-4 mt-1">
                      <RadioOption name="link-type" value="product" checked={linkType === "product"} onChange={() => setLinkType("product")} label="商品" />
                      <RadioOption name="link-type" value="campaign" checked={linkType === "campaign"} onChange={() => setLinkType("campaign")} label="营销活动" />
                      <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                        <TooltipContent><p className="text-xs">选择挂链接的类型</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  {linkType === "product" ? (
                    <div>
                      <LabelWithTip label="商品名称/ID" />
                      <Input placeholder="请输入搜索商品关键词或商品ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
                    </div>
                  ) : (
                    <div>
                      <LabelWithTip label="营销活动链接" required />
                      <Input placeholder="请输入" value={campaignLink} onChange={(e) => setCampaignLink(e.target.value)} />
                    </div>
                  )}
                </div>

                {linkType === "product" ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <LabelWithTip label="挂车标题" />
                      <Input placeholder="请输入挂车标题" value={cartTitle} onChange={(e) => setCartTitle(e.target.value)} />
                    </div>
                    <div>
                      <LabelWithTip label="商品链接" />
                      <Input placeholder="请输入商品链接" value={productLink} onChange={(e) => setProductLink(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <LabelWithTip label="链接数量" />
                      <Select value={linkCount} onValueChange={setLinkCount}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">所有作品使用1个链接</SelectItem>
                          <SelectItem value="each">每个作品使用不同链接</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      {dimension === "account" && (
                        <>
                          <LabelWithTip label="账户数量" />
                          <div className="flex items-center gap-2">
                            <Input value="已选择0个账号" readOnly className="flex-1" />
                            <Button variant="outline" size="sm">查看账号</Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 友情提示 */}
            <p className="text-sm text-muted-foreground pt-2">
              友情提示：因TikTok限制，作品描述最多支持5个tag。
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>取 消</Button>
            <Button onClick={() => { toast.success("发布任务已创建"); onOpenChange(false); }}>确 定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BGMSettingsDialog open={bgmOpen} onOpenChange={setBgmOpen} />
    </>
  );
}
