"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/toast/ToastProvider";
import { InvoiceForm } from "@/modules/billing/components/InvoiceForm";
import { invoiceDisplayNumber } from "@/modules/billing/lib/format";
import { useInvoices } from "@/modules/billing/lib/useInvoices";
import type { Invoice } from "@/modules/billing/types";

export function EditInvoicePage({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const { hydrated, items, update } = useInvoices();

  const invoice = useMemo(() => items.find((inv) => inv.id === id), [items, id]);

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-40 animate-pulse rounded bg-bg" />
        <div className="h-32 animate-pulse rounded-2xl bg-bg" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-4">
        <Link
          href="/billing"
          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={13} />
          Tillbaka till fakturering
        </Link>
        <Card className="py-12 text-center text-sm text-muted">Fakturan kunde inte hittas.</Card>
      </div>
    );
  }

  const handleSubmit = (data: Omit<Invoice, "id">) => {
    update(invoice.id, data);
    toast.success("Faktura uppdaterad", invoiceDisplayNumber(invoice));
    router.push(`/billing/${invoice.id}`);
  };

  return (
    <div className="space-y-6">
      <Link
        href={`/billing/${invoice.id}`}
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={13} />
        Tillbaka till fakturan
      </Link>

      <PageHeader
        title={`Redigera ${invoiceDisplayNumber(invoice)}`}
        subtitle={invoice.customer.name}
      />

      <InvoiceForm
        initial={invoice}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/billing/${invoice.id}`)}
        submitLabel="Spara ändringar"
      />
    </div>
  );
}
