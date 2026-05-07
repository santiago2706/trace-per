import { useState } from "react";
import { Wallet, Check, LogOut, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore, truncateAddress } from "@/lib/store";
import { toast } from "sonner";

export function WalletButton({ size = "sm" }: { size?: "sm" | "default" | "lg" }) {
  const { walletAddress, connectWallet, disconnectWallet } = useStore();
  const [loading, setLoading] = useState(false);

  const onConnect = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const addr = connectWallet();
    setLoading(false);
    toast.success("Wallet conectada", { description: truncateAddress(addr) });
  };

  if (!walletAddress) {
    return (
      <Button size={size} className="gap-2" onClick={onConnect} disabled={loading}>
        <Wallet className="h-4 w-4" />
        {loading ? "Conectando…" : "Conectar Wallet"}
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
        <DropdownMenuLabel className="text-xs text-muted-foreground">Stellar Testnet</DropdownMenuLabel>
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