"use client";

import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Lightbox from "../components/Lightbox";
import Image from "next/image";
import Link from "next/link";

const shots = [
  { src: "/images/gallery/golden-hour-terrace.png", title: "Golden hour", sub: "Terrace at dusk" },
  { src: "/images/gallery/twilight-coastal-skyline.png", title: "Twilight skyline", sub: "Coastal panorama" },
  { src: "/images/gallery/aerial-rooftop-dusk.png", title: "From above", sub: "Aerial at dusk" },
  { src: "/images/gallery/cocktail-lounge-night.png", title: "Night lounge", sub: "Candlelit interior" },
  { src: "/images/gallery/signature-cocktail-sunset.png", title: "Aperol at sunset", sub: "Signature cocktail" },
  { src: "/images/gallery/midnight-terrace-candles.png", title: "After midnight", sub: "Empty terrace" },
  { src: "/images/gallery/cocktails-sunset-service.png", title: "Evening service", sub: "Cocktails at sunset" },
  { src: "/images/gallery/champagne-rooftop-setup.png", title: "The setup", sub: "Champagne & linen" },
];

type GalleryImageProps = {
  shot: (typeof shots)[0];
  ratio: string;
  onClick: () => void;
};

function GalleryImage({ shot, ratio, onClick }: GalleryImageProps) {
  return (
    <div className="group relative overflow-hidden cursor-zoom-in" onClick={onClick}>
      <div className={`relative w-full overflow-hidden ${ratio}`}>
        <Image
          src={shot.src}
          alt={shot.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="nt-display text-base font-light text-[#f0ece4]">{shot.title}</p>
        <p className="text-xs text-[#8b9bb4]">{shot.sub}</p>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev = useCallback(() => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + shots.length) % shots.length)), []);
  const next = useCallback(() => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % shots.length)), []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0e1a] pt-16">
        <div className="border-b border-[#1e2d40]">
          <div className="nt-container py-16 sm:py-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">Nightfall Terrace</p>
            <h1 className="nt-display mt-3 text-5xl font-light italic text-[#f0ece4] sm:text-6xl">Gallery</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8b9bb4]">
              A look at the terrace across the evening — from golden hour through to the last call.
            </p>
          </div>
        </div>

        <div className="nt-container py-16 sm:py-20">
          <div className="grid gap-4 sm:grid-cols-2">
            <GalleryImage shot={shots[0]} ratio="aspect-[16/10]" onClick={() => open(0)} />
            <GalleryImage shot={shots[1]} ratio="aspect-[16/10]" onClick={() => open(1)} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <GalleryImage shot={shots[2]} ratio="aspect-[3/4]" onClick={() => open(2)} />
            <div className="grid gap-4 content-start">
              <GalleryImage shot={shots[3]} ratio="aspect-[4/3]" onClick={() => open(3)} />
              <GalleryImage shot={shots[4]} ratio="aspect-[4/3]" onClick={() => open(4)} />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <GalleryImage shot={shots[5]} ratio="aspect-[4/3]" onClick={() => open(5)} />
            <GalleryImage shot={shots[6]} ratio="aspect-[4/3]" onClick={() => open(6)} />
            <GalleryImage shot={shots[7]} ratio="aspect-[4/3]" onClick={() => open(7)} />
          </div>
        </div>

        <div className="border-t border-[#1e2d40]">
          <div className="nt-container py-16 text-center">
            <p className="nt-display text-3xl font-light italic text-[#f0ece4] sm:text-4xl">
              Experience it in person
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/#reservation"
                className="inline-flex items-center justify-center border border-[#d4a574] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0a0e1a] transition-colors duration-200"
              >
                Reserve a table
              </Link>
              <Link
                href="/about"
                className="text-[11px] uppercase tracking-[0.2em] text-[#8b9bb4] hover:text-[#f0ece4] transition-colors"
              >
                About the terrace
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {lightboxIndex !== null && (
        <Lightbox shots={shots} index={lightboxIndex} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  );
}
