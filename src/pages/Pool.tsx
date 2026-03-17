import { leads } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const poolLeads = leads.filter(l => l.stage === "新线索");

export default function Pool() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">公海池</h1>
      <p className="text-sm text-muted-foreground">未分配的线索在此处，团队成员可主动领取跟进。</p>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>公司</TableHead>
              <TableHead>来源</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {poolLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell className="text-muted-foreground">{lead.source}</TableCell>
                <TableCell><Button size="sm" variant="outline">领取</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
