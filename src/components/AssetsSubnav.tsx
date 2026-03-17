import { ImagePlus, Library } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const items = [
  { label: "素材库", to: "/assets", icon: Library, end: true },
  { label: "手持商品图", to: "/assets/handheld-product", icon: ImagePlus },
];

export function AssetsSubnav() {
  return (
    <nav aria-label="素材中心二级导航" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive && "border-primary bg-primary/10 text-primary",
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
