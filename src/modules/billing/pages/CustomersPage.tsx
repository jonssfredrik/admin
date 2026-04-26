"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RowMenu } from "@/components/ui/RowMenu";
import { Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { CustomerDialog } from "@/modules/billing/components/CustomerDialog";
import { useCustomers } from "@/modules/billing/lib/useCustomers";
import type { Customer } from "@/modules/billing/types";

export function CustomersPage() {
  const toast = useToast();
  const { hydrated, items, add, update, remove } = useCustomers();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | undefined>();
  const [confirmRemove, setConfirmRemove] = useState<Customer | undefined>();

  const handleSave = (data: Omit<Customer, "id">) => {
    if (editing) {
      update(editing.id, data);
      toast.success("Kund uppdaterad", data.name);
    } else {
      add(data);
      toast.success("Kund tillagd", data.name);
    }
    setEditing(undefined);
  };

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditing(customer);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Kunder"
          subtitle="Sparade kunder som kan återanvändas när du skapar fakturor."
        />
        <Button onClick={openCreate}>
          <Plus size={14} strokeWidth={2} className="mr-1.5" />
          Ny kund
        </Button>
      </div>

      {hydrated && items.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <Users size={28} className="text-muted" strokeWidth={1.5} />
          <div>
            <div className="text-sm font-medium">Inga sparade kunder</div>
            <div className="mt-1 text-sm text-muted">
              Lägg upp återkommande kunder här — manuella kunduppgifter kan alltid anges direkt på fakturan.
            </div>
          </div>
          <Button onClick={openCreate} className="mt-2">
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Lägg till kund
          </Button>
        </Card>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Kund</Th>
              <Th>Org.nr</Th>
              <Th>Ort</Th>
              <Th>E-post</Th>
              <Th>Telefon</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {items.map((customer) => (
              <tr key={customer.id} className="transition-colors hover:bg-bg/50">
                <Td>
                  <Link
                    href={`/billing/customers/${customer.id}`}
                    className="font-medium hover:underline"
                  >
                    {customer.name}
                  </Link>
                  {customer.contactPerson && (
                    <div className="mt-0.5 text-[11px] text-muted">Att: {customer.contactPerson}</div>
                  )}
                </Td>
                <Td className="font-mono text-xs text-muted">{customer.orgNumber ?? "—"}</Td>
                <Td className="text-muted">{customer.city ?? "—"}</Td>
                <Td className="text-xs text-muted">{customer.email ?? "—"}</Td>
                <Td className="font-mono text-xs text-muted">{customer.phone ?? "—"}</Td>
                <Td>
                  <RowMenu
                    items={[
                      { label: "Redigera", icon: Pencil, onClick: () => openEdit(customer) },
                      { divider: true },
                      { label: "Ta bort", icon: Trash2, onClick: () => setConfirmRemove(customer), danger: true },
                    ]}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <CustomerDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(undefined);
        }}
        onSave={handleSave}
        initial={editing}
      />

      <ConfirmDialog
        open={!!confirmRemove}
        onClose={() => setConfirmRemove(undefined)}
        onConfirm={() => {
          if (!confirmRemove) return;
          remove(confirmRemove.id);
          toast.info("Kund borttagen", confirmRemove.name);
        }}
        title="Ta bort kund?"
        description={confirmRemove ? `${confirmRemove.name} tas bort från listan.` : undefined}
        confirmLabel="Ta bort"
        tone="danger"
      />
    </div>
  );
}
