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

const ProductListingPage = () => {
  const {
    page,
    sort,
    search,
    priceFilter,
    categoryFilter,
    availabilityFilter,
    loading,
    error,
    totalCount,
    totalPages,
    categories,
    filteredAndSorted,
    paginationItems,
    onSearchChange,
    onCategoryFilterChange,
    onPriceFilterChange,
    onAvailabilityFilterChange,
    onSortChange,
    onPageChange,
    onPreviousPage,
    onNextPage,
  } = useProductListing();

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
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />

            {/* Category */}
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

            {/* Price */}
            <select
              value={priceFilter}
              onChange={(e) => onPriceFilterChange(e.target.value as PriceFilterValue)}
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
              onChange={(e) =>
                onAvailabilityFilterChange(e.target.value as AvailabilityFilterValue)
              }
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
              <div className="flex items-center justify-center gap-2 mt-12">
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
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                        page === paginationItem
                          ? "bg-indigo-400 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
