import { departments } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, ChevronRight } from "lucide-react";

export default function Org() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">组织架构</h1>
        <Button>+ 添加部门</Button>
      </div>
      {departments.map((dept) => (
        <Card key={dept.id}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" />
              {dept.name}
              <span className="text-xs text-muted-foreground font-normal ml-2">{dept.memberCount} 人</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dept.children?.map((child) => (
                <div key={child.id} className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{child.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{child.memberCount} 人</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
