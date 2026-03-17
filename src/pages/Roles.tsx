import { roles } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const permissions = ["云机管理", "IP管理", "账号管理", "发帖", "CRM", "计费", "审计"];
const permMatrix: Record<string, string[]> = {
  "超级管理员": permissions,
  "运营经理": ["云机管理", "IP管理", "账号管理", "发帖"],
  "运营专员": ["账号管理", "发帖"],
  "销售": ["CRM"],
  "只读": [],
};

export default function Roles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">角色权限</h1>
        <Button>+ 新建角色</Button>
      </div>
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">角色</TableHead>
              <TableHead className="w-20">成员</TableHead>
              {permissions.map(p => <TableHead key={p} className="text-center w-24">{p}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{role.name}</div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{role.members}</TableCell>
                {permissions.map(p => (
                  <TableCell key={p} className="text-center">
                    <Checkbox checked={permMatrix[role.name]?.includes(p)} disabled />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
