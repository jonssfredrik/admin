import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: "bg-fg text-bg hover:opacity-90",
  secondary: "border bg-surface hover:bg-bg",
  ghost: "text-muted hover:bg-bg hover:text-fg",
};

export function Button({ variant = "primary", className, ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex h-9 items-center justify-center rounded-lg px-3.5 text-sm font-medium transition-colors disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
