import { leads } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stages = ["新线索", "跟进中", "意向客户", "已成交"] as const;
const stageColors = {
  "新线索": "border-primary/30",
  "跟进中": "border-warning/30",
  "意向客户": "border-success/30",
  "已成交": "border-muted",
};

export default function Leads() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">线索管理</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          return (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{stage}</h3>
                <Badge variant="secondary">{stageLeads.length}</Badge>
              </div>
              <div className="space-y-2">
                {stageLeads.map((lead) => (
                  <Card key={lead.id} className={`border-l-4 ${stageColors[stage]}`}>
                    <CardContent className="p-3 space-y-1">
                      <div className="font-medium text-sm">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.company}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{lead.source}</span>
                        {lead.value > 0 && <span className="font-mono text-xs text-success">¥{lead.value.toLocaleString()}</span>}
                      </div>
                      {lead.assignee && <div className="text-xs text-muted-foreground">负责人: {lead.assignee}</div>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
