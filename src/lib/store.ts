import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockLotes, type Lote } from "./mock-data";

type Store = {
  lotes: Lote[];
  walletAddress: string | null;
  addLote: (
    lote: Omit<Lote, "id" | "hash" | "fecha" | "estado" | "premium"> & {
      imagen?: string;
    },
  ) => Lote;
  payLote: (id: string, txHash: string, walletAddress: string) => void;
  setWalletAddress: (address: string) => void;
  disconnectWallet: () => void;
  reset: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      lotes: mockLotes,
      walletAddress: null,
      addLote: (data) => {
        const all = get().lotes;
        const nextNum = String(all.length + 1).padStart(3, "0");
        const lote: Lote = {
          id: `LOT-${nextNum}`,
          productor: data.productor,
          producto: data.producto,
          cantidad: data.cantidad,
          ubicacion: data.ubicacion,
          imagen: data.imagen,
          fecha: new Date().toISOString().slice(0, 10),
          estado: "Registrado",
          hash: "Pendiente de pago Stellar",
          premium: 0,
        };
        set({ lotes: [lote, ...all] });
        return lote;
      },
      payLote: (id, txHash, walletAddress) => {
        set({
          lotes: get().lotes.map((l) =>
            l.id === id
              ? {
                  ...l,
                  estado: "Pagado",
                  premium: 120,
                  hash: txHash,
                  walletAddress,
                }
              : l,
          ),
        });
      },
      setWalletAddress: (address) => set({ walletAddress: address }),
      disconnectWallet: () => set({ walletAddress: null }),
      reset: () => set({ lotes: mockLotes, walletAddress: null }),
    }),
    { name: "traceperu-store" },
  ),
);
