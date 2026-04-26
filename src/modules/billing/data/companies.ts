import type { Company } from "@/modules/billing/types";

export const defaultCompanies: Company[] = [
  {
    id: "co-nordic-ops",
    name: "Nordic Ops AB",
    orgNumber: "559123-4567",
    vatNumber: "SE559123456701",
    email: "faktura@nordicops.se",
    phone: "+46 8 123 45 67",
    address: "Sveavägen 12",
    postalCode: "111 57",
    city: "Stockholm",
    bankgiro: "5051-2031",
    fSkatt: true,
    isDefault: true,
  },
  {
    id: "co-studio-fredrik",
    name: "Studio Fredrik",
    orgNumber: "990101-1234",
    email: "hej@studiofredrik.se",
    address: "Kungsgatan 4",
    postalCode: "411 19",
    city: "Göteborg",
    iban: "SE45 5000 0000 0583 9825 7466",
    fSkatt: true,
  },
];
