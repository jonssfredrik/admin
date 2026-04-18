export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex items-center gap-3 text-sm text-muted">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-fg/20 border-t-fg" />
        Laddar…
      </div>
    </div>
  );
}
