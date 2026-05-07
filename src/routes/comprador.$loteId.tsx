import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, MapPin, Calendar, User, Package, Hash, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { SiteNavbar, SiteFooter } from "@/components/site-navbar";
import { toast } from "sonner";

export const Route = createFileRoute("/comprador/$loteId")({
  head: ({ params }) => ({
    meta: [
      { title: `Lote ${params.loteId} — TracePerú` },
      { name: "description", content: "Trazabilidad verificable del lote agrícola." },
    ],
  }),
  component: VistaComprador,
});

function VistaComprador() {
  const { loteId } = Route.useParams();
  const lotes = useStore((s) => s.lotes);
  const wallet = useStore((s) => s.walletAddress);
  const payLote = useStore((s) => s.payLote);
  const lote = lotes.find((l) => l.id === loteId) || lotes[0];
  const [paying, setPaying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!lote) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteNavbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Lote no encontrado</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const yaPagado = lote.estado === "Pagado";

  const onPay = async () => {
    if (!wallet) {
      toast.error("Conecta tu wallet primero");
      return;
    }
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500));
    const hash = payLote(lote.id);
    setTxHash(hash);
    setPaying(false);
    toast.success("Pago enviado correctamente en Stellar Testnet", { description: hash });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="border-border/60 shadow-[var(--shadow-soft)]">
              <CardContent className="flex flex-col items-center p-10">
                <Badge className="mb-4 gap-1 border-0 bg-primary/10 text-primary" variant="secondary">
                  <ShieldCheck className="h-3 w-3" /> Verificado en Stellar
                </Badge>
                <div className="rounded-2xl border border-border/60 bg-card p-6">
                  <QRCodeSVG
                    value={JSON.stringify({ id: lote.id, producto: lote.producto, productor: lote.productor })}
                    size={240}
                    bgColor="transparent"
                    fgColor="oklch(0.18 0.02 240)"
                  />
                </div>
                <p className="mt-6 font-mono text-sm text-muted-foreground">{lote.id}</p>
                <p className="mt-1 text-xs text-muted-foreground">Escanea para verificar trazabilidad</p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary">Producto certificado</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight">{lote.producto}</h1>
                <p className="mt-2 text-muted-foreground">Cantidad: {lote.cantidad}</p>
              </div>
              <div className="space-y-3 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                <Row icon={User} label="Productor" value={lote.productor} />
                <Row icon={MapPin} label="Ubicación" value={lote.ubicacion} />
                <Row icon={Calendar} label="Fecha de registro" value={lote.fecha} />
                <Row icon={Package} label="ID Lote" value={lote.id} mono />
                <Row icon={Hash} label="Hash Stellar" value={lote.hash} mono />
                <div className="flex items-center gap-3 border-t border-border/60 pt-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Estado validado en blockchain</span>
                </div>
              </div>
              {yaPagado || txHash ? (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-2 font-semibold">Pago enviado correctamente en Stellar Testnet</p>
                  <p className="text-sm text-muted-foreground">$120 USDC enviados al productor</p>
                  {txHash && <p className="mt-2 font-mono text-xs text-muted-foreground">{txHash}</p>}
                </div>
              ) : (
                <Button size="lg" className="w-full gap-2 shadow-[var(--shadow-elegant)]" onClick={onPay} disabled={paying}>
                  {paying ? (<><Loader2 className="h-4 w-4 animate-spin" /> Procesando pago en Stellar…</>) : "Simular Pago Premium"}
                </Button>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link to="/lote/$loteId" params={{ loteId: lote.id }}>Ver detalle completo</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ icon: Icon, label, value, mono }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <span className={`text-sm font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}