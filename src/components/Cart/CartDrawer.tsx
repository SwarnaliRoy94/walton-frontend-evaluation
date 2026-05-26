"use client";

import { getSellingPrice, getVariantStock } from "@/lib/pricing";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: Props) => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce((sum, item) => {
    const price = getSellingPrice(item.selectedVariant);
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[430px] bg-linear-to-b from-sky-50 to-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-900 [font-family:var(--font-space-grotesk)]">
              Your Cart
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {items.length === 0
                ? "No items yet"
                : `${items.reduce((s, i) => s + i.quantity, 0)} items`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-300"
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
            </div>
            <p className="text-slate-500 text-sm">Your cart is empty</p>
          </div>
        )}

        {/* Items */}
        {items.length > 0 && (
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {items.map((item) => {
              const price = getSellingPrice(item.selectedVariant);
              const maxStock = getVariantStock(item.selectedVariant);
              const canIncreaseQuantity = item.quantity < maxStock;
              const imageUrl = item.product.images?.[0]?.url;

              return (
                <div
                  key={item.selectedVariant.posItemCode}
                  className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-3 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.75)]"
                >
                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.product.enName}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">
                      {item.product.enName}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      ৳{(price * item.quantity).toLocaleString()}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.selectedVariant.posItemCode)
                            : updateQuantity(
                                item.selectedVariant.posItemCode,
                                item.quantity - 1
                              )
                        }
                        className="qty-button"
                      >
                        −
                      </button>
                      <span className="qty-count">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.selectedVariant.posItemCode,
                            item.quantity + 1
                          )
                        }
                        disabled={!canIncreaseQuantity}
                        className="qty-button-disabled"
                      >
                        +
                      </button>

                      {/* Remove */}
                      <button
                        onClick={() =>
                          removeItem(item.selectedVariant.posItemCode)
                        }
                        className="ml-auto remove-item-button"
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
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex flex-col gap-3 bg-white/80">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Total</span>
              <span className="text-lg font-bold text-slate-900">
                ৳{total.toLocaleString()}
              </span>
            </div>
            <button className="w-full py-3.5 bg-slate-900 text-white text-sm font-semibold rounded-2xl hover:bg-slate-800 active:scale-95 transition-all">
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2.5 text-sm text-slate-400 hover:text-red-400 transition"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
