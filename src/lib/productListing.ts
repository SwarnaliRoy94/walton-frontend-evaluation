import {
  ALL_FILTER_VALUE,
  AvailabilityFilterValue,
  PriceFilterValue,
  SortValue,
} from "@/constants/productListing";
import { Product } from "@/types";
import { getSellingPrice, getVariantStock, pickDisplayVariant } from "@/lib/pricing";

export interface ListingFilters {
  categoryFilter: string;
  availabilityFilter: AvailabilityFilterValue;
  priceFilter: PriceFilterValue;
  sort: SortValue;
}

export const getProductPrice = (product: Product): number => {
  const variant = pickDisplayVariant(product.variants);
  return getSellingPrice(variant);
};

export const getProductRating = (product: Product): number | null => {
  const rating = product.rating?.average;
  return typeof rating === "number" && Number.isFinite(rating) ? rating : null;
};

export const getProductCategory = (product: Product): string => {
  const categoryAttribute = (product.productAttributes ?? []).find((attr) =>
    attr.enLabel.toLowerCase().includes("category")
  );
  const category = categoryAttribute?.values?.[0]?.enName?.trim();
  return category || "Uncategorized";
};

export const getUniqueCategories = (products: Product[]): string[] => {
  const uniqueCategories = new Set<string>();
  products.forEach((product) => {
    uniqueCategories.add(getProductCategory(product));
  });
  return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
};

const matchesCategory = (product: Product, categoryFilter: string): boolean => {
  if (categoryFilter === ALL_FILTER_VALUE) return true;
  return getProductCategory(product) === categoryFilter;
};

const matchesAvailability = (
  product: Product,
  availabilityFilter: AvailabilityFilterValue
): boolean => {
  if (availabilityFilter === ALL_FILTER_VALUE) return true;
  const inStock = product.variants.some((variant) => getVariantStock(variant) > 0);
  return availabilityFilter === "in_stock" ? inStock : !inStock;
};

const matchesPrice = (
  product: Product,
  priceFilter: PriceFilterValue
): boolean => {
  if (priceFilter === ALL_FILTER_VALUE) return true;

  const price = getProductPrice(product);
  if (priceFilter === "under_20000") return price < 20000;
  if (priceFilter === "between_20000_50000") {
    return price >= 20000 && price <= 50000;
  }
  if (priceFilter === "above_50000") return price > 50000;
  return true;
};

const sortProducts = (products: Product[], sort: SortValue): Product[] => {
  if (sort === "price_asc") {
    return products.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  }
  if (sort === "price_desc") {
    return products.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  }
  if (sort === "rating_desc" || sort === "rating_asc") {
    const isDesc = sort === "rating_desc";
    return products.sort((a, b) => {
      const ratingA = getProductRating(a);
      const ratingB = getProductRating(b);

      if (ratingA == null && ratingB == null) return 0;
      if (ratingA == null) return 1;
      if (ratingB == null) return -1;

      return isDesc ? ratingB - ratingA : ratingA - ratingB;
    });
  }
  return products;
};

export const filterAndSortProducts = (
  products: Product[],
  filters: ListingFilters
): Product[] => {
  const { categoryFilter, availabilityFilter, priceFilter, sort } = filters;

  const filtered = products.filter(
    (product) =>
      matchesCategory(product, categoryFilter) &&
      matchesAvailability(product, availabilityFilter) &&
      matchesPrice(product, priceFilter)
  );

  return sortProducts(filtered, sort);
};
