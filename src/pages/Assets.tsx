import { contentAssets } from "@/lib/mock-data";
import { AssetsSubnav } from "@/components/AssetsSubnav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Image, Music, Upload } from "lucide-react";

const typeIcons = { "视频": Video, "图片": Image, "音频": Music };
const typeColors = { "视频": "bg-primary/10 text-primary", "图片": "bg-success/10 text-success", "音频": "bg-warning/10 text-warning" };

export default function Assets() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">素材中心</h1>
          <Button><Upload className="mr-2 h-4 w-4" />上传素材</Button>
        </div>
        <AssetsSubnav />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contentAssets.map((asset) => {
          const Icon = typeIcons[asset.type];
          return (
            <Card key={asset.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-0">
                <div className="aspect-video rounded-t-lg bg-muted/50 flex items-center justify-center">
                  <Icon className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <div className="space-y-2 p-4">
                  <div className="truncate text-sm font-medium">{asset.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={typeColors[asset.type]}>{asset.type}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">{asset.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.map((tag) => (
                      <span key={tag} className="rounded bg-muted px-2 py-0.5 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
