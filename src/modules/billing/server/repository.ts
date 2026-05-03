import type {
  BillingCompany as PrismaCompany,
  BillingCustomer as PrismaCustomer,
  BillingInvoice as PrismaInvoice,
  BillingInvoiceLine as PrismaInvoiceLine,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { addDays, todayIso } from "@/modules/billing/lib/dates";
import type {
  Company,
  Customer,
  Invoice,
  InvoiceLine,
  InvoiceParty,
  InvoiceStatus,
  VatRate,
} from "@/modules/billing/types";

type InvoiceWithLines = PrismaInvoice & { lines: PrismaInvoiceLine[] };

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function toCompany(row: PrismaCompany): Company {
  return {
    id: row.id,
    name: row.name,
    orgNumber: row.orgNumber ?? undefined,
    vatNumber: row.vatNumber ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    postalCode: row.postalCode ?? undefined,
    city: row.city ?? undefined,
    bank: row.bank ?? undefined,
    iban: row.iban ?? undefined,
    bankgiro: row.bankgiro ?? undefined,
    logoDataUrl: row.logoDataUrl ?? undefined,
    fSkatt: row.fSkatt || undefined,
    isDefault: row.isDefault || undefined,
  };
}

function toCustomer(row: PrismaCustomer): Customer {
  return {
    id: row.id,
    name: row.name,
    orgNumber: row.orgNumber ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    postalCode: row.postalCode ?? undefined,
    city: row.city ?? undefined,
    contactPerson: row.contactPerson ?? undefined,
  };
}

function toInvoiceLine(row: PrismaInvoiceLine): InvoiceLine {
  return {
    id: row.id,
    description: row.description,
    quantity: row.quantity,
    unit: row.unit ?? undefined,
    unitPriceOre: row.unitPriceOre,
    articleNumber: row.articleNumber ?? undefined,
  };
}

function toInvoice(row: InvoiceWithLines): Invoice {
  const customer: InvoiceParty = {
    name: row.customerName,
    orgNumber: row.customerOrgNumber ?? undefined,
    email: row.customerEmail ?? undefined,
    phone: row.customerPhone ?? undefined,
    address: row.customerAddress ?? undefined,
    postalCode: row.customerPostalCode ?? undefined,
    city: row.customerCity ?? undefined,
    contactPerson: row.customerContactPerson ?? undefined,
  };
  const sortedLines = [...row.lines].sort((a, b) => a.position - b.position);
  return {
    id: row.id,
    companyId: row.companyId,
    customerId: row.customerId ?? undefined,
    customer,
    status: row.status as InvoiceStatus,
    lines: sortedLines.map(toInvoiceLine),
    vatRate: row.vatRate as VatRate,
    currency: "SEK",
    dueDate: row.dueDate,
    issuedDate: row.issuedDate,
    paidDate: row.paidDate ?? undefined,
    paymentTermsDays: row.paymentTermsDays ?? undefined,
    notes: row.notes ?? undefined,
    theirReference: row.theirReference ?? undefined,
  };
}

// ---------- Companies ----------

export async function listCompanies(): Promise<Company[]> {
  const rows = await prisma.billingCompany.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toCompany);
}

export async function createCompany(input: Omit<Company, "id">): Promise<Company> {
  const existing = await prisma.billingCompany.count();
  const isDefault = existing === 0 ? true : !!input.isDefault;
  const id = `co-${Date.now()}`;
  if (isDefault) {
    await prisma.$transaction([
      prisma.billingCompany.updateMany({ where: { isDefault: true }, data: { isDefault: false } }),
      prisma.billingCompany.create({
        data: {
          id,
          name: input.name,
          orgNumber: input.orgNumber ?? null,
          vatNumber: input.vatNumber ?? null,
          email: input.email ?? null,
          phone: input.phone ?? null,
          address: input.address ?? null,
          postalCode: input.postalCode ?? null,
          city: input.city ?? null,
          bank: input.bank ?? null,
          iban: input.iban ?? null,
          bankgiro: input.bankgiro ?? null,
          logoDataUrl: input.logoDataUrl ?? null,
          fSkatt: !!input.fSkatt,
          isDefault: true,
        },
      }),
    ]);
  } else {
    await prisma.billingCompany.create({
      data: {
        id,
        name: input.name,
        orgNumber: input.orgNumber ?? null,
        vatNumber: input.vatNumber ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
        address: input.address ?? null,
        postalCode: input.postalCode ?? null,
        city: input.city ?? null,
        bank: input.bank ?? null,
        iban: input.iban ?? null,
        bankgiro: input.bankgiro ?? null,
        logoDataUrl: input.logoDataUrl ?? null,
        fSkatt: !!input.fSkatt,
        isDefault: false,
      },
    });
  }
  const created = await prisma.billingCompany.findUniqueOrThrow({ where: { id } });
  return toCompany(created);
}

