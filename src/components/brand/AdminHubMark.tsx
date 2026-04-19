import clsx from "clsx";

type AdminHubMarkProps = {
  className?: string;
  title?: string;
};

export function AdminHubMark({ className, title = "Admin Hub" }: AdminHubMarkProps) {
  return (
    <svg
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("block", className)}
      role="img"
      aria-label={title}
    >
      <path fillRule="evenodd" d="M23 0V8H8V0Z" fill="currentColor" />
      <path fillRule="evenodd" d="M8 24H0V8H8Z" fill="currentColor" />
      <path fillRule="evenodd" d="M31 32H23V8H31Z" fill="currentColor" />
      <path fillRule="evenodd" d="M13 24V32H8V24Z" fill="currentColor" />
      <path d="M12 25C12 25 19.37 20.99 24 13C24.2 13.03 24 26 24 26C24 26 19.5 30.47 13 32C12.35 31.67 12 25 12 25Z" fill="currentColor" />
    </svg>
  );
}
