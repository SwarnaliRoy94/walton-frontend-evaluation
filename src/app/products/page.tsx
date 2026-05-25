"use client";

import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { GET_PRODUCTS } from "@/graphql/queries";
import { GetProductsResponse, Product } from "@/types";
import {
  ALL_FILTER_VALUE,
  AVAILABILITY_FILTER_OPTIONS,
  AvailabilityFilterValue,
  DEFAULT_SORT_VALUE,
  PRICE_FILTER_OPTIONS,
  PRODUCTS_PER_PAGE,
  PriceFilterValue,
  SORT_OPTIONS,
  SortValue,
} from "@/constants/productListing";
import {
  getSellingPrice,
  getVariantStock,
  pickDisplayVariant,
} from "@/lib/pricing";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";

const EMPTY_PRODUCTS: Product[] = [];

export default function ProductListingPage() {
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<SortValue>(DEFAULT_SORT_VALUE);
  const [search, setSearch] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<PriceFilterValue>(ALL_FILTER_VALUE);
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_FILTER_VALUE);
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilterValue>(ALL_FILTER_VALUE);

  const { data, loading, error } = useQuery<GetProductsResponse>(GET_PRODUCTS, {
    variables: {
      pagination: { skip: page * PRODUCTS_PER_PAGE, limit: PRODUCTS_PER_PAGE },
      filter: { isActive: null },
    },
  });

  const products = data?.getProducts?.result?.products ?? EMPTY_PRODUCTS;
  const totalCount = data?.getProducts?.result?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const getPrice = (product: Product): number => {
    const variant = pickDisplayVariant(product.variants);
    return getSellingPrice(variant);
  };

  const getRating = (product: Product): number | null => {
    const rating = product.rating?.average;
    return typeof rating === "number" && Number.isFinite(rating) ? rating : null;
  };

  const getCategory = (product: Product): string => {
    const categoryAttribute = (product.productAttributes ?? []).find((attr) =>
      attr.enLabel.toLowerCase().includes("category")
    );
    const category = categoryAttribute?.values?.[0]?.enName?.trim();
    return category || "Uncategorized";
  };

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    products.forEach((product) => {
      uniqueCategories.add(getCategory(product));
    });
    return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.enName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== ALL_FILTER_VALUE) {
      result = result.filter((product) => getCategory(product) === categoryFilter);
    }

    if (availabilityFilter !== ALL_FILTER_VALUE) {
      result = result.filter((product) => {
        const inStock = product.variants.some((variant) => getVariantStock(variant) > 0);
        return availabilityFilter === "in_stock" ? inStock : !inStock;
      });
    }

    if (priceFilter !== ALL_FILTER_VALUE) {
      result = result.filter((product) => {
        const price = getPrice(product);
        if (priceFilter === "under_20000") return price < 20000;
        if (priceFilter === "between_20000_50000") {
          return price >= 20000 && price <= 50000;
        }
        if (priceFilter === "above_50000") return price > 50000;
        return true;
      });
    }

    if (sort === "price_asc") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sort === "price_desc") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sort === "rating_desc" || sort === "rating_asc") {
      const isDesc = sort === "rating_desc";
      result.sort((a, b) => {
        const ratingA = getRating(a);
        const ratingB = getRating(b);

        if (ratingA == null && ratingB == null) return 0;
        if (ratingA == null) return 1;
        if (ratingB == null) return -1;

        return isDesc ? ratingB - ratingA : ratingA - ratingB;
      });
    }

    return result;
  }, [products, search, categoryFilter, availabilityFilter, priceFilter, sort]);

  return (
    <main className="page-shell">
      {/* Header */}
      <div className="bg-white/100 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="listing-container py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
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

          <div className="flex gap-3 w-full sm:w-auto flex-wrap">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="search-input"
            />

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
              className="filter-select"
            >
              <option value={ALL_FILTER_VALUE}>All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Price */}
            <select
              value={priceFilter}
              onChange={(e) => {
                setPriceFilter(e.target.value as PriceFilterValue);
                setPage(0);
              }}
              className="filter-select"
            >
              {PRICE_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Availability */}
            <select
              value={availabilityFilter}
              onChange={(e) => {
                setAvailabilityFilter(e.target.value as AvailabilityFilterValue);
                setPage(0);
              }}
              className="filter-select"
            >
              {AVAILABILITY_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
              className="filter-select"
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

      <div className="listing-container py-8">
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
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
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
              Try adjusting your search or filters
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
                  className="pagination-button"
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
                  className="pagination-button"
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
