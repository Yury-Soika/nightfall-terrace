import Link from "next/link";
import { AdminProvider } from "./context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#0a0e1a]">
        <header className="border-b border-[#1e2d40] bg-[#0a0e1a]">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
            <Link href="/admin" className="nt-display text-base font-light italic text-[#f0ece4]">
              Nightfall Terrace <span className="ml-2 text-xs font-normal text-[#8b9bb4] not-italic">Admin</span>
            </Link>
            <Link href="/" className="text-[11px] uppercase tracking-[0.16em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors">
              ← Back to site
            </Link>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
      </div>
    </AdminProvider>
  );
}
