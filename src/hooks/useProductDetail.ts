"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PRODUCT_DETAIL_TAB_CONFIGS } from "@/constants/productDetail";
import { GET_PRODUCT_DETAIL } from "@/graphql/queries";
import {
  getDiscountBadge,
  getSavingsText,
  getSellingPrice,
  getVariantStock,
  pickDisplayVariant,
} from "@/lib/pricing";
import { useCartStore } from "@/store/cartStore";
import { GetProductsResponse, ProductAttribute, ProductVariant } from "@/types";
import { useOptimisticCartQuantity } from "./useOptimisticCartQuantity";

interface DetailTab {
  label: string;
  data: ProductAttribute[];
}

export const useProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedVariantCode, setSelectedVariantCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItems = useCartStore((state) => state.items);

  const { data, loading, error } = useQuery<GetProductsResponse>(GET_PRODUCT_DETAIL, {
    variables: { filter: { uid: id } },
  });

  const product = data?.getProducts?.result?.products?.[0];
  const statusCode = data?.getProducts?.statusCode;
  const message = data?.getProducts?.message;

  const variants = product?.variants ?? [];
  const fallbackVariant = pickDisplayVariant(variants);
  const selectedVariant: ProductVariant | undefined =
    variants.find((variant) => variant.posItemCode === selectedVariantCode) ??
    fallbackVariant;

  const mrpPrice = selectedVariant?.mrpPrice ?? 0;
  const sellingPrice = getSellingPrice(selectedVariant);
  const discountLabel = getDiscountBadge(selectedVariant);
  const savingsText = getSavingsText(selectedVariant);
  const hasDiscount = discountLabel != null;
  const discountSummary = [discountLabel, savingsText]
    .filter((text): text is string => Boolean(text))
    .join(" · ");
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

  const tabs = useMemo(() => {
    return PRODUCT_DETAIL_TAB_CONFIGS.map(({ key, label }) => ({
      label,
      data: product?.[key] ?? null,
    })).filter(
      (tab): tab is DetailTab => Array.isArray(tab.data) && tab.data.length > 0
    );
  }, [product]);

  const safeActiveTab = tabs.length > 0 ? Math.min(activeTab, tabs.length - 1) : 0;

  const specialFeatures = product?.priceAndStocks ?? [];
  const images = product?.images ?? [];

  const onVariantChange = (variantCode: string): void => {
    setSelectedVariantCode(variantCode);
  };

  const onActiveTabChange = (index: number): void => {
    setActiveTab(index);
  };

  const onAddToCart = (): void => {
    if (!product || !selectedVariant || isOutOfStock || !canIncreaseQuantity) return;
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
    if (!product || !selectedVariant || !canIncreaseQuantity) return;

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
    savingsText,
    hasDiscount,
    discountSummary,
    isOutOfStock,
    isInCart,
    cartQuantity: optimisticCartQuantity,
    canIncreaseQuantity,
    tabs,
    activeTab: safeActiveTab,
    specialFeatures,
    images,
    onVariantChange,
    onActiveTabChange,
    onAddToCart,
    onDecreaseCartQuantity,
    onIncreaseCartQuantity,
    onRemoveFromCart,
  };
};
