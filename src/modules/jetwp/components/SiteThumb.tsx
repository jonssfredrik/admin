import clsx from "clsx";

interface Props {
  screenshot: string;
  domain: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { box: "h-10 w-16", chrome: "h-2", dot: "h-[3px] w-[3px]", pad: "px-1 gap-[2px]", content: "p-1 gap-[2px]" },
  md: { box: "h-20 w-32", chrome: "h-3.5", dot: "h-1 w-1", pad: "px-1.5 gap-[3px]", content: "p-1.5 gap-1" },
  lg: { box: "h-28 w-44", chrome: "h-4", dot: "h-1.5 w-1.5", pad: "px-2 gap-1", content: "p-2 gap-1" },
};

export function SiteThumb({ screenshot, domain, size = "sm", className }: Props) {
  const selectedSize = sizes[size];
  return (
    <div
      className={clsx("shrink-0 overflow-hidden rounded-md border bg-surface shadow-sm", selectedSize.box, className)}
      aria-label={`Thumbnail för ${domain}`}
    >
      <div className={clsx("flex items-center border-b bg-bg/60", selectedSize.chrome, selectedSize.pad)}>
        <span className={clsx("rounded-full bg-red-400/70", selectedSize.dot)} />
        <span className={clsx("rounded-full bg-amber-400/70", selectedSize.dot)} />
        <span className={clsx("rounded-full bg-emerald-400/70", selectedSize.dot)} />
      </div>
      <div className="relative h-full w-full" style={{ background: screenshot }}>
        <div className={clsx("flex h-full flex-col justify-end", selectedSize.content)}>
          <div className="h-[2px] w-2/3 rounded-full bg-white/60" />
          <div className="h-[2px] w-1/2 rounded-full bg-white/40" />
          <div className="h-[2px] w-1/3 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}
