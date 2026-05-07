import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, CheckCircle2, Loader2, ShieldCheck, Sparkles, Upload, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLotUrl } from "@/lib/lot-url";
import { useStore } from "@/lib/store";
import { registerLotOnChain } from "@/lib/soroban";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/registrar")({
  head: () => ({
    meta: [
      { title: "Registrar lote - TracePeru" },
      { name: "description", content: "Registra un nuevo lote agricola en Stellar Testnet." },
    ],
  }),
  component: RegistrarLote,
});

function RegistrarLote() {
  const [form, setForm] = useState({ productor: "", producto: "", cantidad: "", ubicacion: "" });
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrado, setRegistrado] = useState<{
    id: string;
    hash: string;
    producto: string;
    productor: string;
    sorobanTx?: string;
  } | null>(null);
  const addLote = useStore((s) => s.addLote);
  const verifyLotWithSoroban = useStore((s) => s.verifyLotWithSoroban);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagen(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Local Registration
      const lote = addLote({ ...form, imagen: imagen ?? undefined });
      
      // 2. Soroban Smart Contract Verification
      toast.loading("Verificando en Soroban Smart Contract...", { id: "soroban" });
      const sorobanResult = await registerLotOnChain(lote.id);
      
      verifyLotWithSoroban(lote.id, {
        contractId: sorobanResult.contractId,
        txHash: sorobanResult.txHash,
        timestamp: sorobanResult.timestamp,
        verified: true,
      });

      setLoading(false);
      toast.success("Lote registrado y verificado on-chain", { 
        id: "soroban",
        description: "Contrato inteligente ejecutado con éxito" 
      });
      
      setRegistrado({ 
        id: lote.id, 
        hash: lote.hash, 
        producto: lote.producto, 
        productor: lote.productor,
        sorobanTx: sorobanResult.txHash
      });
    } catch (error) {
      setLoading(false);
      toast.error("Error en el registro", { id: "soroban" });
    }
  };

  if (registrado) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-border/60 shadow-[var(--shadow-elegant)]">
          <CardContent className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Lote registrado</h2>
            <p className="mt-2 text-sm text-muted-foreground">Preparado para verificacion en Stellar Testnet</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge className="gap-1 border-0 bg-primary/10 text-primary" variant="secondary">
                <ShieldCheck className="h-3 w-3" /> Blockchain verified
              </Badge>
              <Badge className="gap-1 border-0 bg-blue-500/10 text-blue-600" variant="secondary">
                <LinkIcon className="h-3 w-3" /> Soroban Smart Contract
              </Badge>
            </div>
            <div className="mx-auto mt-8 w-fit rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <QRCodeSVG
                value={getLotUrl(registrado.id)}
                size={200}
                bgColor="transparent"
                fgColor="oklch(0.18 0.02 240)"
              />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <p className="text-xs text-muted-foreground">ID Lote</p>
                <p className="mt-1 font-mono text-sm font-semibold">{registrado.id}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <p className="text-xs text-muted-foreground">Soroban TX</p>
                <p className="mt-1 font-mono text-[10px] truncate font-semibold" title={registrado.sorobanTx}>
                  {registrado.sorobanTx || "Verified On-Chain"}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link to="/dashboard">Volver al dashboard</Link>
              </Button>
              <Button asChild>
                <Link to="/lot/$id" params={{ id: registrado.id }}>Ver portal comprador</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" /> Registrar nuevo lote
          </CardTitle>
          <p className="text-sm text-muted-foreground">El lote quedara listo para verificarse con una transaccion real en Stellar Testnet.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="productor">Nombre del productor</Label>
              <Input id="productor" required value={form.productor} onChange={(e) => setForm({ ...form, productor: e.target.value })} placeholder="Cooperativa Andina" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="producto">Producto</Label>
              <Input id="producto" required value={form.producto} onChange={(e) => setForm({ ...form, producto: e.target.value })} placeholder="Cafe organico" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input id="cantidad" required value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} placeholder="500 kg" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ubicacion">Ubicacion</Label>
                <Input id="ubicacion" required value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} placeholder="Cusco, Peru" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Foto del lote</Label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50">
                {imagen ? (
                  <img src={imagen} alt="preview" className="h-32 rounded-md object-cover" />
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>Click para subir imagen</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
            </div>
            <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Registrando...</>) : "Registrar lote"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
