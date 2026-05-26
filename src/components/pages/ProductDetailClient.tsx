"use client";

import ProductImageGallery from "@/components/ProductImageGallery";
import { getSellingPrice } from "@/lib/pricing";
import { useProductDetail } from "@/hooks/useProductDetail";
import { renderSafeHtml } from "@/lib/safeHtml";
import { ProductAttribute } from "@/types";
import Link from "next/link";

const AttributeSection = ({
  title,
  data,
}: {
  title: string;
  data: ProductAttribute[] | null;
}) => {
  if (!data || data.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800 mb-3 [font-family:var(--font-space-grotesk)]">
        {title}
      </h3>
      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        {data.map((attr, i) => (
          <div
            key={i}
            className={`flex gap-4 px-4 py-3 text-sm ${
              i % 2 === 0 ? "bg-violet-50/40" : "bg-white"
            }`}
          >
            <span className="text-slate-500 w-40 shrink-0">{attr.enLabel}</span>
            <span className="text-slate-800 prose prose-sm max-w-none">
              {renderSafeHtml(attr.values.map((v) => v.enName).join(", "))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const {
    loading,
    error,
    product,
    statusCode,
    message,
    variants,
    selectedVariant,
    mrpPrice,
    sellingPrice,
    discountLabel,
    hasDiscount,
    discountSummary,
    isOutOfStock,
    isInCart,
    cartQuantity,
    canIncreaseQuantity,
    tabs,
    activeTab,
    specialFeatures,
    images,
    onVariantChange,
    onActiveTabChange,
    onAddToCart,
    onDecreaseCartQuantity,
    onIncreaseCartQuantity,
    onRemoveFromCart,
  } = useProductDetail();

  // Loading
  if (loading) {
    return (
      <main className="page-shell">
        <div className="detail-container">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-linear-to-b from-white via-white to-violet-50/50 rounded-2xl" />
            <div className="flex flex-col gap-4">
              <div className="h-6 bg-slate-200 rounded-full w-3/4" />
              <div className="h-4 bg-slate-100 rounded-full w-1/2" />
              <div className="h-10 bg-slate-200 rounded-full w-1/3 mt-4" />
              <div className="h-12 bg-slate-100 rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (error || statusCode !== 200 || !product) {
    return (
      <main className="page-shell flex items-center justify-center">
        <div className="text-center rounded-3xl border border-violet-100 bg-linear-to-b from-white via-white to-violet-50/50 px-8 py-10 shadow-[0_22px_50px_-34px_rgba(67,56,202,0.35)]">
          <p className="text-slate-700 font-medium">
            {message ?? "Product not found"}
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm text-sky-700 hover:underline"
          >
            ← Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="detail-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-7">
          <Link
            href="/products"
            className="hover:text-slate-900 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-800 line-clamp-1">{product.enName}</span>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <ProductImageGallery
            images={images}
            productName={product.enName}
            discountLabel={discountLabel}
          />

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug [font-family:var(--font-space-grotesk)]">
                {product.enName}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-linear-to-r from-white via-white to-violet-50/60 p-4 shadow-[0_20px_40px_-34px_rgba(67,56,202,0.34)]">
              <span className="text-3xl font-bold text-slate-900">
                ৳{sellingPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <div className="ml-auto flex flex-col items-end gap-1 text-right">
                  <span className="text-base text-rose-700 line-through">
                    ৳{mrpPrice.toLocaleString()}
                  </span>
                  {discountSummary && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {discountSummary}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOutOfStock ? "bg-red-400" : "bg-green-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isOutOfStock ? "text-red-500" : "text-green-600"
                }`}
              >
                {isOutOfStock
                  ? "Out of stock"
                  : `${selectedVariant?.quantity} units available`}
              </span>
            </div>

            {/* Variant Selection */}
            {variants.length > 1 && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Select Variant
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.posItemCode}
                      onClick={() => onVariantChange(v.posItemCode)}
                      className={`px-3 py-2 text-xs rounded-2xl border transition ${
                        selectedVariant?.posItemCode === v.posItemCode
                          ? "border-violet-300 bg-violet-50 text-violet-700 font-semibold"
                          : "border-slate-200 bg-white text-slate-600 hover:border-violet-200"
                      } ${
                        v.quantity === 0 ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                      disabled={v.quantity === 0}
                    >
                      ৳{getSellingPrice(v).toLocaleString()}
                      {v.quantity === 0 && " (Out of stock)"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col gap-3 mt-2">
              {isInCart ? (
                <div className="w-full py-3.5 px-4 rounded-2xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-between gap-3">
                  <span className="text-left">Added to cart</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onDecreaseCartQuantity}
                      className="qty-button"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-count">
                      {cartQuantity}
                    </span>
                    <button
                      onClick={onIncreaseCartQuantity}
                      disabled={!canIncreaseQuantity}
                      className="qty-button-disabled"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      onClick={onRemoveFromCart}
                      className="remove-item-button"
                      aria-label="Remove item"
                    >
                      <svg
                        className="small-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isOutOfStock
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-indigo-900 hover:-translate-y-0.5 active:scale-95"
                  }`}
                >
                  {isOutOfStock ? "Out of stock" : "Add to cart"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Special Features */}
        <div className="mt-10">
          <div className="bg-linear-to-b from-white via-white to-violet-50/45 rounded-3xl border border-violet-100 p-6 shadow-[0_22px_45px_-35px_rgba(67,56,202,0.32)]">
            {specialFeatures.length > 0 ? (
              <AttributeSection title="Special Features" data={specialFeatures} />
            ) : (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Special Features
                </h3>
                <p className="text-sm text-slate-500">
                  No special features for this product is available.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        {tabs.length > 0 && (
          <div className="mt-12">
            {/* Tab Headers */}
            <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => onActiveTabChange(i)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-t-2xl whitespace-nowrap transition ${
                    activeTab === i
                      ? "bg-violet-50/65 border border-b-violet-50 border-violet-200 text-slate-900 -mb-px [font-family:var(--font-space-grotesk)]"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-linear-to-b from-white via-white to-violet-50/45 rounded-3xl border border-violet-100 p-6 shadow-[0_22px_45px_-35px_rgba(67,56,202,0.32)]">
              <AttributeSection
                title={tabs[activeTab].label}
                data={tabs[activeTab].data ?? null}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
