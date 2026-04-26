"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import type { Customer } from "@/modules/billing/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Customer, "id">) => void;
  initial?: Customer;
}

const EMPTY: Omit<Customer, "id"> = {
  name: "",
  orgNumber: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  contactPerson: "",
};

export function CustomerDialog({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<Omit<Customer, "id">>(EMPTY);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : { ...EMPTY });
    }
  }, [open, initial]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const valid = form.name.trim() !== "";

  const handleSave = () => {
    if (!valid) return;
    const cleaned: Omit<Customer, "id"> = {
      name: form.name.trim(),
      orgNumber: form.orgNumber?.trim() || undefined,
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      address: form.address?.trim() || undefined,
      postalCode: form.postalCode?.trim() || undefined,
      city: form.city?.trim() || undefined,
      contactPerson: form.contactPerson?.trim() || undefined,
    };
    onSave(cleaned);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? "Redigera kund" : "Lägg till kund"}
      description="Sparas för att snabbt kunna återanvändas på nya fakturor."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Avbryt</Button>
          <Button variant="primary" onClick={handleSave} disabled={!valid}>
            {initial ? "Spara ändringar" : "Lägg till"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="cust-name">Namn *</Label>
            <Input
              id="cust-name"
              placeholder="Arctic Outdoor Co."
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cust-org">Org.nr / personnummer</Label>
            <Input
              id="cust-org"
              placeholder="556789-1234"
              value={form.orgNumber ?? ""}
              onChange={(e) => set("orgNumber", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cust-contact">Kontaktperson</Label>
          <Input
            id="cust-contact"
            placeholder="Anna Andersson"
            value={form.contactPerson ?? ""}
            onChange={(e) => set("contactPerson", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="cust-email">E-post</Label>
            <Input
              id="cust-email"
              type="email"
              placeholder="ekonomi@kund.se"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cust-phone">Telefon</Label>
            <Input
              id="cust-phone"
              placeholder="+46 90 100 20 30"
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cust-addr">Adress</Label>
          <Input
            id="cust-addr"
            placeholder="Storgatan 18"
            value={form.address ?? ""}
            onChange={(e) => set("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-[140px_1fr] gap-3">
          <div>
            <Label htmlFor="cust-zip">Postnummer</Label>
            <Input
              id="cust-zip"
              placeholder="903 26"
              value={form.postalCode ?? ""}
              onChange={(e) => set("postalCode", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cust-city">Ort</Label>
            <Input
              id="cust-city"
              placeholder="Umeå"
              value={form.city ?? ""}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
