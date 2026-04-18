import clsx from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={clsx(
          "h-9 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors",
          "placeholder:text-muted focus:border-fg/30 focus:ring-2 focus:ring-fg/5",
          className,
        )}
        {...props}
      />
    );
  },
);

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-fg">
      {children}
    </label>
  );
}
