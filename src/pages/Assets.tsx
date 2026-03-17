import { contentAssets } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Image, Music, Upload } from "lucide-react";

const typeIcons = { "视频": Video, "图片": Image, "音频": Music };
const typeColors = { "视频": "bg-primary/10 text-primary", "图片": "bg-success/10 text-success", "音频": "bg-warning/10 text-warning" };

export default function Assets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">素材中心</h1>
        <Button><Upload className="h-4 w-4 mr-2" />上传素材</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {contentAssets.map((asset) => {
          const Icon = typeIcons[asset.type];
          return (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted/50 rounded-t-lg flex items-center justify-center">
                  <Icon className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-sm font-medium truncate">{asset.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={typeColors[asset.type]}>{asset.type}</Badge>
                    <span className="text-xs text-muted-foreground font-mono">{asset.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.map(tag => (
                      <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">{tag}</span>
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