export async function updateCompany(id: string, input: Partial<Omit<Company, "id">>): Promise<Company> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.orgNumber !== undefined) data.orgNumber = input.orgNumber ?? null;
  if (input.vatNumber !== undefined) data.vatNumber = input.vatNumber ?? null;
  if (input.email !== undefined) data.email = input.email ?? null;
  if (input.phone !== undefined) data.phone = input.phone ?? null;
  if (input.address !== undefined) data.address = input.address ?? null;
  if (input.postalCode !== undefined) data.postalCode = input.postalCode ?? null;
  if (input.city !== undefined) data.city = input.city ?? null;
  if (input.bank !== undefined) data.bank = input.bank ?? null;
  if (input.iban !== undefined) data.iban = input.iban ?? null;
  if (input.bankgiro !== undefined) data.bankgiro = input.bankgiro ?? null;
  if (input.logoDataUrl !== undefined) data.logoDataUrl = input.logoDataUrl ?? null;
  if (input.fSkatt !== undefined) data.fSkatt = !!input.fSkatt;
  const updated = await prisma.billingCompany.update({ where: { id }, data });
  return toCompany(updated);
}

export async function deleteCompany(id: string): Promise<void> {
  const removed = await prisma.billingCompany.findUnique({ where: { id } });
  if (!removed) return;
  await prisma.billingCompany.delete({ where: { id } });
  if (removed.isDefault) {
    const next = await prisma.billingCompany.findFirst({ orderBy: { createdAt: "asc" } });
    if (next) {
      await prisma.billingCompany.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }
}

export async function setDefaultCompany(id: string): Promise<void> {
  await prisma.$transaction([
    prisma.billingCompany.updateMany({ where: { isDefault: true }, data: { isDefault: false } }),
    prisma.billingCompany.update({ where: { id }, data: { isDefault: true } }),
  ]);
}

// ---------- Customers ----------

export async function listCustomers(): Promise<Customer[]> {
  const rows = await prisma.billingCustomer.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toCustomer);
}

export async function createCustomer(input: Omit<Customer, "id">): Promise<Customer> {
  const id = `cust-${Date.now()}`;
  const created = await prisma.billingCustomer.create({
    data: {
      id,
      name: input.name,
      orgNumber: input.orgNumber ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      address: input.address ?? null,
      postalCode: input.postalCode ?? null,
      city: input.city ?? null,
      contactPerson: input.contactPerson ?? null,
    },
  });
  return toCustomer(created);
}

export async function updateCustomer(id: string, input: Partial<Omit<Customer, "id">>): Promise<Customer> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.orgNumber !== undefined) data.orgNumber = input.orgNumber ?? null;
  if (input.email !== undefined) data.email = input.email ?? null;
  if (input.phone !== undefined) data.phone = input.phone ?? null;
  if (input.address !== undefined) data.address = input.address ?? null;
  if (input.postalCode !== undefined) data.postalCode = input.postalCode ?? null;
  if (input.city !== undefined) data.city = input.city ?? null;
  if (input.contactPerson !== undefined) data.contactPerson = input.contactPerson ?? null;
  const updated = await prisma.billingCustomer.update({ where: { id }, data });
  return toCustomer(updated);
}

export async function deleteCustomer(id: string): Promise<void> {
  await prisma.billingCustomer.delete({ where: { id } });
}

// ---------- Invoices ----------

async function nextInvoiceIdForCompany(companyId: string): Promise<string> {
  const prefix = `${companyId}-inv-`;
  const rows = await prisma.billingInvoice.findMany({
    where: { companyId, id: { startsWith: prefix } },
    select: { id: true },
  });
  const numbers = rows
    .map((r) => parseInt(r.id.slice(prefix.length), 10))
    .filter((n) => Number.isFinite(n));
  if (numbers.length === 0) return `${prefix}0`;
  return `${prefix}${Math.max(...numbers) + 1}`;
}

