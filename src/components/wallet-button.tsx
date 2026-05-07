"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2, LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import { connectFreighterWallet, truncateAddress } from "@/lib/stellar";
import { useHydrated } from "@/hooks/use-hydrated";
import { toast } from "sonner";

export function WalletButton({ size = "sm" }: { size?: "sm" | "default" | "lg" }) {
  const isHydrated = useHydrated();
  const { walletAddress, setWalletAddress, disconnectWallet } = useStore();
  const [loading, setLoading] = useState(false);

  if (!isHydrated) return null;


  const onConnect = async () => {
    setLoading(true);
    try {
      const addr = await connectFreighterWallet();
      setWalletAddress(addr);
      toast.success("Freighter conectado", { description: truncateAddress(addr) });
    } catch (error) {
      toast.error("No se pudo conectar Freighter", {
        description: error instanceof Error ? error.message : "Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <Button size={size} className="gap-2" onClick={onConnect} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
        {loading ? "Conectando..." : "Connect Freighter Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={size} variant="outline" className="gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono text-xs">{truncateAddress(walletAddress)}</span>
          <Check className="h-3 w-3 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Freighter conectado · Stellar Testnet
        </DropdownMenuLabel>
        <div className="px-2 py-1.5">
          <p className="break-all font-mono text-xs">{walletAddress}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(walletAddress);
            toast.success("Address copiada");
          }}
        >
          <Copy className="mr-2 h-4 w-4" /> Copiar address
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            disconnectWallet();
            toast("Wallet desconectada");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Desconectar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
