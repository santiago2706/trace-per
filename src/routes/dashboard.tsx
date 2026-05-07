import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, TrendingUp, PackagePlus, ExternalLink, Inbox } from "lucide-react";
import { useStore } from "@/lib/store";
import { WalletButton } from "@/components/wallet-button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TracePerú" },
      { name: "description", content: "Gestiona tus lotes, pagos y trazabilidad." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isIndex = pathname === "/dashboard";
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/60 bg-card px-6">
          <div>
            <p className="text-xs text-muted-foreground">Productor</p>
            <h1 className="text-sm font-semibold">Cooperativa Andina</h1>
          </div>
          <WalletButton />
        </header>
        <main className="flex-1 p-6 md:p-8">
          {isIndex ? <DashboardHome /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}

function DashboardHome() {
  const lotes = useStore((s) => s.lotes);
  const pagados = lotes.filter((l) => l.estado === "Pagado");
  const premium = lotes.reduce((acc, l) => acc + l.premium, 0);
  const stats = [
    { label: "Lotes registrados", value: String(lotes.length), icon: Package, trend: `${lotes.length} en total` },
    { label: "Pagos recibidos", value: `$${(pagados.length * 120).toLocaleString()}`, icon: DollarSign, trend: `${pagados.length} pagos` },
    { label: "Premium generado", value: `$${premium.toLocaleString()}`, icon: TrendingUp, trend: "Stellar Testnet" },
  ];
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Resumen</h2>
          <p className="text-sm text-muted-foreground">Estado actual de tus lotes y pagos.</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/dashboard/registrar"><PackagePlus className="h-4 w-4" /> Registrar nuevo lote</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</p>
              <p className="mt-1 text-xs text-primary">{s.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60">
          <CardTitle className="text-base">Lotes recientes</CardTitle>
          <Button size="sm" variant="ghost">Ver todos</Button>
        </CardHeader>
        <CardContent className="p-0">
          {lotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Inbox className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Aún no hay lotes</p>
              <p className="text-xs text-muted-foreground">Registra tu primer lote para empezar.</p>
              <Button asChild size="sm" className="mt-2 gap-2">
                <Link to="/dashboard/registrar"><PackagePlus className="h-4 w-4" /> Registrar lote</Link>
              </Button>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Producto</th>
                  <th className="px-6 py-3 font-medium">Cantidad</th>
                  <th className="px-6 py-3 font-medium">Ubicación</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {lotes.map((l) => (
                  <tr key={l.id} className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/40">
                    <td className="px-6 py-4 font-mono text-xs font-medium">{l.id}</td>
                    <td className="px-6 py-4">{l.producto}</td>
                    <td className="px-6 py-4 text-muted-foreground">{l.cantidad}</td>
                    <td className="px-6 py-4 text-muted-foreground">{l.ubicacion}</td>
                    <td className="px-6 py-4">
                      <EstadoBadge estado={l.estado} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button asChild size="sm" variant="ghost" className="gap-1">
                        <Link to="/lote/$loteId" params={{ loteId: l.id }}>
                          Ver <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    Registrado: "bg-muted text-muted-foreground",
    Validado: "bg-primary/10 text-primary",
    Pagado: "bg-primary text-primary-foreground",
  };
  return <Badge className={`${map[estado] || ""} border-0 font-medium`} variant="secondary">{estado}</Badge>;
}