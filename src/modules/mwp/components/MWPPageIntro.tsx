"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

interface MWPPageIntroProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function MWPPageIntro({
  title,
  subtitle,
  actions,
  backHref = "/mwp",
  backLabel = "MWP",
}: MWPPageIntroProps) {
  return (
    <div>
      <Link href={backHref} className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
        <ArrowLeft size={12} />
        {backLabel}
      </Link>
      <div className="mt-3 flex items-start justify-between gap-4">
        <PageHeader title={title} subtitle={subtitle} />
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
