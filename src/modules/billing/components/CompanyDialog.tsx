"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import type { Company } from "@/modules/billing/types";

const MAX_LOGO_BYTES = 500 * 1024;
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Company, "id">) => void;
  initial?: Company;
}

const EMPTY: Omit<Company, "id"> = {
  name: "",
  orgNumber: "",
  vatNumber: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  bank: "",
  iban: "",
  bankgiro: "",
  logoDataUrl: undefined,
  fSkatt: false,
};

export function CompanyDialog({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<Omit<Company, "id">>(EMPTY);
  const [logoError, setLogoError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : { ...EMPTY });
      setLogoError(undefined);
    }
  }, [open, initial]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError("Endast PNG, JPEG, SVG eller WebP stöds.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError(`Filen är ${Math.round(file.size / 1024)} kB — max 500 kB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, logoDataUrl: typeof reader.result === "string" ? reader.result : undefined }));
      setLogoError(undefined);
    };
    reader.onerror = () => setLogoError("Kunde inte läsa filen.");
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setForm((prev) => ({ ...prev, logoDataUrl: undefined }));
    setLogoError(undefined);
  };

  const valid = form.name.trim() !== "";

  const handleSave = () => {
    if (!valid) return;
    const cleaned: Omit<Company, "id"> = {
      name: form.name.trim(),
      orgNumber: form.orgNumber?.trim() || undefined,
      vatNumber: form.vatNumber?.trim() || undefined,
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      address: form.address?.trim() || undefined,
      postalCode: form.postalCode?.trim() || undefined,
      city: form.city?.trim() || undefined,
      bank: form.bank?.trim() || undefined,
      iban: form.iban?.trim() || undefined,
      bankgiro: form.bankgiro?.trim() || undefined,
      logoDataUrl: form.logoDataUrl || undefined,
      fSkatt: form.fSkatt || undefined,
    };
    onSave(cleaned);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? "Redigera företag" : "Lägg till företag"}
      description="Avsändaruppgifter som används på fakturor."
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
        <div className="flex items-start gap-4 rounded-xl border bg-bg/30 p-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-surface">
            {form.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.logoDataUrl} alt="Logotyp" className="max-h-full max-w-full object-contain" />
            ) : (
              <ImagePlus size={20} className="text-muted" strokeWidth={1.5} />
            )}
          </div>
          <div className="flex-1 space-y-2 text-sm">
            <div className="font-medium">Logotyp</div>
            <div className="text-xs text-muted">PNG, JPEG, SVG eller WebP. Max 500 kB. Visas på fakturor.</div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleLogoChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-8 items-center rounded-md border bg-surface px-3 text-xs font-medium transition-colors hover:bg-bg"
              >
                {form.logoDataUrl ? "Ersätt" : "Ladda upp"}
              </button>
              {form.logoDataUrl && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                >
                  <Trash2 size={12} />
                  Ta bort
                </button>
              )}
            </div>
            {logoError && <div className="text-xs text-red-600 dark:text-red-400">{logoError}</div>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="co-name">Företagsnamn *</Label>
            <Input
              id="co-name"
              placeholder="Nordic Ops AB"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="co-org">Organisationsnummer</Label>
            <Input
              id="co-org"
              placeholder="559123-4567"
              value={form.orgNumber ?? ""}
              onChange={(e) => set("orgNumber", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="co-vat">Momsnummer (VAT)</Label>
            <Input
              id="co-vat"
              placeholder="SE559123456701"
              value={form.vatNumber ?? ""}
              onChange={(e) => set("vatNumber", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="co-email">E-post</Label>
            <Input
              id="co-email"
              type="email"
              placeholder="faktura@bolaget.se"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="co-phone">Telefon</Label>
            <Input
              id="co-phone"
              placeholder="+46 8 123 45 67"
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="co-addr">Adress</Label>
            <Input
              id="co-addr"
              placeholder="Sveavägen 12"
              value={form.address ?? ""}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="co-zip">Postnummer</Label>
            <Input
              id="co-zip"
              placeholder="111 57"
              value={form.postalCode ?? ""}
              onChange={(e) => set("postalCode", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="co-city">Ort</Label>
            <Input
              id="co-city"
              placeholder="Stockholm"
              value={form.city ?? ""}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="co-bank">Bank</Label>
            <Input
              id="co-bank"
              placeholder="SEB"
              value={form.bank ?? ""}
              onChange={(e) => set("bank", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="co-bg">Bankgiro</Label>
            <Input
              id="co-bg"
              placeholder="5051-2031"
              value={form.bankgiro ?? ""}
              onChange={(e) => set("bankgiro", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="co-iban">IBAN</Label>
            <Input
              id="co-iban"
              placeholder="SE45 5000 0000 0583 9825 7466"
              value={form.iban ?? ""}
              onChange={(e) => set("iban", e.target.value)}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.fSkatt ?? false}
            onChange={(e) => set("fSkatt", e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <span>Innehar F-skattsedel <span className="text-muted">(visas på fakturor)</span></span>
        </label>
      </div>
    </Dialog>
  );
}
