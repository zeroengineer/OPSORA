import { ModuleStub } from "@/components/common/ModuleStub.tsx";

export function SalesPage() {
  return (
    <ModuleStub
      index={3}
      total={11}
      title="Sales Pipeline"
      description="Deals moving through Lead, Discussion, Proposal, Negotiation, Won and Lost with pipeline value and conversion metrics."
    />
  );
}

export default SalesPage;
