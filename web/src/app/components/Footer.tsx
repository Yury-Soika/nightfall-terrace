"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#243447] bg-[#0f1621]">
      <div className="nt-container py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="nt-display text-xl font-light italic text-[#f0ece4]">Nightfall Terrace</p>
            <p className="text-xs text-[#8b9bb4]">34th Floor, Nocturne Bay</p>
            <p className="text-xs text-[#4a5872]">Tue–Sun · 5 PM – 1 AM</p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-[11px] uppercase tracking-[0.16em] sm:grid-cols-3">
            <div className="space-y-4">
              <p className="text-[#d4a574]">Explore</p>
              <ul className="space-y-3 text-[#8b9bb4]">
                <li><Link href="/about" className="hover:text-[#f0ece4] transition-colors">About</Link></li>
                <li><Link href="/menu" className="hover:text-[#f0ece4] transition-colors">Menu</Link></li>
                <li><Link href="/events" className="hover:text-[#f0ece4] transition-colors">Events</Link></li>
                <li><Link href="/gallery" className="hover:text-[#f0ece4] transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-[#d4a574]">Visit</p>
              <ul className="space-y-3 text-[#8b9bb4]">
                <li><Link href="/#reservation" className="hover:text-[#f0ece4] transition-colors">Reservations</Link></li>
                <li><Link href="/admin" className="hover:text-[#f0ece4] transition-colors">Admin</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#243447] pt-6 flex items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#4a5872]">
            © {new Date().getFullYear()} Nightfall Terrace. All rights reserved.
          </p>
          <p className="text-[10px] text-[#4a5872]">Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
