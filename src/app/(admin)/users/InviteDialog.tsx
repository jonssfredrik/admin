"use client";

import { useState } from "react";
import clsx from "clsx";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";

const roles = ["Admin", "Editor", "Viewer"] as const;
type Role = (typeof roles)[number];

export function InviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Editor");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const reset = () => {
    setEmail("");
    setRole("Editor");
  };

  const submit = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Inbjudan skickad", `${email} (${role})`);
      reset();
      onClose();
    }, 600);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Bjud in användare"
      description="Skicka en inbjudan via e-post"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Avbryt</Button>
          <Button onClick={submit} disabled={!email || loading}>
            {loading ? "Skickar…" : "Skicka inbjudan"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="invite-email">E-post</Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="person@foretag.se"
            autoFocus
          />
        </div>
        <div>
          <Label htmlFor="invite-role">Roll</Label>
          <div className="flex rounded-lg border bg-bg p-0.5">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={clsx(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  role === r ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            {role === "Admin" && "Full åtkomst till alla inställningar och användare."}
            {role === "Editor" && "Kan skapa och redigera innehåll."}
            {role === "Viewer" && "Kan endast läsa innehåll."}
          </p>
        </div>
      </div>
    </Dialog>
  );
}
