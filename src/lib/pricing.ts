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
  const discount = variant?.discount;
  if (!discount) return null;

  const amount = toNumber(discount.amount);
  const discountType = getDiscountType(discount.type);
  if (amount <= 0) return null;

  if (discountType === "percentage") {
    return `${amount}% OFF`;
  }

  if (discountType === "flat") {
    return `৳${amount.toLocaleString()} OFF`;
  }

  return null;
};

export const getSavingsText = (
  variant?: ProductVariant | null
): string | null => {
  const discount = variant?.discount;
  if (!discount) return null;

  const amount = toNumber(discount.amount);
  const discountType = getDiscountType(discount.type);
  if (amount <= 0) return null;

  if (discountType === "percentage") {
    return `Save ${amount}%`;
  }

  if (discountType === "flat") {
    return `Save ৳${amount.toLocaleString()}`;
  }

  return null;
};
