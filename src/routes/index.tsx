import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, QrCode, ShieldCheck, Wallet, ClipboardList, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNavbar, SiteFooter } from "@/components/site-navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TracePerú — Trazabilidad agrícola con pagos inmediatos" },
      { name: "description", content: "Conectamos productores peruanos con compradores internacionales mediante trazabilidad verificable y pagos sobre Stellar." },
    ],
  }),
  component: Index,
});

function Index() {
  const steps = [
    { icon: ClipboardList, title: "Registro", desc: "El productor registra el lote con datos y foto del cultivo." },
    { icon: QrCode, title: "QR", desc: "Generamos un QR único vinculado al lote en blockchain." },
    { icon: ShieldCheck, title: "Verificación", desc: "El comprador valida origen, hash y trazabilidad completa." },
    { icon: Wallet, title: "Pago", desc: "Pago premium inmediato al productor sobre Stellar Testnet." },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-subtle)" }} />
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <Sparkles className="h-3 w-3 text-primary" />
                Stellar Testnet · MVP
              </div>
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
                Trazabilidad agrícola con <span className="text-primary">pagos inmediatos</span>
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground">
                Conectamos productores peruanos con compradores internacionales mediante trazabilidad verificable y pagos sobre Stellar.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" className="gap-2 shadow-[var(--shadow-elegant)]">
                  <Wallet className="h-4 w-4" /> Conectar Wallet
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard" className="gap-2">Ver Dashboard <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>

            {/* Hero card preview */}
            <div className="relative mx-auto mt-20 max-w-4xl">
              <div className="rounded-2xl border border-border/60 bg-card p-2 shadow-[var(--shadow-elegant)]">
                <div className="rounded-xl bg-gradient-to-br from-secondary to-background p-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                      { label: "Lotes registrados", value: "1,284", trend: "+12%" },
                      { label: "Pagos en Stellar", value: "$48.2k", trend: "+24%" },
                      { label: "Premium productores", value: "$9.1k", trend: "+8%" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</p>
                        <p className="mt-1 text-xs font-medium text-primary">{s.trend} este mes</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Cómo funciona</h2>
            <p className="mt-3 text-muted-foreground">Cuatro pasos para que cada cosecha sea verificable y rentable.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-[var(--shadow-soft)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Paso 0{i + 1}</p>
                <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="overflow-hidden rounded-3xl border border-border/60 p-12 text-center" style={{ background: "var(--gradient-hero)" }}>
            <Leaf className="mx-auto h-10 w-10 text-primary-foreground" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary-foreground md:text-4xl">
              Eleva el valor de cada lote
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              Registra, certifica y cobra premium en segundos. Sin intermediarios.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/dashboard">Comenzar ahora</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
