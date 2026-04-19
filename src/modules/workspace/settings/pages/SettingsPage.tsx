import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsTabs } from "@/modules/workspace/settings/components/SettingsTabs";

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Settings" subtitle="Konfigurera din arbetsyta" />
      <SettingsTabs />
    </div>
  );
}
