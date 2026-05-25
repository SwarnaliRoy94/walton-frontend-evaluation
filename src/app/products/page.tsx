"use client";

import { useQuery } from "@apollo/client";
import { useState, useMemo } from "react";
import { GET_PRODUCTS } from "@/graphql/queries";
import { GetProductsResponse, Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";

const LIMIT = 12;

const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function ProductListingPage() {
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<string>("default");
  const [search, setSearch] = useState<string>("");

  const { data, loading, error } = useQuery<GetProductsResponse>(GET_PRODUCTS, {
    variables: {
      pagination: { skip: page * LIMIT, limit: LIMIT },
      filter: { isActive: null },
    },
  });

  const products = data?.getProducts?.result?.products ?? [];
  const totalCount = data?.getProducts?.result?.count ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const getPrice = (product: Product): number => {
    const variant = product.variants?.[0];
    if (!variant) return 0;
    return variant.discount?.value ?? variant.mrpPrice;
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.enName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "price_asc") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sort === "price_desc") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    }

    return result;
  }, [products, sort, search]);

  return (
    <main className="min-h-screen bg-linear-to-r from-slate-50 via-teal-50 to-slate-50">
      {/* Header */}
      <div className="bg-white/100 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-indigo-900 tracking-tight">
              Products
            </h1>
            {!loading && (
              <p className="text-sm text-slate-500 mt-0.5">
                {totalCount} items available
              </p>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="flex-1 sm:w-64 px-4 py-2 text-sm rounded-xl border border-slate-400 bg-white/80 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent transition"
            />

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-slate-700 font-medium">Something went wrong</p>
            <p className="text-slate-400 text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredAndSorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <p className="text-slate-700 font-medium">No products found</p>
            <p className="text-slate-400 text-sm mt-1">
              Try adjusting your search
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredAndSorted.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredAndSorted.map((product) => (
                <ProductCard key={product.uid} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                {(() => {
                  const pages: (number | "...")[] = [];
                  if (totalPages <= 7) {
                    for (let i = 0; i < totalPages; i++) pages.push(i);
                  } else {
                    pages.push(0);
                    if (page > 3) pages.push("...");
                    for (
                      let i = Math.max(1, page - 1);
                      i <= Math.min(totalPages - 2, page + 1);
                      i++
                    ) {
                      pages.push(i);
                    }
                    if (page < totalPages - 4) pages.push("...");
                    pages.push(totalPages - 1);
                  }

                  return pages.map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                          page === p
                            ? "bg-indigo-400 text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {(p as number) + 1}
                      </button>
                    )
                  );
                })()}

                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
