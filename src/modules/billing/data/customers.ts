import type { Customer } from "@/modules/billing/types";

export const defaultCustomers: Customer[] = [
  {
    id: "cust-arctic-outdoor",
    name: "Arctic Outdoor Co.",
    orgNumber: "556789-1234",
    email: "ekonomi@arcticoutdoor.se",
    phone: "+46 90 100 20 30",
    address: "Storgatan 18",
    postalCode: "903 26",
    city: "Umeå",
  },
  {
    id: "cust-lagom-interior",
    name: "Lagom Interiör",
    orgNumber: "556321-7890",
    email: "faktura@lagominterior.se",
    address: "Drottninggatan 55",
    postalCode: "411 14",
    city: "Göteborg",
  },
  {
    id: "cust-saas-atlas",
    name: "SaaS Atlas",
    orgNumber: "559876-5432",
    email: "billing@saasatlas.io",
    address: "Östermalmstorg 1",
    postalCode: "114 39",
    city: "Stockholm",
  },
];
