import { ProductVariant } from "@/types";

const toNumber = (
  value: number | string | null | undefined
): number => {
  if (typeof value === "number") return Number.isNaN(value) ? 0 : value;
  if (typeof value === "string") {
    const parsed = Number(value.replaceAll(",", "").trim());
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const getDiscountType = (type: string | null | undefined): string => {
  return String(type ?? "").trim().toLowerCase();
};

const formatPercent = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1).replace(/\.0$/, "");
};

const getSavingsAmount = (
  variant?: ProductVariant | null
): number => {
  if (!variant) return 0;
  const mrpPrice = toNumber(variant.mrpPrice);
  const sellingPrice = getSellingPrice(variant);
  return Math.max(0, mrpPrice - sellingPrice);
};

const getDiscountPercent = (
  variant?: ProductVariant | null
): number => {
  if (!variant) return 0;
  const mrpPrice = toNumber(variant.mrpPrice);
  if (mrpPrice <= 0) return 0;
  const savings = getSavingsAmount(variant);
  return (savings / mrpPrice) * 100;
};

export const getSellingPrice = (
  variant?: ProductVariant | null
): number => {
  if (!variant) return 0;

  const mrpPrice = toNumber(variant.mrpPrice);
  const discount = variant.discount;

  if (!discount) return mrpPrice;

  const amount = toNumber(discount.amount);
  const value = toNumber(discount.value);
  const discountType = getDiscountType(discount.type);

  if (discountType === "percentage" && amount > 0) {
    return Math.max(0, Math.round(mrpPrice - (mrpPrice * amount) / 100));
  }

  if (discountType === "flat" && amount > 0) {
    return Math.max(0, mrpPrice - amount);
  }

  if (value > 0 && value < mrpPrice) {
    return value;
  }

  return mrpPrice;
};

export const getDiscountBadge = (
  variant?: ProductVariant | null
): string | null => {
  const percent = getDiscountPercent(variant);
  if (percent <= 0) return null;
  return `${formatPercent(percent)}% OFF`;
};

export const getSavingsText = (
  variant?: ProductVariant | null
): string | null => {
  const savings = getSavingsAmount(variant);
  if (savings <= 0) return null;
  return `Save ৳${Math.round(savings).toLocaleString()}`;
};
