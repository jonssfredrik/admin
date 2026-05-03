import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsTabs, type SettingsSection } from "@/modules/workspace/settings/components/SettingsTabs";

export function SettingsPage({ section = "profile" }: { section?: SettingsSection }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Inställningar" subtitle="Konfigurera konto, fakturering och arbetsytans notifieringar." />
      <SettingsTabs section={section} />
    </div>
  );
}
