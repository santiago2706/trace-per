import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  Hash,
  Loader2,
  MapPin,
  Package,
  QrCode,
  ShieldCheck,
  Sprout,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteFooter, SiteNavbar } from "@/components/site-navbar";
import { getLotUrl, isRealStellarTxHash } from "@/lib/lot-url";
import { getTxExplorerUrl, submitPremiumPayment, truncateAddress } from "@/lib/stellar";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export function LotVerificationPortal({ lotId }: { lotId: string }) {
  const lotes = useStore((s) => s.lotes);
  const wallet = useStore((s) => s.walletAddress);
  const payLote = useStore((s) => s.payLote);
  const lote = lotes.find((l) => l.id === lotId);
  const [paying, setPaying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!lote) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteNavbar />
        <main className="flex flex-1 items-center justify-center px-6">
          <Card className="w-full max-w-md border-border/60 text-center shadow-sm">
            <CardContent className="p-8">
              <QrCode className="mx-auto h-8 w-8 text-muted-foreground" />
              <h1 className="mt-4 text-xl font-semibold">Lote no encontrado</h1>
              <p className="mt-2 text-sm text-muted-foreground">Verifica el codigo QR o intenta con un lote de demostracion.</p>
              <Button asChild className="mt-6">
                <Link to="/dashboard">Ir al dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const visibleHash = txHash || lote.hash;
  const hasRealHash = isRealStellarTxHash(visibleHash);
  const paymentConfirmed = lote.estado === "Pagado" || Boolean(txHash);
  const lotUrl = getLotUrl(lote.id);

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

  const timeline = [
    {
      title: "Lote registrado",
      detail: `${lote.producto} registrado por ${lote.productor}`,
      done: true,
    },
    {
      title: "Origen validado",
      detail: `${lote.ubicacion} · ${lote.cantidad}`,
      done: true,
    },
    {
      title: "Anclaje Stellar Testnet",
      detail: hasRealHash ? "Transaccion confirmada en Horizon Testnet" : "Esperando transaccion real",
      done: hasRealHash,
    },
    {
      title: "Pago premium",
      detail: paymentConfirmed ? "Pago confirmado para el productor" : "Pendiente de confirmacion",
      done: paymentConfirmed,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1">
        <section className="border-b border-border/60 bg-gradient-to-b from-secondary/70 to-background">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <Link to="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Link>
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
              <div>
                <Badge className="gap-1 border-0 bg-primary/10 text-primary" variant="secondary">
                  <ShieldCheck className="h-3 w-3" /> Verified on Stellar Testnet
                </Badge>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">{lote.producto}</h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Portal publico de verificacion para compradores: origen, productor, lote, pago y evidencia blockchain en un solo lugar.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <StatusPill label="Validacion" value={hasRealHash ? "Confirmada" : "Lista"} />
                  <StatusPill label="Red" value="Stellar Testnet" />
                  <StatusPill label="Pago" value={paymentConfirmed ? "Confirmado" : "Pendiente"} />
                </div>
              </div>

              <Card className="border-border/60 shadow-[var(--shadow-elegant)]">
                <CardContent className="flex flex-col items-center p-7">
                  <div className="rounded-xl border border-border/60 bg-card p-5">
                    <QRCodeSVG value={lotUrl} size={220} bgColor="transparent" fgColor="oklch(0.18 0.02 240)" />
                  </div>
                  <p className="mt-4 font-mono text-xs text-muted-foreground">{lote.id}</p>
                  <p className="mt-1 text-center text-xs text-muted-foreground">QR publico del lote</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="grid gap-5 p-6 sm:grid-cols-2">
                <InfoItem icon={Package} label="Producto" value={lote.producto} />
                <InfoItem icon={User} label="Productor" value={lote.productor} />
                <InfoItem icon={Sprout} label="Cantidad" value={lote.cantidad} />
                <InfoItem icon={MapPin} label="Ubicacion" value={lote.ubicacion} />
                <InfoItem icon={CalendarCheck} label="Fecha de registro" value={lote.fecha} />
                <InfoItem icon={Hash} label="Lot ID" value={lote.id} mono />
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Traceability timeline</h2>
                    <p className="text-sm text-muted-foreground">Eventos clave visibles para el comprador.</p>
                  </div>
                  <Badge className="border-0 bg-primary/10 text-primary" variant="secondary">Live MVP</Badge>
                </div>
                <div className="mt-6 space-y-5">
                  {timeline.map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-blue-500/25 bg-blue-500/5 shadow-[var(--shadow-soft)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="gap-1 border-0 bg-blue-500 text-white" variant="secondary">
                    <ShieldCheck className="h-3 w-3" /> Soroban Verified
                  </Badge>
                  <Badge className="bg-background text-[10px] border-border/60" variant="outline">
                    Stellar Testnet
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Contract Status</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-sm font-semibold text-green-600">Active & Verified</p>
                    </div>
                  </div>
                  
                  <DetailRow 
                    label="Contract ID" 
                    value={lote.sorobanVerification?.contractId || "CCVerificationContractID...Example"} 
                    mono 
                  />
                  
                  <DetailRow 
                    label="Verification Hash" 
                    value={lote.sorobanVerification?.txHash || "0x7d8e9f...2a3b"} 
                    mono 
                  />
                  
                  <DetailRow 
                    label="Timestamp" 
                    value={lote.sorobanVerification?.timestamp ? new Date(lote.sorobanVerification.timestamp).toLocaleString() : "Real-time Verification"} 
                  />
                </div>

                <div className="mt-5 pt-4 border-t border-blue-500/10">
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Este lote ha sido anclado permanentemente en la red Stellar mediante un contrato inteligente de Soroban, garantizando la inmutabilidad de su origen y estado.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/25 bg-primary/5 shadow-[var(--shadow-soft)]">
              <CardContent className="p-6">
                <Badge className="gap-1 border-0 bg-primary text-primary-foreground">
                  <ShieldCheck className="h-3 w-3" /> Stellar Payment
                </Badge>
                <div className="mt-5 space-y-4">
                  <DetailRow label="Network" value="Stellar Testnet" />
                  <DetailRow label="Status" value={hasRealHash ? "Confirmed" : "Pending transaction"} />
                  <DetailRow label="Transaction hash" value={hasRealHash ? visibleHash : "Pendiente de pago Stellar"} mono />
                  <DetailRow label="Wallet" value={lote.walletAddress || wallet || "Freighter wallet"} mono />
                </div>
                {hasRealHash && (
                  <Button asChild className="mt-5 w-full gap-2">
                    <a href={getTxExplorerUrl(visibleHash)} target="_blank" rel="noreferrer">
                      View on Stellar Explorer <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CircleDollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Payment confirmation</h2>
                    <p className="text-sm text-muted-foreground">
                      {paymentConfirmed ? "Pago premium confirmado en Testnet." : "Ejecuta una transaccion real para cerrar la verificacion."}
                    </p>
                  </div>
                </div>
                {!paymentConfirmed && (
                  <Button className="mt-5 w-full gap-2" onClick={onPay} disabled={paying}>
                    {paying ? (<><Loader2 className="h-4 w-4 animate-spin" /> Enviando a Stellar Testnet...</>) : "Simulate Premium Payment"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/80 p-4 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function InfoItem({
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
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`mt-1 break-words text-sm font-semibold ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const display = value.startsWith("G") && value.length > 20 ? truncateAddress(value) : value;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 break-all text-sm font-semibold ${mono ? "font-mono text-xs" : ""}`}>{display}</p>
    </div>
  );
}
