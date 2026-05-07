import { createFileRoute } from "@tanstack/react-router";
import { LotVerificationPortal } from "@/components/lot-verification";

export const Route = createFileRoute("/lot/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Lot ${params.id} - TracePeru` },
      { name: "description", content: "Buyer traceability verification portal powered by Stellar Testnet." },
    ],
  }),
  component: LotPage,
});

function LotPage() {
  const { id } = Route.useParams();
  return <LotVerificationPortal lotId={id} />;
}
