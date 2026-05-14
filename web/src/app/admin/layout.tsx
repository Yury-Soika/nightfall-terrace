import Link from "next/link";
import { AdminProvider } from "./context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#f7f5f2]">
        <header className="border-b border-[#e2e0db] bg-[#f7f5f2]">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
            <Link href="/admin" className="nt-display text-base font-medium text-[#1a1a18]">
              Nightfall Terrace <span className="ml-2 text-xs font-normal text-[#6b6b68] not-italic">Admin</span>
            </Link>
            <Link href="/" className="text-[11px] uppercase tracking-[0.16em] text-[#6b6b68] hover:text-[#1a1a18] transition-colors">
              ← Back to site
            </Link>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
      </div>
    </AdminProvider>
  );
}
