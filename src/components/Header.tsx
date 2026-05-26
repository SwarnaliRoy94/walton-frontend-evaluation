"use client";

import { useCartStore } from "@/store/cartStore";
import { useProductListingStore } from "@/store/productListingStore";
import CartDrawer from "./Cart/CartDrawer";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const listingSearch = useProductListingStore((state) => state.search);
  const setListingSearch = useProductListingStore((state) => state.setSearch);
  const pathname = usePathname();
  const isProductsRoute = pathname === "/products";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 border-b border-slate-200/70 bg-white/78 backdrop-blur-xl">
        <div className="listing-container py-3.5 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-100 to-teal-100 text-base font-bold text-slate-700">
              W
            </span>
            <div>
              <span className="block text-lg sm:text-xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-space-grotesk)]">
                Walton Plaza
              </span>
              <span className="hidden sm:block text-[11px] text-slate-500">
                Electronics • Appliances • Smart Living
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {isProductsRoute && (
              <div className="w-[34vw] min-w-[120px] max-w-[360px] md:w-[360px]">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  className="search-input w-full"
                  aria-label="Search products"
                />
              </div>
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-slate-700 border border-slate-200 bg-white hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <span
                suppressHydrationWarning
                className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-slate-900 text-white text-[10px] font-semibold rounded-full flex items-center justify-center empty:hidden"
              >
                {totalItems > 0 ? totalItems : ""}
              </span>
            </button>
          </div>
        </div>
      </header>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
