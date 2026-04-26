"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RowMenu, type RowMenuEntry } from "@/components/ui/RowMenu";
import { Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/toast/ToastProvider";
import { CompanyDialog } from "@/modules/billing/components/CompanyDialog";
import { useCompanies } from "@/modules/billing/lib/useCompanies";
import type { Company } from "@/modules/billing/types";

export function CompaniesPage() {
  const toast = useToast();
  const { hydrated, items, add, update, remove, setDefault } = useCompanies();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Company | undefined>();
  const [confirmRemove, setConfirmRemove] = useState<Company | undefined>();

  const handleSave = (data: Omit<Company, "id">) => {
    if (editing) {
      update(editing.id, data);
      toast.success("Företag uppdaterat", data.name);
    } else {
      add(data);
      toast.success("Företag tillagt", data.name);
    }
    setEditing(undefined);
  };

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditing(company);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Mina företag"
          subtitle="Avsändaruppgifter som används när du skapar fakturor."
        />
        <Button onClick={openCreate}>
          <Plus size={14} strokeWidth={2} className="mr-1.5" />
          Nytt företag
        </Button>
      </div>

      {hydrated && items.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <Building2 size={28} className="text-muted" strokeWidth={1.5} />
          <div>
            <div className="text-sm font-medium">Inga företag ännu</div>
            <div className="mt-1 text-sm text-muted">Lägg till ditt första bolag för att börja fakturera.</div>
          </div>
          <Button onClick={openCreate} className="mt-2">
            <Plus size={14} strokeWidth={2} className="mr-1.5" />
            Lägg till företag
          </Button>
        </Card>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th className="w-12" />
              <Th>Företag</Th>
              <Th>Org.nr</Th>
              <Th>Ort</Th>
              <Th>Kontakt</Th>
              <Th>Betalning</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {items.map((company) => {
              const rowMenuItems: RowMenuEntry[] = [
                { label: "Redigera", icon: Pencil, onClick: () => openEdit(company) },
              ];
              if (!company.isDefault) {
                rowMenuItems.push({
                  label: "Ange som standard",
                  icon: Star,
                  onClick: () => {
                    setDefault(company.id);
                    toast.success("Standardföretag uppdaterat", company.name);
                  },
                });
              }
              rowMenuItems.push({ divider: true });
              rowMenuItems.push({
                label: "Ta bort",
                icon: Trash2,
                onClick: () => setConfirmRemove(company),
                danger: true,
              });
              return (
                <tr key={company.id} className="transition-colors hover:bg-bg/50">
                  <Td>
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border bg-bg/40">
                      {company.logoDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={company.logoDataUrl} alt="" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <Building2 size={13} className="text-muted" strokeWidth={1.5} />
                      )}
                    </div>
                  </Td>
                  <Td>
                    <Link
                      href={`/billing/companies/${company.id}`}
                      className="font-medium hover:underline"
                    >
                      {company.name}
                    </Link>
                    {company.isDefault && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-fg/5 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                        <Star size={9} strokeWidth={2.25} />
                        Standard
                      </span>
                    )}
                  </Td>
                  <Td className="font-mono text-xs text-muted">{company.orgNumber ?? "—"}</Td>
                  <Td className="text-muted">{company.city ?? "—"}</Td>
                  <Td className="text-xs text-muted">{company.email ?? company.phone ?? "—"}</Td>
                  <Td className="font-mono text-xs text-muted">
                    {company.bankgiro ? `BG ${company.bankgiro}` : company.iban ? "IBAN" : "—"}
                  </Td>
                  <Td>
                    <RowMenu items={rowMenuItems} />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <CompanyDialog
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
          toast.info("Företag borttaget", confirmRemove.name);
        }}
        title="Ta bort företag?"
        description={confirmRemove ? `${confirmRemove.name} tas bort från listan.` : undefined}
        confirmLabel="Ta bort"
        tone="danger"
      />
    </div>
  );
}
