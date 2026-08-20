import { ModuleStub } from "@/components/common/ModuleStub.tsx";

export function InvoicesPage() {
  return (
    <ModuleStub
      index={4}
      total={11}
      title="Invoices"
      description="Invoices generated and received, linked to clients, with draft, sent, partially paid, paid, overdue and cancelled states."
    />
  );
}

export default InvoicesPage;
