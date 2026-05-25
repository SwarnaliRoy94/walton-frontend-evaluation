export type SortValue =
  | "default"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "rating_asc";

export type PriceFilterValue =
  | "all"
  | "under_20000"
  | "between_20000_50000"
  | "above_50000";

export type AvailabilityFilterValue = "all" | "in_stock" | "out_of_stock";

export interface SelectOption<TValue extends string> {
  label: string;
  value: TValue;
}

export const PRODUCTS_PER_PAGE = 12;
export const ALL_FILTER_VALUE = "all" as const;
export const DEFAULT_SORT_VALUE: SortValue = "default";

export const SORT_OPTIONS: SelectOption<SortValue>[] = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating: High to Low", value: "rating_desc" },
  { label: "Rating: Low to High", value: "rating_asc" },
];

export const PRICE_FILTER_OPTIONS: SelectOption<PriceFilterValue>[] = [
  { label: "All prices", value: "all" },
  { label: "Under ৳20,000", value: "under_20000" },
  { label: "৳20,000 - ৳50,000", value: "between_20000_50000" },
  { label: "Above ৳50,000", value: "above_50000" },
];

export const AVAILABILITY_FILTER_OPTIONS: SelectOption<AvailabilityFilterValue>[] = [
  { label: "All stock", value: "all" },
  { label: "In stock", value: "in_stock" },
  { label: "Out of stock", value: "out_of_stock" },
];
