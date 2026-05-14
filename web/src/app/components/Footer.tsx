'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e2e0db] bg-[#f7f5f2]">
      <div className="nt-container py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="nt-display text-xl font-light text-[#1a1a18]">Nightfall Terrace</p>
            <p className="text-xs text-[#6b6b68]">34th Floor, Nocturne Bay</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-[11px] uppercase tracking-[0.16em] sm:grid-cols-3">
            <div className="space-y-3">
              <p className="text-[#1a1a18]">Explore</p>
              <ul className="space-y-2 text-[#6b6b68]">
                <li><Link href="/about" className="hover:text-[#1a1a18] transition-colors">About</Link></li>
                <li><Link href="/menu" className="hover:text-[#1a1a18] transition-colors">Menu</Link></li>
                <li><Link href="/gallery" className="hover:text-[#1a1a18] transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-[#1a1a18]">Visit</p>
              <ul className="space-y-2 text-[#6b6b68]">
                <li><Link href="/#reservation" className="hover:text-[#1a1a18] transition-colors">Reservations</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#e2e0db] pt-6 text-[10px] uppercase tracking-[0.2em] text-[#6b6b68]">
          © {new Date().getFullYear()} Nightfall Terrace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
