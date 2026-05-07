import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockLotes, type Lote } from "./mock-data";

type Store = {
  lotes: Lote[];
  walletAddress: string | null;
  addLote: (lote: Omit<Lote, "id" | "hash" | "fecha" | "estado" | "premium"> & { imagen?: string }) => Lote;
  payLote: (id: string) => string;
  connectWallet: () => string;
  disconnectWallet: () => void;
  reset: () => void;
};

const randHash = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "G";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  s += "…";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

const randAddress = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "G";
  for (let i = 0; i < 55; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
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
          hash: randHash(),
          premium: 0,
        };
        set({ lotes: [lote, ...all] });
        return lote;
      },
      payLote: (id) => {
        const txHash = `STELLAR-TX-${Math.floor(10000000 + Math.random() * 90000000)}`;
        set({
          lotes: get().lotes.map((l) =>
            l.id === id ? { ...l, estado: "Pagado", premium: 120 } : l,
          ),
        });
        return txHash;
      },
      connectWallet: () => {
        const addr = randAddress();
        set({ walletAddress: addr });
        return addr;
      },
      disconnectWallet: () => set({ walletAddress: null }),
      reset: () => set({ lotes: mockLotes, walletAddress: null }),
    }),
    { name: "traceperu-store" },
  ),
);

export const truncateAddress = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;