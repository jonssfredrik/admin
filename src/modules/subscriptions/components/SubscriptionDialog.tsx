"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import {
  categoryMeta,
  cycleLabel,
  type BillingCycle,
  type Subscription,
  type SubscriptionCategory,
  type SubscriptionStatus,
} from "@/modules/subscriptions/data/core";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Subscription, "id">) => void;
  initial?: Subscription;
}

const EMPTY: Omit<Subscription, "id"> = {
  name: "",
  description: "",
  category: "saas",
  status: "active",
  amountSEK: 0,
  billingCycle: "monthly",
  startedAt: new Date().toISOString().slice(0, 10),
  nextRenewal: "",
  website: "",
  notes: "",
};

const categories = Object.entries(categoryMeta) as [SubscriptionCategory, { label: string; color: string }][];
const cycles = Object.entries(cycleLabel) as [BillingCycle, string][];
const statuses: { value: SubscriptionStatus; label: string }[] = [
  { value: "active", label: "Aktiv" },
  { value: "trial", label: "Testperiod" },
  { value: "paused", label: "Pausad" },
  { value: "cancelled", label: "Avslutad" },
];

const selectCls =
  "h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5 text-fg";

export function SubscriptionDialog({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<Omit<Subscription, "id">>(EMPTY);

  useEffect(() => {
    if (open) setForm(initial ? { ...initial } : { ...EMPTY });
  }, [open, initial]);

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const valid = form.name.trim() !== "" && form.amountSEK > 0 && form.nextRenewal !== "";

  const handleSave = () => {
    if (!valid) return;
    onSave(form);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? "Redigera abonnemang" : "Lägg till abonnemang"}
      description="Fyll i uppgifter om prenumerationen."
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
        {/* Row 1 — name + description */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="sub-name">Namn *</Label>
            <Input
              id="sub-name"
              placeholder="Vercel Pro"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sub-desc">Beskrivning</Label>
            <Input
              id="sub-desc"
              placeholder="Frontend-deployment"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </div>

        {/* Row 2 — category + status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="sub-cat">Kategori</Label>
            <select
              id="sub-cat"
              className={selectCls}
              value={form.category}
              onChange={(e) => set("category", e.target.value as SubscriptionCategory)}
            >
              {categories.map(([val, meta]) => (
                <option key={val} value={val}>{meta.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="sub-status">Status</Label>
            <select
              id="sub-status"
              className={selectCls}
              value={form.status}
              onChange={(e) => set("status", e.target.value as SubscriptionStatus)}
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3 — amount + cycle + next renewal */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="sub-amount">Belopp (SEK) *</Label>
            <Input
              id="sub-amount"
              type="number"
              min={0}
              step={1}
              placeholder="199"
              value={form.amountSEK || ""}
              onChange={(e) => set("amountSEK", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="sub-cycle">Fakturacykel</Label>
            <select
              id="sub-cycle"
              className={selectCls}
              value={form.billingCycle}
              onChange={(e) => set("billingCycle", e.target.value as BillingCycle)}
            >
              {cycles.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sub-renewal">Nästa förnyelse *</Label>
              {form.startedAt && (
                <button
                  type="button"
                  onClick={() => {
                    const start = new Date(form.startedAt);
                    const d = new Date(start);
                    switch (form.billingCycle) {
                      case "monthly":   d.setMonth(d.getMonth() + 1); break;
                      case "quarterly": d.setMonth(d.getMonth() + 3); break;
                      case "annual":    d.setFullYear(d.getFullYear() + 1); break;
                      case "biannual":  d.setFullYear(d.getFullYear() + 2); break;
                    }
                    set("nextRenewal", d.toISOString().slice(0, 10));
                  }}
                  className="mb-1 text-[11px] text-muted hover:text-fg transition-colors"
                >
                  Beräkna →
                </button>
              )}
            </div>
            <Input
              id="sub-renewal"
              type="date"
              value={form.nextRenewal}
              onChange={(e) => set("nextRenewal", e.target.value)}
            />
          </div>
        </div>

        {/* Row 4 — start date + website */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="sub-started">Startdatum</Label>
            <Input
              id="sub-started"
              type="date"
              value={form.startedAt}
              onChange={(e) => set("startedAt", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sub-web">Webbplats</Label>
            <Input
              id="sub-web"
              type="url"
              placeholder="https://..."
              value={form.website ?? ""}
              onChange={(e) => set("website", e.target.value)}
            />
          </div>
        </div>

        {/* Row 5 — notes */}
        <div>
          <Label htmlFor="sub-notes">Anteckningar</Label>
          <textarea
            id="sub-notes"
            rows={2}
            placeholder="Valfria anteckningar..."
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            className="w-full resize-none rounded-lg border bg-surface px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
          />
        </div>
      </div>
    </Dialog>
  );
}
