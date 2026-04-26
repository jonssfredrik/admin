export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 print:bg-white">
      <div className="font-sans antialiased">{children}</div>
    </div>
  );
}
