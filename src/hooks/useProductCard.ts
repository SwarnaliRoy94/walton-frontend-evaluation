"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/types";
import {
  getDiscountBadge,
  getSavingsText,
  getSellingPrice,
  getVariantStock,
  pickDisplayVariant,
} from "@/lib/pricing";
import { useCartStore } from "@/store/cartStore";
import { useOptimisticCartQuantity } from "./useOptimisticCartQuantity";

export const useProductCard = (product: Product) => {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItems = useCartStore((state) => state.items);

  const variants = product.variants ?? [];
  const defaultVariant = pickDisplayVariant(variants);
  const [selectedVariantCode, setSelectedVariantCode] = useState<string | null>(
    () => defaultVariant?.posItemCode ?? null
  );

  const selectedVariant: ProductVariant | undefined =
    variants.find((variant) => variant.posItemCode === selectedVariantCode) ??
    defaultVariant;

  const imageUrl = product.images?.[0]?.url;
  const mrpPrice = selectedVariant?.mrpPrice ?? 0;
  const sellingPrice = getSellingPrice(selectedVariant);
  const discountLabel = getDiscountBadge(selectedVariant);
  const savingsText = getSavingsText(selectedVariant);
  const hasDiscount = discountLabel != null;
  const maxStock = getVariantStock(selectedVariant);
  const isOutOfStock = maxStock === 0;

  const cartItem = cartItems.find(
    (item) => item.selectedVariant.posItemCode === selectedVariant?.posItemCode
  );
  const cartQuantity = cartItem?.quantity ?? 0;
  const {
    optimisticCartQuantity,
    isInCart,
    canIncreaseQuantity,
    runOptimisticAction,
  } = useOptimisticCartQuantity(cartQuantity, maxStock);

  const onVariantSelect = (variantCode: string): void => {
    setSelectedVariantCode(variantCode);
  };

  const onAddToCart = (): void => {
    if (!selectedVariant || isOutOfStock || !canIncreaseQuantity) return;
    runOptimisticAction("add");
    addItem(product, selectedVariant);
  };

  const onDecreaseCartQuantity = (): void => {
    const variantCode = selectedVariant?.posItemCode;
    if (!variantCode || !isInCart) return;

    const nextQuantity = Math.max(0, optimisticCartQuantity - 1);
    runOptimisticAction("decrease");

    if (nextQuantity === 0) {
      removeItem(variantCode);
      return;
    }

    updateQuantity(variantCode, nextQuantity);
  };

  const onIncreaseCartQuantity = (): void => {
    if (!selectedVariant || !canIncreaseQuantity) return;

    const variantCode = selectedVariant.posItemCode;
    const nextQuantity = Math.min(maxStock, optimisticCartQuantity + 1);
    runOptimisticAction("increase");

    if (!cartItem) {
      addItem(product, selectedVariant);
      return;
    }

    updateQuantity(variantCode, nextQuantity);
  };

  const onRemoveFromCart = (): void => {
    const variantCode = selectedVariant?.posItemCode;
    if (!variantCode || !isInCart) return;
    runOptimisticAction("remove");
    removeItem(variantCode);
  };

  return {
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
    cartQuantity: optimisticCartQuantity,
    canIncreaseQuantity,
    onVariantSelect,
    onAddToCart,
    onDecreaseCartQuantity,
    onIncreaseCartQuantity,
    onRemoveFromCart,
  };
};
