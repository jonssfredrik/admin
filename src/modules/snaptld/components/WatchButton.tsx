"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { useWatchlist } from "@/modules/snaptld/lib/watchlist";

interface Props {
  slug: string;
  domain: string;
  variant?: "button" | "icon";
}

export function WatchButton({ slug, domain, variant = "button" }: Props) {
  const toast = useToast();
  const { has, toggle, hydrated } = useWatchlist();
  const active = hydrated && has(slug);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(slug);
    toast.success(active ? "Bort från bevakning" : "Lagt till bevakning", domain);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handle}
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
    >
      {active ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      {active ? "Bevakas" : "Bevaka"}
    </Button>
  );
}
