export interface Theme {
  name: string;
  slug: string;
  version: string;
  latestVersion: string;
  active: boolean;
  author: string;
  screenshot: string;
  updateAvailable: boolean;
}

export const themes = (active: string, activeVersion: string, activeUpdate: boolean): Theme[] => {
  const all: Omit<Theme, "active">[] = [
    { name: "Kadence", slug: "kadence", version: "1.1.14", latestVersion: "1.1.14", author: "Kadence WP", screenshot: "linear-gradient(135deg, #0ea5e9, #6366f1)", updateAvailable: false },
    { name: "Astra", slug: "astra", version: "4.6.8", latestVersion: "4.7.1", author: "Brainstorm Force", screenshot: "linear-gradient(135deg, #f43f5e, #ec4899)", updateAvailable: true },
    { name: "GeneratePress", slug: "generatepress", version: "3.4.0", latestVersion: "3.4.2", author: "Tom Usborne", screenshot: "linear-gradient(135deg, #10b981, #0ea5e9)", updateAvailable: true },
    { name: "Blocksy", slug: "blocksy", version: "2.0.42", latestVersion: "2.0.48", author: "CreativeThemes", screenshot: "linear-gradient(135deg, #f59e0b, #f43f5e)", updateAvailable: true },
    { name: "Twenty Twenty-Four", slug: "twentytwentyfour", version: "1.2", latestVersion: "1.2", author: "WordPress.org", screenshot: "linear-gradient(135deg, #18181b, #52525b)", updateAvailable: false },
  ];
  return all.map((t) => {
    const isActive = t.name === active;
    return {
      ...t,
      active: isActive,
      version: isActive ? activeVersion : t.version,
      updateAvailable: isActive ? activeUpdate : t.updateAvailable,
    };
  });
};

export interface Plugin {
  name: string;
  slug: string;
  version: string;
  latestVersion: string;
  active: boolean;
  author: string;
  updateAvailable: boolean;
}

export interface LogEntry {
  id: string;
  level: "info" | "warn" | "error";
  time: string;
  source: string;
  message: string;
}

export const defaultPlugins = (updatesAvailable: number): Plugin[] => {
  const all: Plugin[] = [
    { name: "Yoast SEO", slug: "wordpress-seo", version: "22.4", latestVersion: "22.7", active: true, author: "Team Yoast", updateAvailable: true },
    { name: "WooCommerce", slug: "woocommerce", version: "8.8.2", latestVersion: "8.9.1", active: true, author: "Automattic", updateAvailable: true },
    { name: "Elementor", slug: "elementor", version: "3.21.0", latestVersion: "3.21.0", active: true, author: "Elementor.com", updateAvailable: false },
    { name: "Contact Form 7", slug: "contact-form-7", version: "5.9.3", latestVersion: "5.9.3", active: true, author: "Takayuki Miyoshi", updateAvailable: false },
    { name: "Wordfence Security", slug: "wordfence", version: "7.11.3", latestVersion: "7.11.6", active: true, author: "Wordfence", updateAvailable: true },
    { name: "Akismet Anti-Spam", slug: "akismet", version: "5.3.1", latestVersion: "5.3.1", active: true, author: "Automattic", updateAvailable: false },
    { name: "UpdraftPlus", slug: "updraftplus", version: "1.24.4", latestVersion: "1.24.5", active: false, author: "UpdraftPlus.Com", updateAvailable: true },
    { name: "WP Rocket", slug: "wp-rocket", version: "3.15.10", latestVersion: "3.15.10", active: true, author: "WP Media", updateAvailable: false },
  ];
  let left = updatesAvailable;
  return all.map((p) => {
    if (p.updateAvailable && left > 0) {
      left--;
      return p;
    }
    return { ...p, updateAvailable: false, latestVersion: p.version };
  });
};

export const logs: LogEntry[] = [
  { id: "l-1", level: "error", time: "14:32:08", source: "php", message: "PHP Fatal error: Uncaught Error in wp-content/plugins/custom-importer.php:142" },
  { id: "l-2", level: "warn", time: "14:28:41", source: "wp", message: "Plugin 'UpdraftPlus' inaktiverat av administrator" },
  { id: "l-3", level: "info", time: "14:15:22", source: "cron", message: "Scheduled event wp_version_check completed in 0.8s" },
  { id: "l-4", level: "warn", time: "13:47:19", source: "security", message: "3 failed login attempts from 185.22.14.91 - rate limited" },
  { id: "l-5", level: "info", time: "13:12:03", source: "cache", message: "Cache purged by user: Fredrik Jonsson" },
  { id: "l-6", level: "error", time: "12:41:55", source: "db", message: "Slow query detected - SELECT * FROM wp_postmeta WHERE meta_key LIKE '%cache%' (3.4s)" },
  { id: "l-7", level: "info", time: "12:00:00", source: "cron", message: "Scheduled event wp_scheduled_delete completed in 0.2s" },
];

export const visitsByDay = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  value: Math.round(3200 + Math.sin(i / 3) * 800 + Math.cos(i * 1.1) * 400 + i * 50),
}));
