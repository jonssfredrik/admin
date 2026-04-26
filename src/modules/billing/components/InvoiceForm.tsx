"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input, Label } from "@/components/ui/Input";
import { formatInvoiceAmount, invoiceStatusLabel } from "@/modules/billing/lib/format";
import { formatVatRate, invoiceTotals, lineNetOre, VAT_RATES } from "@/modules/billing/lib/totals";
import { useCompanies } from "@/modules/billing/lib/useCompanies";
import { useCustomers } from "@/modules/billing/lib/useCustomers";
import type {
  Customer,
  Invoice,
  InvoiceLine,
  InvoiceParty,
  InvoiceStatus,
  VatRate,
} from "@/modules/billing/types";

interface Props {
  initial?: Invoice;
  onSubmit: (data: Omit<Invoice, "id">) => void;
  onCancel: () => void;
  submitLabel: string;
}

type CustomerMode = "saved" | "manual";

interface LineDraft {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPriceSEK: number;
  articleNumber: string;
}

interface FormState {
  companyId: string;
  customerMode: CustomerMode;
  customerId: string;
  customer: InvoiceParty;
  lines: LineDraft[];
  vatRate: VatRate;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paymentTermsDays: number | "";
  paidDate: string;
  notes: string;
  theirReference: string;
}

const PAYMENT_TERM_OPTIONS = [10, 15, 30, 60] as const;

const EMPTY_PARTY: InvoiceParty = {
  name: "",
  orgNumber: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  contactPerson: "",
};

const selectCls =
  "h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-fg/30 focus:ring-2 focus:ring-fg/5 text-fg";

const cellInputCls = "h-8 px-2 text-xs";

const statuses = Object.entries(invoiceStatusLabel) as [InvoiceStatus, string][];

