import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ScoreBar } from "./ScoreBar";
import {
  categoryMeta,
  type AnalysisCategory,
  type CategoryResult,
} from "@/modules/snaptld/data/core";

interface Props {
  categories: Record<AnalysisCategory, CategoryResult>;
  linkBase?: string;
  weights?: Partial<Record<AnalysisCategory, number>>;
}

const order: AnalysisCategory[] = [
  "structure",
  "lexical",
  "brand",
  "market",
  "risk",
  "salability",
  "seo",
  "history",
];

export function ScoreBreakdown({ categories, linkBase, weights }: Props) {
  return (
    <div className="divide-y divide-border/60">
      {order.map((key) => {
        const category = categories[key];
        const meta = categoryMeta[key];
        const content = (
          <div className="flex items-center gap-4 py-2.5">
            <div className="w-32 shrink-0">
              <div className="text-sm font-medium">{meta.label}</div>
              <div className="text-[11px] text-muted">Vikt {weights?.[key] ?? category.weight}%</div>
            </div>
            <div className="flex-1">
              <ScoreBar score={category.score} showValue thick />
            </div>
            {linkBase && <ChevronRight size={14} className="shrink-0 text-muted" />}
          </div>
        );
        return linkBase ? (
          <Link
            key={key}
            href={`${linkBase}?tab=${key}`}
            scroll={false}
            className="block rounded-md px-2 -mx-2 hover:bg-bg/60"
          >
            {content}
          </Link>
        ) : (
          <div key={key} className="px-2 -mx-2">{content}</div>
        );
      })}
    </div>
  );
}
