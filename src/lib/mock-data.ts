export type Lote = {
  id: string;
  productor: string;
  producto: string;
  cantidad: string;
  ubicacion: string;
  fecha: string;
  estado: "Registrado" | "Validado" | "Pagado";
  hash: string;
  walletAddress?: string;
  imagen?: string;
  premium: number;
};

export const mockLotes: Lote[] = [
  {
    id: "TP-001",
    productor: "Cooperativa Andina",
    producto: "Café orgánico",
    cantidad: "500 kg",
    ubicacion: "Cusco, Perú",
    fecha: "2026-04-12",
    estado: "Pagado",
    hash: "GA7XK9...JQ2P",
    premium: 320,
  },
  {
    id: "TP-002",
    productor: "Familia Quispe",
    producto: "Quinua roja",
    cantidad: "1200 kg",
    ubicacion: "Puno, Perú",
    fecha: "2026-04-28",
    estado: "Validado",
    hash: "GB3LM2...HW8N",
    premium: 480,
  },
  {
    id: "TP-003",
    productor: "Asociación Verde",
    producto: "Cacao fino",
    cantidad: "750 kg",
    ubicacion: "San Martín, Perú",
    fecha: "2026-05-02",
    estado: "Registrado",
    hash: "GC5RT8...KL3Q",
    premium: 0,
  },
];