function customerToParty(customer: Customer): InvoiceParty {
  return {
    name: customer.name,
    orgNumber: customer.orgNumber,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    postalCode: customer.postalCode,
    city: customer.city,
    contactPerson: customer.contactPerson,
  };
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function lineFromInvoice(line: InvoiceLine): LineDraft {
  return {
    id: line.id,
    description: line.description,
    quantity: line.quantity,
    unit: line.unit ?? "",
    unitPriceSEK: line.unitPriceOre / 100,
    articleNumber: line.articleNumber ?? "",
  };
}

function newLineDraft(): LineDraft {
  return {
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    description: "",
    quantity: 1,
    unit: "",
    unitPriceSEK: 0,
    articleNumber: "",
  };
}

function draftToLine(draft: LineDraft): InvoiceLine {
  return {
    id: draft.id,
    description: draft.description.trim(),
    quantity: draft.quantity,
    unit: draft.unit.trim() || undefined,
    unitPriceOre: Math.round(draft.unitPriceSEK * 100),
    articleNumber: draft.articleNumber.trim() || undefined,
  };
}

export function InvoiceForm({ initial, onSubmit, onCancel, submitLabel }: Props) {
  const { items: companies } = useCompanies();
  const { items: customers } = useCustomers();

  const initialState = useMemo<FormState>(() => {
    if (initial) {
      const customerExists =
        !!initial.customerId && customers.some((c) => c.id === initial.customerId);
      return {
        companyId: initial.companyId,
        customerMode: customerExists ? "saved" : "manual",
        customerId: customerExists ? initial.customerId ?? "" : "",
        customer: { ...EMPTY_PARTY, ...initial.customer },
        lines: initial.lines.length > 0 ? initial.lines.map(lineFromInvoice) : [newLineDraft()],
        vatRate: initial.vatRate,
        status: initial.status,
        issuedDate: initial.issuedDate,
        dueDate: initial.dueDate,
        paymentTermsDays: initial.paymentTermsDays ?? "",
        paidDate: initial.paidDate ?? "",
        notes: initial.notes ?? "",
        theirReference: initial.theirReference ?? "",
      };
    }
    const issued = todayIso();
    const defaultCompany = companies.find((c) => c.isDefault) ?? companies[0];
    return {
      companyId: defaultCompany?.id ?? "",
      customerMode: customers.length > 0 ? "saved" : "manual",
      customerId: customers[0]?.id ?? "",
      customer: customers[0] ? customerToParty(customers[0]) : { ...EMPTY_PARTY },
      lines: [newLineDraft()],
      vatRate: 0.25,
      status: "draft",
      issuedDate: issued,
      dueDate: addDays(issued, 30),
      paymentTermsDays: 30,
      paidDate: "",
      notes: "",
      theirReference: "",
    };
  }, [initial, companies, customers]);

  const [form, setForm] = useState<FormState>(initialState);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialState),
    [form, initialState],
  );

  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleCancelClick = () => {
    if (isDirty) setConfirmCancel(true);
    else onCancel();
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const setStatus = (next: InvoiceStatus) =>
    setForm((prev) => ({
      ...prev,
      status: next,
      paidDate: next === "paid" && !prev.paidDate ? todayIso() : prev.paidDate,
    }));

  const setIssuedDate = (value: string) =>
    setForm((prev) => ({
      ...prev,
      issuedDate: value,
      dueDate: prev.paymentTermsDays !== "" && value ? addDays(value, prev.paymentTermsDays) : prev.dueDate,
    }));

  const setDueDate = (value: string) =>
    setForm((prev) => ({ ...prev, dueDate: value, paymentTermsDays: "" }));

  const setPaymentTerms = (raw: string) => {
    const days = raw === "" ? "" : parseInt(raw, 10);
    setForm((prev) => ({
      ...prev,
      paymentTermsDays: days === "" || Number.isNaN(days) ? "" : days,
      dueDate: typeof days === "number" && prev.issuedDate ? addDays(prev.issuedDate, days) : prev.dueDate,
    }));
  };

  const setCustomerField = <K extends keyof InvoiceParty>(k: K, v: InvoiceParty[K]) =>
    setForm((prev) => ({ ...prev, customer: { ...prev.customer, [k]: v } }));

  const updateLine = <K extends keyof LineDraft>(id: string, k: K, v: LineDraft[K]) => {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.map((line) => (line.id === id ? { ...line, [k]: v } : line)),
    }));
  };

  const addLine = () => setForm((prev) => ({ ...prev, lines: [...prev.lines, newLineDraft()] }));

  const removeLine = (id: string) =>
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.length > 1 ? prev.lines.filter((line) => line.id !== id) : prev.lines,
    }));

  const handleSelectCustomer = (id: string) => {
    const found = customers.find((c) => c.id === id);
    if (!found) return;
    setForm((prev) => ({ ...prev, customerId: id, customer: customerToParty(found) }));
  };

  const switchMode = (mode: CustomerMode) => {
    setForm((prev) => {
      if (mode === prev.customerMode) return prev;
      if (mode === "saved") {
        const first = customers[0];
        return {
          ...prev,
          customerMode: "saved",
          customerId: first?.id ?? "",
          customer: first ? customerToParty(first) : prev.customer,
        };
      }
      return { ...prev, customerMode: "manual", customerId: "" };
    });
  };

  const previewLines: InvoiceLine[] = form.lines.map(draftToLine);
  const totals = invoiceTotals({ lines: previewLines, vatRate: form.vatRate });

  const linesValid = previewLines.every(
    (line) => line.description !== "" && line.quantity > 0 && line.unitPriceOre > 0,
  );

  const valid =
    form.companyId !== "" &&
    form.customer.name.trim() !== "" &&
    form.issuedDate !== "" &&
    form.dueDate !== "" &&
    previewLines.length > 0 &&
    linesValid;

  const handleSubmit = () => {
    if (!valid) return;
    const cleanedCustomer: InvoiceParty = {
      name: form.customer.name.trim(),
      orgNumber: form.customer.orgNumber?.trim() || undefined,
      email: form.customer.email?.trim() || undefined,
      phone: form.customer.phone?.trim() || undefined,
      address: form.customer.address?.trim() || undefined,
      postalCode: form.customer.postalCode?.trim() || undefined,
      city: form.customer.city?.trim() || undefined,
      contactPerson: form.customer.contactPerson?.trim() || undefined,
    };
    const payload: Omit<Invoice, "id"> = {
      companyId: form.companyId,
      customerId: form.customerMode === "saved" ? form.customerId || undefined : undefined,
      customer: cleanedCustomer,
      lines: previewLines,
      vatRate: form.vatRate,
      status: form.status,
      currency: "SEK",
      issuedDate: form.issuedDate,
      dueDate: form.dueDate,
      paymentTermsDays: form.paymentTermsDays === "" ? undefined : form.paymentTermsDays,
      paidDate: form.status === "paid" ? form.paidDate || todayIso() : undefined,
      notes: form.notes.trim() || undefined,
      theirReference: form.theirReference.trim() || undefined,
    };
    onSubmit(payload);
  };

  const noCompanies = companies.length === 0;
  const selectedCompany = companies.find((c) => c.id === form.companyId);

  return (
    <div className="space-y-6">
      {noCompanies && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-sm text-amber-700 dark:text-amber-300">
          Du behöver lägga till minst ett företag innan du kan skapa fakturor.
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 text-sm font-semibold tracking-tight">Avsändare</div>
          <Label htmlFor="inv-company">Bolag *</Label>
          <select
            id="inv-company"
            className={selectCls}
            value={form.companyId}
            onChange={(e) => set("companyId", e.target.value)}
            disabled={noCompanies}
          >
            {noCompanies && <option value="">Inga företag tillgängliga</option>}
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {selectedCompany && (
            <div className="mt-4 space-y-2 rounded-xl border bg-bg/30 p-4 text-sm">
              <div className="font-medium">{selectedCompany.name}</div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                {selectedCompany.orgNumber && (
                  <>
                    <dt className="text-muted">Org.nr</dt>
                    <dd className="font-mono">{selectedCompany.orgNumber}</dd>
                  </>
                )}
                {selectedCompany.vatNumber && (
                  <>
                    <dt className="text-muted">VAT</dt>
                    <dd className="font-mono">{selectedCompany.vatNumber}</dd>
                  </>
                )}
                {(selectedCompany.address || selectedCompany.postalCode || selectedCompany.city) && (
                  <>
                    <dt className="text-muted">Adress</dt>
                    <dd>
                      {selectedCompany.address}
                      {selectedCompany.address && (selectedCompany.postalCode || selectedCompany.city) && <br />}
                      {[selectedCompany.postalCode, selectedCompany.city].filter(Boolean).join(" ")}
                    </dd>
                  </>
                )}
                {selectedCompany.email && (
                  <>
                    <dt className="text-muted">E-post</dt>
                    <dd>{selectedCompany.email}</dd>
                  </>
                )}
                {selectedCompany.bankgiro && (
                  <>
                    <dt className="text-muted">Bankgiro</dt>
                    <dd className="font-mono">{selectedCompany.bankgiro}</dd>
                  </>
                )}
                {selectedCompany.iban && (
                  <>
                    <dt className="text-muted">IBAN</dt>
                    <dd className="font-mono">{selectedCompany.iban}</dd>
                  </>
                )}
              </dl>
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">Kund</div>
            <div className="inline-flex rounded-lg border bg-bg/40 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => switchMode("saved")}
                disabled={customers.length === 0}
                className={clsx(
                  "rounded-md px-2.5 py-1 transition-colors",
                  form.customerMode === "saved" ? "bg-surface font-medium text-fg shadow-sm" : "text-muted hover:text-fg",
                  customers.length === 0 && "cursor-not-allowed opacity-50",
                )}
              >
                Sparad kund
              </button>
              <button
                type="button"
                onClick={() => switchMode("manual")}
                className={clsx(
                  "rounded-md px-2.5 py-1 transition-colors",
                  form.customerMode === "manual" ? "bg-surface font-medium text-fg shadow-sm" : "text-muted hover:text-fg",
                )}
              >
                Manuell
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {form.customerMode === "saved" && (
              <select
                className={selectCls}
                value={form.customerId}
                onChange={(e) => handleSelectCustomer(e.target.value)}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="inv-cust-name">Namn *</Label>
                <Input
                  id="inv-cust-name"
                  value={form.customer.name}
                  onChange={(e) => setCustomerField("name", e.target.value)}
                  disabled={form.customerMode === "saved"}
                />
              </div>
              <div>
                <Label htmlFor="inv-cust-org">Org.nr / personnummer</Label>
                <Input
                  id="inv-cust-org"
                  value={form.customer.orgNumber ?? ""}
                  onChange={(e) => setCustomerField("orgNumber", e.target.value)}
                  disabled={form.customerMode === "saved"}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="inv-cust-contact">Kontaktperson</Label>
              <Input
                id="inv-cust-contact"
                placeholder="Att: Anna Andersson"
                value={form.customer.contactPerson ?? ""}
                onChange={(e) => setCustomerField("contactPerson", e.target.value)}
                disabled={form.customerMode === "saved"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="inv-cust-email">E-post</Label>
                <Input
                  id="inv-cust-email"
                  type="email"
                  value={form.customer.email ?? ""}
                  onChange={(e) => setCustomerField("email", e.target.value)}
                  disabled={form.customerMode === "saved"}
                />
              </div>
              <div>
                <Label htmlFor="inv-cust-phone">Telefon</Label>
                <Input
                  id="inv-cust-phone"
                  value={form.customer.phone ?? ""}
                  onChange={(e) => setCustomerField("phone", e.target.value)}
                  disabled={form.customerMode === "saved"}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="inv-cust-addr">Adress</Label>
              <Input
                id="inv-cust-addr"
                value={form.customer.address ?? ""}
                onChange={(e) => setCustomerField("address", e.target.value)}
                disabled={form.customerMode === "saved"}
              />
            </div>

            <div className="grid grid-cols-[140px_1fr] gap-3">
              <div>
                <Label htmlFor="inv-cust-zip">Postnummer</Label>
                <Input
                  id="inv-cust-zip"
                  value={form.customer.postalCode ?? ""}
                  onChange={(e) => setCustomerField("postalCode", e.target.value)}
                  disabled={form.customerMode === "saved"}
                />
              </div>
              <div>
                <Label htmlFor="inv-cust-city">Ort</Label>
                <Input
                  id="inv-cust-city"
                  value={form.customer.city ?? ""}
                  onChange={(e) => setCustomerField("city", e.target.value)}
                  disabled={form.customerMode === "saved"}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="border-b px-5 py-3 text-sm font-semibold tracking-tight">Fakturarader *</div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-bg/40 text-[11px] uppercase tracking-wider text-muted">
              <th className="px-4 py-2 text-left font-medium">Beskrivning</th>
              <th className="w-[70px] px-2 py-2 text-left font-medium">Antal</th>
              <th className="w-[70px] px-2 py-2 text-left font-medium">Enhet</th>
              <th className="w-[110px] px-2 py-2 text-right font-medium">À-pris</th>
              <th className="w-[120px] px-2 py-2 text-right font-medium">Summa</th>
              <th className="w-[40px] px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {form.lines.map((line) => (
              <tr key={line.id} className="border-b last:border-0">
                <td className="px-3 py-1.5">
                  <Input
                    className={cellInputCls}
                    placeholder="Beskrivning av tjänst eller vara"
                    value={line.description}
                    onChange={(e) => updateLine(line.id, "description", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    className={cellInputCls}
                    type="number"
                    min={0}
                    step={0.01}
                    value={line.quantity || ""}
                    onChange={(e) => updateLine(line.id, "quantity", parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    className={cellInputCls}
                    placeholder="st"
                    value={line.unit}
                    onChange={(e) => updateLine(line.id, "unit", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    className={clsx(cellInputCls, "text-right tabular-nums")}
                    type="number"
                    min={0}
                    step={0.01}
                    value={line.unitPriceSEK || ""}
                    onChange={(e) => updateLine(line.id, "unitPriceSEK", parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="px-2 py-1.5 text-right font-medium tabular-nums">
                  {formatInvoiceAmount(lineNetOre(draftToLine(line)), "SEK")}
                </td>
                <td className="px-2 py-1.5 text-right">
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    disabled={form.lines.length <= 1}
                    className="rounded-md p-1 text-muted transition-colors hover:bg-bg hover:text-fg disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Ta bort rad"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between gap-3 border-t bg-bg/30 px-4 py-2.5">
          <button
            type="button"
            onClick={addLine}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-bg hover:text-fg"
          >
            <Plus size={12} />
            Lägg till rad
          </button>
          <div className="flex items-center gap-5 text-xs">
            {totals.netOre > 0 ? (
              <>
                <div className="text-muted">
                  Netto <span className="ml-1 font-medium text-fg tabular-nums">{formatInvoiceAmount(totals.netOre, "SEK")}</span>
                </div>
                <div className="text-muted">
                  Moms {formatVatRate(totals.vatRate)}{" "}
                  <span className="ml-1 font-medium text-fg tabular-nums">{formatInvoiceAmount(totals.vatOre, "SEK")}</span>
                </div>
                <div className="text-sm font-semibold tabular-nums">
                  Totalt {formatInvoiceAmount(totals.totalOre, "SEK")}
                </div>
              </>
            ) : (
              <span className="text-muted">Lägg till en rad för att räkna ut totalsumma.</span>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 text-sm font-semibold tracking-tight">Detaljer</div>
        <div
          className={clsx(
            "grid gap-3",
            form.status === "paid" ? "grid-cols-3" : "grid-cols-2",
          )}
        >
          <div>
            <Label htmlFor="inv-status">Status</Label>
            <select
              id="inv-status"
              className={selectCls}
              value={form.status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
            >
              {statuses.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="inv-vat">Moms</Label>
            <select
              id="inv-vat"
              className={selectCls}
              value={form.vatRate}
              onChange={(e) => set("vatRate", parseFloat(e.target.value) as VatRate)}
            >
              {VAT_RATES.map((rate) => (
                <option key={rate} value={rate}>{formatVatRate(rate)}</option>
              ))}
            </select>
          </div>
          {form.status === "paid" && (
            <div>
              <Label htmlFor="inv-paid">Betald *</Label>
              <Input
                id="inv-paid"
                type="date"
                value={form.paidDate}
                onChange={(e) => set("paidDate", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="inv-issued">Utfärdad *</Label>
            <Input
              id="inv-issued"
              type="date"
              value={form.issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="inv-terms">Betalningsvillkor</Label>
            <select
              id="inv-terms"
              className={selectCls}
              value={form.paymentTermsDays === "" ? "" : String(form.paymentTermsDays)}
              onChange={(e) => setPaymentTerms(e.target.value)}
            >
              {PAYMENT_TERM_OPTIONS.map((days) => (
                <option key={days} value={days}>{days} dagar netto</option>
              ))}
              <option value="">Anpassat datum</option>
            </select>
          </div>
          <div>
            <Label htmlFor="inv-due">Förfallodatum *</Label>
            <Input
              id="inv-due"
              type="date"
              value={form.dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {form.paymentTermsDays === "" && (
              <p className="mt-1 text-[11px] text-muted">
                Anpassat datum aktivt — välj ett villkor för att räkna automatiskt.
              </p>
            )}
          </div>
        </div>

        <div className="mt-3">
          <Label htmlFor="inv-their-ref">Er referens</Label>
          <Input
            id="inv-their-ref"
            placeholder="Anna Andersson / PO-1234"
            value={form.theirReference}
            onChange={(e) => set("theirReference", e.target.value)}
          />
        </div>

        <div className="mt-3">
          <Label htmlFor="inv-notes">Anteckningar</Label>
          <textarea
            id="inv-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className="w-full resize-none rounded-lg border bg-surface px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
          />
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={handleCancelClick}>Avbryt</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!valid}>{submitLabel}</Button>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={onCancel}
        title="Lämna utan att spara?"
        description="Du har osparade ändringar som försvinner om du fortsätter."
        confirmLabel="Lämna ändå"
        tone="danger"
      />
    </div>
  );
}
