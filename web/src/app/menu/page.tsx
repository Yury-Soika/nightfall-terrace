"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const cocktails = [
  { name: "Midnight Spritz", desc: "citrus, prosecco, basil oil", price: 18 },
  { name: "Skyline Negroni", desc: "gin, bitter orange, smoked cherry", price: 19 },
  { name: "Terrace Paloma", desc: "tequila, grapefruit, salted rim", price: 17 },
  { name: "Golden Sour", desc: "bourbon, honey, lemon, egg white", price: 18 },
  { name: "Nocturne Old Fashioned", desc: "rye, demerara, cardamom bitters", price: 20 },
  { name: "Bay Breeze Fizz", desc: "vodka, cranberry, coconut, lime", price: 16 },
];

const wine = [
  { name: "Chablis Premier Cru", desc: "Domaine Pinson, Burgundy — crisp, mineral", price: 18 },
  { name: "Pinot Grigio", desc: "Alois Lageder, Alto Adige — bright, floral", price: 15 },
  { name: "Sancerre Blanc", desc: "Henri Bourgeois — citrus, herbaceous", price: 22 },
  { name: "Barolo", desc: "Vietti, Piedmont — full-bodied, earthy", price: 26 },
  { name: "Côtes du Rhône Rouge", desc: "Domaine Chave — spiced dark fruit", price: 17 },
];

const snacks = [
  { name: "Marinated Olives", desc: "herbs, orange zest, warm bread", price: 9 },
  { name: "Burrata", desc: "heirloom tomato, basil oil, sea salt", price: 16 },
  { name: "Tuna Crudo", desc: "ponzu, cucumber, sesame, chili", price: 18 },
  { name: "Truffle Fries", desc: "parmesan, rosemary, aioli", price: 14 },
];

const smallPlates = [
  { name: "Crispy Calamari", desc: "lemon, chili, charred lime", price: 16 },
  { name: "Mini Wagyu Sliders", desc: "pickles, aged cheddar, house sauce", price: 22 },
  { name: "Shishito Peppers", desc: "miso butter, togarashi, yuzu", price: 13 },
  { name: "Tuna Tartare", desc: "avocado, wonton crisp, sriracha aioli", price: 21 },
];

const largePlates = [
  { name: "Grilled Branzino", desc: "fennel, lemon butter, caper salsa verde", price: 38 },
  { name: "Filet Mignon", desc: "6 oz, roasted garlic butter, watercress", price: 54 },
  { name: "Mushroom Risotto", desc: "black truffle, aged parmesan, chive oil", price: 29 },
  { name: "Seared Duck Breast", desc: "cherry jus, roasted root vegetables", price: 42 },
];

type MenuItem = { name: string; desc: string; price: number };

function MenuCategory({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <div>
      <h3 className="nt-display mb-6 text-2xl font-light italic text-[#f0ece4]">{title}</h3>
      <ul className="divide-y divide-[#243447]">
        {items.map((item) => (
          <li key={item.name} className="flex items-baseline justify-between gap-8 py-5">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#f0ece4]">{item.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#8b9bb4]">{item.desc}</p>
            </div>
            <span className="shrink-0 text-sm text-[#d4a574]">${item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Tab = "drinks" | "food";

export default function MenuPage() {
  const [tab, setTab] = useState<Tab>("drinks");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f1621] pt-16">
        <div className="border-b border-[#243447]">
          <div className="nt-container py-16 sm:py-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4a574]">Nightfall Terrace</p>
            <h1 className="nt-display mt-3 text-5xl font-light italic text-[#f0ece4] sm:text-6xl">
              Our menus
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8b9bb4]">
              Curated for the evening — signature cocktails, small plates, and
              dishes worth lingering over.
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="sticky top-16 z-40 border-b border-[#243447] bg-[#0f1621]/95 backdrop-blur-md">
          <div className="nt-container">
            <div className="flex gap-8">
              {(["drinks", "food"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "py-4 text-[11px] uppercase tracking-[0.2em] transition-colors duration-150 border-b-2 -mb-px",
                    tab === t
                      ? "border-[#d4a574] text-[#d4a574]"
                      : "border-transparent text-[#8b9bb4] hover:text-[#f0ece4]",
                  ].join(" ")}
                >
                  {t === "drinks" ? "Drinks" : "Food"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="nt-container py-16 sm:py-20">
          {tab === "drinks" && (
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              <MenuCategory title="Cocktails" items={cocktails} />
              <MenuCategory title="Wine by the glass" items={wine} />
            </div>
          )}
          {tab === "food" && (
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              <div className="space-y-14">
                <MenuCategory title="Snacks" items={snacks} />
                <MenuCategory title="Small plates" items={smallPlates} />
              </div>
              <MenuCategory title="Large plates" items={largePlates} />
            </div>
          )}
        </div>

        <div className="border-t border-[#243447]">
          <div className="nt-container py-16 text-center">
            <p className="nt-display text-3xl font-light italic text-[#f0ece4] sm:text-4xl">
              Ready for the evening?
            </p>
            <p className="mt-3 text-sm text-[#8b9bb4]">
              Secure your table with a deposit — takes under a minute.
            </p>
            <Link
              href="/#reservation"
              className="mt-8 inline-flex items-center justify-center border border-[#d4a574] px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#0f1621] transition-colors duration-200"
            >
              Reserve a table
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
