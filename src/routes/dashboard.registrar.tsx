import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Upload, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/registrar")({
  head: () => ({
    meta: [
      { title: "Registrar lote — TracePerú" },
      { name: "description", content: "Registra un nuevo lote agrícola en Stellar Testnet." },
    ],
  }),
  component: RegistrarLote,
});

function RegistrarLote() {
  const [form, setForm] = useState({ productor: "", producto: "", cantidad: "", ubicacion: "" });
  const [imagen, setImagen] = useState<string | null>(null);
  const [registrado, setRegistrado] = useState<{ id: string; hash: string } | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagen(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TP-${Math.floor(100 + Math.random() * 900)}`;
    const hash = `G${Math.random().toString(36).slice(2, 8).toUpperCase()}…${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setRegistrado({ id, hash });
  };

  if (registrado) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-border/60 shadow-[var(--shadow-elegant)]">
          <CardContent className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">¡Lote registrado!</h2>
            <p className="mt-2 text-sm text-muted-foreground">Registrado en Stellar Testnet</p>
            <div className="mx-auto mt-8 w-fit rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <QRCodeSVG value={`https://traceperu.app/comprador/${registrado.id}`} size={200} bgColor="transparent" fgColor="oklch(0.18 0.02 240)" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-left">
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <p className="text-xs text-muted-foreground">ID Lote</p>
                <p className="mt-1 font-mono text-sm font-semibold">{registrado.id}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <p className="text-xs text-muted-foreground">Hash Stellar</p>
                <p className="mt-1 font-mono text-sm font-semibold">{registrado.hash}</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <Button asChild variant="outline">
                <Link to="/dashboard">Volver al dashboard</Link>
              </Button>
              <Button asChild>
                <Link to="/comprador/$loteId" params={{ loteId: registrado.id }}>Ver vista comprador</Link>
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
          <p className="text-sm text-muted-foreground">Los datos se anclarán en Stellar Testnet.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="productor">Nombre del productor</Label>
              <Input id="productor" required value={form.productor} onChange={(e) => setForm({ ...form, productor: e.target.value })} placeholder="Cooperativa Andina" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="producto">Producto</Label>
              <Input id="producto" required value={form.producto} onChange={(e) => setForm({ ...form, producto: e.target.value })} placeholder="Café orgánico" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input id="cantidad" required value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} placeholder="500 kg" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input id="ubicacion" required value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} placeholder="Cusco, Perú" />
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
            <Button type="submit" className="w-full gap-2" size="lg">
              Registrar en Stellar Testnet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}