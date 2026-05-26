"use client";

import {
  ALL_FILTER_VALUE,
  AVAILABILITY_FILTER_OPTIONS,
  AvailabilityFilterValue,
  PRICE_FILTER_OPTIONS,
  PRODUCTS_PER_PAGE,
  PriceFilterValue,
  SORT_OPTIONS,
  SortValue,
} from "@/constants/productListing";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useProductListing } from "@/hooks/useProductListing";

const SERVICE_HIGHLIGHTS = [
  {
    title: "Official Warranty",
    subtitle: "100% verified products with full manufacturer coverage.",
  },
  {
    title: "Nationwide Delivery",
    subtitle: "Fast dispatch and reliable delivery across Bangladesh.",
  },
  {
    title: "Easy EMI",
    subtitle: "Flexible installment options for your convenience.",
  },
  {
    title: "24/7 Support",
    subtitle: "Dedicated support team for purchase and after-sales help.",
  },
];

const ProductListingPage = () => {
  const {
    page,
    sort,
    priceFilter,
    categoryFilter,
    availabilityFilter,
    loading,
    error,
    apiMessage,
    hasApiError,
    totalCount,
    totalPages,
    categories,
    filteredAndSorted,
    paginationItems,
    onCategoryFilterChange,
    onPriceFilterChange,
    onAvailabilityFilterChange,
    onSortChange,
    onPageChange,
    onPreviousPage,
    onNextPage,
  } = useProductListing();
  const hasListingError = Boolean(error) || hasApiError;
  const listingErrorMessage =
    error?.message ?? apiMessage ?? "Something went wrong";

  return (
    <main className="page-shell">
      <section className="listing-container pt-6">
        <div className="rounded-[30px] border border-slate-200 bg-linear-to-r from-slate-100 via-[#faf7ff] to-sky-50 overflow-hidden shadow-[0_24px_46px_-34px_rgba(15,23,42,0.45)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_.9fr] items-start gap-5 p-6 sm:p-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                Walton Smart Living Collection
              </span>
              <div className="space-y-2.5">
                <h2 className="text-3xl sm:text-4xl leading-tight font-semibold text-slate-900 [font-family:var(--font-space-grotesk)]">
                  Smart Living Starts Here
                </h2>
                <p className="text-slate-600 text-sm sm:text-base max-w-xl">
                  Discover innovative electronics and home essentials crafted
                  for performance, comfort, and everyday convenience.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  {
                    title: "Smart Entertainment",
                    subtitle: "4K TVs and immersive sound",
                  },
                  {
                    title: "Cooling Comfort",
                    subtitle: "Efficient AC and climate control",
                  },
                  {
                    title: "Home Essentials",
                    subtitle: "Refrigerators and appliances",
                  },
                  {
                    title: "Work & Study",
                    subtitle: "Laptops and daily accessories",
                  },
                ].map((item, index) => (
                  <article
                    key={item.title}
                    className="feature-card-animate rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.65)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_38px_-24px_rgba(15,23,42,0.6)]"
                    style={{ animationDelay: `${120 + index * 90}ms` }}
                  >
                    <h3 className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 self-center">
              {SERVICE_HIGHLIGHTS.map((item, index) => (
                <div
                  key={item.title}
                  className="service-card-animate px-1 py-2 border-b border-slate-200/70 last:border-b-0 transition-transform duration-300 ease-out hover:translate-x-0.5"
                  style={{ animationDelay: `${240 + index * 110}ms` }}
                >
                  <h3 className="text-sm font-semibold text-slate-800 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="listing-container py-8">
        {/* Error */}
        {hasListingError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-rose-500"
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
            <p className="text-slate-400 text-sm mt-1">{listingErrorMessage}</p>
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
        {!loading && !hasListingError && filteredAndSorted.length === 0 && (
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
        {!loading && !hasListingError && filteredAndSorted.length > 0 && (
          <>
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 [font-family:var(--font-space-grotesk)]">
                  Discover Walton Products
                </h2>
                {!loading && (
                  <p className="text-sm text-slate-500 mt-1">
                    {totalCount} items available
                  </p>
                )}
              </div>

              <div className="flex gap-3 w-full lg:w-auto lg:max-w-[68%] lg:justify-end flex-nowrap overflow-x-auto pb-1">
                <select
                  value={categoryFilter}
                  onChange={(e) => onCategoryFilterChange(e.target.value)}
                  className="filter-select"
                >
                  <option value={ALL_FILTER_VALUE}>All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={priceFilter}
                  onChange={(e) =>
                    onPriceFilterChange(e.target.value as PriceFilterValue)
                  }
                  className="filter-select"
                >
                  {PRICE_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={availabilityFilter}
                  onChange={(e) =>
                    onAvailabilityFilterChange(
                      e.target.value as AvailabilityFilterValue
                    )
                  }
                  className="filter-select"
                >
                  {AVAILABILITY_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value as SortValue)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSorted.map((product, index) => (
                <ProductCard
                  key={product.uid}
                  product={product}
                  imageLoading={index < 4 ? "eager" : "lazy"}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                <button
                  onClick={onPreviousPage}
                  disabled={page === 0}
                  className="pagination-button"
                >
                  Previous
                </button>

                {paginationItems.map((paginationItem, i) =>
                  paginationItem === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={paginationItem}
                      onClick={() => onPageChange(paginationItem)}
                      className={`w-9 h-9 rounded-2xl text-sm font-semibold transition-all ${
                        page === paginationItem
                          ? "bg-slate-900 text-white shadow-[0_12px_24px_-14px_rgba(23,42,104,0.8)]"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:-translate-y-0.5"
                      }`}
                    >
                      {paginationItem + 1}
                    </button>
                  )
                )}

                <button
                  onClick={onNextPage}
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
};

export default ProductListingPage;
