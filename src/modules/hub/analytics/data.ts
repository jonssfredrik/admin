export const traffic = Array.from({ length: 24 }, (_, i) => ({
  label: `${i + 1}`,
  value: Math.round(2400 + Math.sin(i / 2) * 900 + Math.cos(i * 1.3) * 400 + i * 30),
}));

export const countries = [
  { label: "Sverige", value: 42800 },
  { label: "Norge", value: 31200 },
  { label: "Danmark", value: 24500 },
  { label: "Finland", value: 18900 },
  { label: "Tyskland", value: 14300 },
  { label: "USA", value: 11700 },
  { label: "Övrigt", value: 9400 },
];

export const sources = [
  { label: "Direkt", value: 42, color: "rgb(16 185 129)" },
  { label: "Sök", value: 28, color: "rgb(59 130 246)" },
  { label: "Sociala medier", value: 18, color: "rgb(245 158 11)" },
  { label: "Email", value: 8, color: "rgb(236 72 153)" },
  { label: "Övrigt", value: 4, color: "rgb(161 161 170)" },
];

export const topPages = [
  { path: "/dashboard", views: 24892, change: 12.3 },
  { path: "/users", views: 18430, change: 8.7 },
  { path: "/settings", views: 9210, change: -2.1 },
  { path: "/login", views: 7640, change: 22.4 },
  { path: "/analytics", views: 6120, change: 4.5 },
];
