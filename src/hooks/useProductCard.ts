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
  const canIncreaseQuantity = cartQuantity < maxStock;

  const onVariantSelect = (variantCode: string): void => {
    setSelectedVariantCode(variantCode);
  };

  const onAddToCart = (): void => {
    if (!selectedVariant || isOutOfStock) return;
    addItem(product, selectedVariant);
  };

  const onDecreaseCartQuantity = (): void => {
    if (!cartItem) return;
    if (cartQuantity === 1) {
      removeItem(cartItem.selectedVariant.posItemCode);
      return;
    }

    updateQuantity(cartItem.selectedVariant.posItemCode, cartQuantity - 1);
  };

  const onIncreaseCartQuantity = (): void => {
    if (!cartItem || !canIncreaseQuantity) return;
    updateQuantity(cartItem.selectedVariant.posItemCode, cartQuantity + 1);
  };

  const onRemoveFromCart = (): void => {
    if (!cartItem) return;
    removeItem(cartItem.selectedVariant.posItemCode);
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
    cartItem,
    cartQuantity,
    canIncreaseQuantity,
    onVariantSelect,
    onAddToCart,
    onDecreaseCartQuantity,
    onIncreaseCartQuantity,
    onRemoveFromCart,
  };
};
