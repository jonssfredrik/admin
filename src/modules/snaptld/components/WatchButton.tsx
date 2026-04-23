"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { useSnapTldUserState } from "@/modules/snaptld/client/SnapTldUserStateProvider";
import { useAsyncAction } from "@/modules/snaptld/lib/useAsyncAction";

interface Props {
  slug: string;
  domain: string;
  variant?: "button" | "icon";
}

export function WatchButton({ slug, domain, variant = "button" }: Props) {
  const toast = useToast();
  const action = useAsyncAction();
  const { hasWatch, toggleWatch } = useSnapTldUserState();
  const active = hasWatch(slug);

  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await action.run(() => toggleWatch(slug));
      toast.success(active ? "Bort från bevakning" : "Lagt till bevakning", domain);
    } catch (error) {
      toast.error("Kunde inte uppdatera bevakning", error instanceof Error ? error.message : domain);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handle}
        disabled={action.isPending}
        aria-label={active ? "Sluta bevaka" : "Bevaka"}
        className={clsx(
          "rounded-md p-1 transition-colors",
          active ? "text-fg" : "text-muted hover:bg-bg hover:text-fg",
        )}
      >
        {active ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      </button>
    );
  }

  return (
    <Button
      variant={active ? "secondary" : "primary"}
      className="gap-1.5"
      onClick={handle}
      disabled={action.isPending}
    >
      {active ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      {active ? "Bevakas" : "Bevaka"}
    </Button>
  );
}
