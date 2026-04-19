export interface DomainRecord {
  id: string;
  name: string;
  registrar: string;
  usage: "parked" | "active" | "for-sale";
  status: "healthy" | "expiring" | "attention";
  expiresAt: string;
  monthlyValue: string;
  notes: string;
}

export const domainRecords: DomainRecord[] = [
  {
    id: "dom-1",
    name: "nordicbrands.se",
    registrar: "Cloudflare",
    usage: "for-sale",
    status: "healthy",
    expiresAt: "2027-02-14",
    monthlyValue: "12 000 kr",
    notes: "Hög kommersiell potential inom branding och e-handel.",
  },
  {
    id: "dom-2",
    name: "jetwp.io",
    registrar: "Namecheap",
    usage: "active",
    status: "healthy",
    expiresAt: "2026-11-03",
    monthlyValue: "Produktdomän",
    notes: "Primär domän för Managed WordPress-verksamheten.",
  },
  {
    id: "dom-3",
    name: "streamstacker.com",
    registrar: "Porkbun",
    usage: "parked",
    status: "expiring",
    expiresAt: "2026-05-12",
    monthlyValue: "1 900 kr",
    notes: "Behöver beslut om förnyelse eller försäljning inom 30 dagar.",
  },
  {
    id: "dom-4",
    name: "saasatlas.se",
    registrar: "Loopia",
    usage: "active",
    status: "attention",
    expiresAt: "2026-06-01",
    monthlyValue: "Lead-gen",
    notes: "DNS och redirect-strategi behöver ses över.",
  },
];
