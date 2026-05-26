"use client";

import { Product } from "@/types";
import { getSellingPrice, getVariantStock } from "@/lib/pricing";
import { useProductCard } from "@/hooks/useProductCard";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface Props {
  product: Product;
  imageLoading?: "lazy" | "eager";
}

const ProductCard = ({ product, imageLoading = "lazy" }: Props) => {
  const {
    variants,
    selectedVariant,
    imageUrl,
    mrpPrice,
    sellingPrice,
    discountLabel,
    savingsText,
    hasDiscount,
    isOutOfStock,
    isInCart,
    cartQuantity,
    canIncreaseQuantity,
    onVariantSelect,
    onAddToCart,
    onDecreaseCartQuantity,
    onIncreaseCartQuantity,
    onRemoveFromCart,
  } = useProductCard(product);

  return (
    <div className="group relative bg-linear-to-b from-white via-white to-[#faf7ff] rounded-3xl border border-slate-200/80 hover:border-violet-200 hover:shadow-[0_24px_50px_-34px_rgba(67,56,202,0.35)] transition-all duration-300 overflow-hidden flex flex-col">
      {/* Discount Badge */}
      {discountLabel && (
        <div className="discount-ribbon top-4">
          {discountLabel}
        </div>
      )}

      {/* Out of stock badge */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 z-10 bg-slate-900/85 text-white text-xs px-2.5 py-1 rounded-xl">
          Out of stock
        </div>
      )}

      {/* Image */}
      <Link
        href={`/products/${product.uid}`}
        className="block overflow-hidden bg-linear-to-b from-[#f5f1ff] via-[#f7f5ff] to-[#edf1ff]"
      >
        <div className="relative w-full aspect-square overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.enName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading={imageLoading}
              className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <Link href={`/products/${product.uid}`}>
          <h2 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug hover:text-indigo-800 transition-colors">
            {product.enName}
          </h2>
        </Link>

        {variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {variants.map((v) => {
              const optionOutOfStock = getVariantStock(v) === 0;
              return (
                <button
                  key={v.posItemCode}
                  onClick={() => onVariantSelect(v.posItemCode)}
                  disabled={optionOutOfStock}
                  className={`px-2 py-1 text-[11px] rounded-xl border transition ${
                    selectedVariant?.posItemCode === v.posItemCode
                      ? "border-violet-300 bg-violet-50 text-violet-700 font-semibold"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-200"
                  } ${
                    optionOutOfStock ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  ৳{getSellingPrice(v).toLocaleString()}
                </button>
              );
            })}
          </div>
        )}

        {/* Price */}
        <div className="flex items-start mt-auto">
          <span className="text-lg font-bold text-slate-900">
            ৳{sellingPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <div className="ml-auto flex flex-col items-end text-right leading-tight">
              <span className="text-sm text-red-700 line-through">
                ৳{mrpPrice.toLocaleString()}
              </span>
              {savingsText && (
                <span className="text-xs text-green-700">{savingsText}</span>
              )}
            </div>
          )}
        </div>

        {/* Add to Cart */}
        {isInCart ? (
          <div className="w-full py-2.5 px-3 rounded-2xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-between gap-2">
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
            className={`w-full py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
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
  );
};

export default memo(ProductCard);
