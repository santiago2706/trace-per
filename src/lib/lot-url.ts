const DEFAULT_PUBLIC_URL = "https://traceperu.vercel.app";

export const getLotUrl = (lotId: string) => {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : import.meta.env.VITE_PUBLIC_APP_URL || DEFAULT_PUBLIC_URL;

  return `${baseUrl}/lot/${lotId}`;
};

export const isRealStellarTxHash = (hash: string) => /^[a-f0-9]{64}$/i.test(hash);
