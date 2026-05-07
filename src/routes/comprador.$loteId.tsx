import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Hash,
  Loader2,
  MapPin,
  Package,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter, SiteNavbar } from "@/components/site-navbar";
import { getLotUrl } from "@/lib/lot-url";
import { useStore } from "@/lib/store";
import { getTxExplorerUrl, submitPremiumPayment, truncateAddress } from "@/lib/stellar";
import { toast } from "sonner";

export const Route = createFileRoute("/comprador/$loteId")({
  head: ({ params }) => ({
    meta: [
      { title: `Lote ${params.loteId} - TracePeru` },
      { name: "description", content: "Trazabilidad verificable del lote agricola." },
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

  const verifiedHash = txHash || (lote.hash.startsWith("Pendiente") ? null : lote.hash);
  const yaPagado = lote.estado === "Pagado";

  const onPay = async () => {
    if (!wallet) {
      toast.error("Conecta Freighter primero");
      return;
    }

    setPaying(true);
    try {
      const payment = await submitPremiumPayment({ sourceAddress: wallet, lotId: lote.id });
      payLote(lote.id, payment.hash, wallet);
      setTxHash(payment.hash);
      toast.success("Verified on Stellar Testnet", { description: payment.hash });
    } catch (error) {
      toast.error("No se pudo enviar la transaccion", {
        description: error instanceof Error ? error.message : "Revisa Freighter y tu balance Testnet.",
      });
    } finally {
      setPaying(false);
    }
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
                  <ShieldCheck className="h-3 w-3" /> Blockchain verified
                </Badge>
                <div className="rounded-2xl border border-border/60 bg-card p-6">
                  <QRCodeSVG
                    value={getLotUrl(lote.id)}
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
                <Row icon={MapPin} label="Ubicacion" value={lote.ubicacion} />
                <Row icon={Calendar} label="Fecha de registro" value={lote.fecha} />
                <Row icon={Package} label="ID Lote" value={lote.id} mono />
                <Row icon={Hash} label="Hash Stellar" value={verifiedHash || "Pendiente de pago"} mono />
                <div className="flex items-center gap-3 border-t border-border/60 pt-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Blockchain verified</span>
                </div>
              </div>

              {yaPagado || verifiedHash ? (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className="gap-1 border-0 bg-primary text-primary-foreground">
                        <CheckCircle2 className="h-3 w-3" /> Confirmed
                      </Badge>
                      <p className="mt-3 text-lg font-semibold">Verified on Stellar Testnet</p>
                      <p className="text-sm text-muted-foreground">Pago premium registrado con una transaccion real.</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-primary">
                      <WalletCards className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 rounded-lg border border-border/60 bg-background/70 p-4">
                    <TxRow label="Transaction hash" value={verifiedHash || ""} />
                    <TxRow label="Wallet address" value={wallet || lote.walletAddress || "Freighter wallet"} />
                    <TxRow label="Network" value="Stellar Testnet" />
                    <TxRow label="Status" value="Confirmed" />
                  </div>
                  {verifiedHash && (
                    <Button asChild variant="outline" className="mt-4 w-full gap-2">
                      <a href={getTxExplorerUrl(verifiedHash)} target="_blank" rel="noreferrer">
                        Ver en Stellar Expert <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                <Button size="lg" className="w-full gap-2 shadow-[var(--shadow-elegant)]" onClick={onPay} disabled={paying}>
                  {paying ? (<><Loader2 className="h-4 w-4 animate-spin" /> Enviando a Stellar Testnet...</>) : "Simulate Premium Payment"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <span className={`break-all text-right text-sm font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

function TxRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:items-start">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="break-all font-mono text-xs font-semibold">
        {value.startsWith("G") ? truncateAddress(value) : value}
      </span>
    </div>
  );
}
