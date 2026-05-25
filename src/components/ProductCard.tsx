"use client";

import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItems = useCartStore((s) => s.items);

  const variant = product.variants?.[0];
  const imageUrl = product.images?.[0]?.url;

  const mrpPrice = variant?.mrpPrice ?? 0;
  const discount = variant?.discount;
  const hasDiscount = discount != null && discount.amount > 0;
  const discountType = discount?.type;
  const discountAmount = discount?.amount ?? 0;
  const sellingPrice = hasDiscount ? discount?.value ?? mrpPrice : mrpPrice;
  const isOutOfStock = (variant?.quantity ?? 0) === 0;

  const discountLabel =
    hasDiscount && discountType === "percentage"
      ? `${discountAmount}% OFF`
      : hasDiscount && discountType === "flat"
      ? `৳${discountAmount} OFF`
      : null;

  const cartItem = cartItems.find(
    (i) => i.selectedVariant.posItemCode === variant?.posItemCode
  );
  const cartQuantity = cartItem?.quantity ?? 0;

  const handleAddToCart = () => {
    if (!variant || isOutOfStock) return;
    addItem(product, variant);
  };

  return (
    <div className="group relative bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Discount Badge */}
      {discountLabel && (
        <div className="absolute top-3 left-3 z-10 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
          {discountLabel}
        </div>
      )}

      {/* Out of stock badge */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 z-10 bg-slate-800/80 text-white text-xs px-2.5 py-1 rounded-lg">
          Out of stock
        </div>
      )}

      {/* Image */}
      <Link
        href={`/products/${product.uid}`}
        className="block overflow-hidden bg-slate-50"
      >
        <div className="relative w-full aspect-square overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.enName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain bg-indigo-50 p-4 group-hover:scale-105 transition-transform duration-500"
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
      <div className="p-4 flex flex-col flex-1 gap-3">
        <Link href={`/products/${product.uid}`}>
          <h2 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug hover:text-indigo-800 transition-colors">
            {product.enName}
          </h2>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-semibold text-indigo-900">
            ৳{sellingPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              ৳{mrpPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        {cartItem ? (
          <div className="w-full py-2.5 px-3 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-200 flex items-center justify-between gap-2">
            <span className="text-left">Added to cart</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  cartQuantity === 1
                    ? removeItem(cartItem.selectedVariant.posItemCode)
                    : updateQuantity(
                        cartItem.selectedVariant.posItemCode,
                        cartQuantity - 1
                      )
                }
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-100 transition text-sm font-medium"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-sm font-medium text-slate-700 w-5 text-center">
                {cartQuantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(
                    cartItem.selectedVariant.posItemCode,
                    cartQuantity + 1
                  )
                }
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-100 transition text-sm font-medium"
                aria-label="Increase quantity"
              >
                +
              </button>
              <button
                onClick={() => removeItem(cartItem.selectedVariant.posItemCode)}
                className="text-slate-300 hover:text-red-400 transition"
                aria-label="Remove item"
              >
                <svg
                  className="w-4 h-4"
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
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-200 text-indigo-900 hover:bg-indigo-400 hover:text-white active:scale-95"
            }`}
          >
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(ProductCard);
