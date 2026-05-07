import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, PackagePlus, QrCode, Leaf, Wallet, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Registrar Lote", url: "/dashboard/registrar", icon: PackagePlus },
  { title: "Mis Lotes", url: "/dashboard", icon: Package },
  { title: "Vista Comprador", url: "/comprador/TP-001", icon: QrCode },
];

export function DashboardSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-sidebar md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border/60 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight">TracePerú</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const active = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url));
          return (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/60 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wallet className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Wallet</p>
            <p className="truncate text-sm font-medium">GA7X…JQ2P</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-primary" />
        </div>
      </div>
    </aside>
  );
}