export async function listInvoices(): Promise<Invoice[]> {
  const rows = await prisma.billingInvoice.findMany({
    include: { lines: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toInvoice);
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const row = await prisma.billingInvoice.findUnique({
    where: { id },
    include: { lines: true },
  });
  return row ? toInvoice(row) : null;
}

export async function createInvoice(input: Omit<Invoice, "id">): Promise<Invoice> {
  const id = await nextInvoiceIdForCompany(input.companyId);
  const created = await prisma.billingInvoice.create({
    data: {
      id,
      companyId: input.companyId,
      customerId: input.customerId ?? null,
      customerName: input.customer.name,
      customerOrgNumber: input.customer.orgNumber ?? null,
      customerEmail: input.customer.email ?? null,
      customerPhone: input.customer.phone ?? null,
      customerAddress: input.customer.address ?? null,
      customerPostalCode: input.customer.postalCode ?? null,
      customerCity: input.customer.city ?? null,
      customerContactPerson: input.customer.contactPerson ?? null,
      status: input.status,
      vatRate: input.vatRate,
      currency: input.currency,
      dueDate: input.dueDate,
      issuedDate: input.issuedDate,
      paidDate: input.paidDate ?? null,
      paymentTermsDays: input.paymentTermsDays ?? null,
      notes: input.notes ?? null,
      theirReference: input.theirReference ?? null,
      lines: {
        create: input.lines.map((line, position) => ({
          id: line.id || newId("line"),
          position,
          description: line.description,
          quantity: line.quantity,
          unit: line.unit ?? null,
          unitPriceOre: line.unitPriceOre,
          articleNumber: line.articleNumber ?? null,
        })),
      },
    },
    include: { lines: true },
  });
  return toInvoice(created);
}

export async function updateInvoice(
  id: string,
  input: Partial<Omit<Invoice, "id" | "companyId">>,
): Promise<Invoice> {
  const data: Record<string, unknown> = {};
  if (input.customerId !== undefined) data.customerId = input.customerId ?? null;
  if (input.customer !== undefined) {
    data.customerName = input.customer.name;
    data.customerOrgNumber = input.customer.orgNumber ?? null;
    data.customerEmail = input.customer.email ?? null;
    data.customerPhone = input.customer.phone ?? null;
    data.customerAddress = input.customer.address ?? null;
    data.customerPostalCode = input.customer.postalCode ?? null;
    data.customerCity = input.customer.city ?? null;
    data.customerContactPerson = input.customer.contactPerson ?? null;
  }
  if (input.status !== undefined) data.status = input.status;
  if (input.vatRate !== undefined) data.vatRate = input.vatRate;
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.dueDate !== undefined) data.dueDate = input.dueDate;
  if (input.issuedDate !== undefined) data.issuedDate = input.issuedDate;
  if (input.paidDate !== undefined) data.paidDate = input.paidDate ?? null;
  if (input.paymentTermsDays !== undefined) data.paymentTermsDays = input.paymentTermsDays ?? null;
  if (input.notes !== undefined) data.notes = input.notes ?? null;
  if (input.theirReference !== undefined) data.theirReference = input.theirReference ?? null;

  if (input.lines !== undefined) {
    await prisma.$transaction([
      prisma.billingInvoice.update({ where: { id }, data }),
      prisma.billingInvoiceLine.deleteMany({ where: { invoiceId: id } }),
      prisma.billingInvoiceLine.createMany({
        data: input.lines.map((line, position) => ({
          id: line.id || newId("line"),
          invoiceId: id,
          position,
          description: line.description,
          quantity: line.quantity,
          unit: line.unit ?? null,
          unitPriceOre: line.unitPriceOre,
          articleNumber: line.articleNumber ?? null,
        })),
      }),
    ]);
  } else if (Object.keys(data).length > 0) {
    await prisma.billingInvoice.update({ where: { id }, data });
  }

  const refreshed = await prisma.billingInvoice.findUniqueOrThrow({
    where: { id },
    include: { lines: true },
  });
  return toInvoice(refreshed);
}

export async function deleteInvoice(id: string): Promise<void> {
  await prisma.billingInvoice.delete({ where: { id } });
}

export async function duplicateInvoice(id: string): Promise<Invoice | null> {
  const src = await prisma.billingInvoice.findUnique({
    where: { id },
    include: { lines: true },
  });
  if (!src) return null;
  const issued = todayIso();
  const dueDate = src.paymentTermsDays
    ? addDays(issued, src.paymentTermsDays)
    : addDays(issued, 30);
  const newId = await nextInvoiceIdForCompany(src.companyId);
  const sortedLines = [...src.lines].sort((a, b) => a.position - b.position);
  const created = await prisma.billingInvoice.create({
    data: {
      id: newId,
      companyId: src.companyId,
      customerId: src.customerId,
      customerName: src.customerName,
      customerOrgNumber: src.customerOrgNumber,
      customerEmail: src.customerEmail,
      customerPhone: src.customerPhone,
      customerAddress: src.customerAddress,
      customerPostalCode: src.customerPostalCode,
      customerCity: src.customerCity,
      customerContactPerson: src.customerContactPerson,
      status: "draft",
      vatRate: src.vatRate,
      currency: src.currency,
      dueDate,
      issuedDate: issued,
      paidDate: null,
      paymentTermsDays: src.paymentTermsDays,
      notes: src.notes,
      theirReference: src.theirReference,
      lines: {
        create: sortedLines.map((line, position) => ({
          id: newId.replace("-inv-", "-line-") + "-" + position,
          position,
          description: line.description,
          quantity: line.quantity,
          unit: line.unit,
          unitPriceOre: line.unitPriceOre,
          articleNumber: line.articleNumber,
        })),
      },
    },
    include: { lines: true },
  });
  return toInvoice(created);
}
