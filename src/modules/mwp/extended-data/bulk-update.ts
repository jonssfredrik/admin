export interface BulkUpdatePlan {
  siteId: string;
  siteName: string;
  plugins: { name: string; current: string; next: string; changelog: string }[];
  themes: { name: string; current: string; next: string; changelog: string }[];
}

export const bulkUpdatePlans: BulkUpdatePlan[] = [
  {
    siteId: "site-2",
    siteName: "Lagom Interiör",
    plugins: [
      { name: "Wordfence", current: "7.11.3", next: "7.11.6", changelog: "Security hotfix for CVE-2026-1042" },
      { name: "Yoast SEO", current: "22.4", next: "22.7", changelog: "Improved schema output and index speed" },
    ],
    themes: [{ name: "Astra", current: "4.6.8", next: "4.7.1", changelog: "Header builder fixes and WP 6.5 support" }],
  },
  {
    siteId: "site-3",
    siteName: "Svensk Cykelklubb",
    plugins: [{ name: "WooCommerce", current: "8.8.2", next: "8.9.1", changelog: "Checkout fixes and HPOS compatibility" }],
    themes: [{ name: "GeneratePress", current: "3.4.0", next: "3.4.2", changelog: "Accessibility fixes and layout controls" }],
  },
];
