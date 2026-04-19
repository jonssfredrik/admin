"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { InviteDialog } from "@/modules/workspace/users/components/InviteDialog";
import { UsersTable } from "@/modules/workspace/users/components/UsersTable";
import { users } from "@/modules/workspace/users/data";

export function UsersPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("invite") === "1") {
      setInviteOpen(true);
      router.replace("/users");
    }
  }, [params, router]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader title="Users" subtitle="Hantera användare och roller" />
        <Button onClick={() => setInviteOpen(true)}>
          <Plus size={14} strokeWidth={2} className="mr-1.5" />
          Bjud in
        </Button>
      </div>
      <UsersTable users={users} />
      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
