import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">TracePerú</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Inicio</Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          <Link to="/comprador/$loteId" params={{ loteId: "TP-001" }} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Demo Comprador</Link>
        </nav>
        <WalletButton />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-primary" />
          <span>TracePerú · Trazabilidad sobre Stellar</span>
        </div>
        <div className="flex gap-6">
          <span>Producto</span>
          <span>Documentación</span>
          <span>Contacto</span>
        </div>
      </div>
    </footer>
  );
}