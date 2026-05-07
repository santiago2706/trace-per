import {
  getNetwork,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import {
  Asset,
  Horizon,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "stellar-sdk";

export const STELLAR_TESTNET = {
  name: "Stellar Testnet",
  horizonUrl: "https://horizon-testnet.stellar.org",
  networkPassphrase: Networks.TESTNET,
  explorerUrl: "https://stellar.expert/explorer/testnet/tx",
};

export type StellarPaymentResult = {
  hash: string;
  source: string;
  destination: string;
  network: string;
};

const server = new Horizon.Server(STELLAR_TESTNET.horizonUrl);

const freighterError = (error?: { message?: string }) =>
  error?.message || "No se pudo completar la accion con Freighter.";

export const getTxExplorerUrl = (hash: string) =>
  `${STELLAR_TESTNET.explorerUrl}/${hash}`;

export const truncateAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export async function connectFreighterWallet() {
  if (typeof window === "undefined") return "";
  
  const connection = await isConnected();
  if (!connection.isConnected) {
    throw new Error("Instala o activa Freighter Wallet para continuar.");
  }

  const access = await requestAccess();
  if (access.error || !access.address) {
    throw new Error(freighterError(access.error));
  }

  const network = await getNetwork();
  if (network.error) {
    throw new Error(freighterError(network.error));
  }

  if (network.networkPassphrase !== STELLAR_TESTNET.networkPassphrase) {
    throw new Error("Cambia Freighter a Stellar Testnet antes de continuar.");
  }

  return access.address;
}

export async function submitPremiumPayment({
  sourceAddress,
  lotId,
}: {
  sourceAddress: string;
  lotId: string;
}): Promise<StellarPaymentResult> {
  const account = await server.loadAccount(sourceAddress);
  const fee = await server.fetchBaseFee();

  const transaction = new TransactionBuilder(account, {
    fee: String(fee),
    networkPassphrase: STELLAR_TESTNET.networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination: sourceAddress,
        asset: Asset.native(),
        amount: "0.0000010",
      }),
    )
    .addMemo(Memo.text(`TracePeru ${lotId}`))
    .setTimeout(60)
    .build();

  if (typeof window === "undefined") throw new Error("Browser only");

  const signed = await signTransaction(transaction.toXDR(), {
    address: sourceAddress,
    networkPassphrase: STELLAR_TESTNET.networkPassphrase,
  });

  if (signed.error || !signed.signedTxXdr) {
    throw new Error(freighterError(signed.error));
  }

  const signedTransaction = TransactionBuilder.fromXDR(
    signed.signedTxXdr,
    STELLAR_TESTNET.networkPassphrase,
  );
  const result = await server.submitTransaction(signedTransaction);

  return {
    hash: result.hash,
    source: sourceAddress,
    destination: sourceAddress,
    network: STELLAR_TESTNET.name,
  };
}
