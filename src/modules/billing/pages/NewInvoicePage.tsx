"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/components/toast/ToastProvider";
import { InvoiceForm } from "@/modules/billing/components/InvoiceForm";
import { useInvoices } from "@/modules/billing/lib/useInvoices";
import type { Invoice } from "@/modules/billing/types";

export function NewInvoicePage() {
  const router = useRouter();
  const toast = useToast();
  const { add } = useInvoices();

  const handleSubmit = (data: Omit<Invoice, "id">) => {
    const id = add(data);
    toast.success("Faktura skapad", id);
    router.push(`/billing/${id}`);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/billing"
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={13} />
        Tillbaka till fakturering
      </Link>

      <PageHeader
        title="Ny faktura"
        subtitle="Välj avsändarbolag, kund och fakturarader."
      />

      <InvoiceForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/billing")}
        submitLabel="Skapa faktura"
      />
    </div>
  );
}
