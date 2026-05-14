"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

type Shot = { src: string; title: string; sub: string };

type Props = {
  shots: Shot[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({ shots, index, onClose, onPrev, onNext }: Props) {
  const shot = shots[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "Escape") onClose();
    },
    [onPrev, onNext, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Image */}
      <div
        className="relative max-h-[85vh] max-w-[90vw] w-full"
        style={{ aspectRatio: "16/10" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={shot.src}
          alt={shot.title}
          fill
          className="object-contain"
          sizes="90vw"
        />
      </div>

      {/* Caption */}
      <div
        className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="nt-display text-base font-light italic text-white">{shot.title}</p>
        <span className="text-white/40">—</span>
        <p className="text-sm text-white/60 self-center">{shot.sub}</p>
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 hover:border-white hover:text-white transition-colors duration-150"
        aria-label="Previous image"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 3.5L5.5 9L11 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 hover:border-white hover:text-white transition-colors duration-150"
        aria-label="Next image"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 3.5L12.5 9L7 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 hover:border-white hover:text-white transition-colors duration-150"
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Counter */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-white/40">
        {index + 1} / {shots.length}
      </p>
    </div>
  );
}
