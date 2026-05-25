export type ProductDetailTabKey =
  | "productAttributes"
  | "detailedDescriptions"
  | "serviceAndDeliveries"
  | "deliveries";

export interface ProductDetailTabConfig {
  key: ProductDetailTabKey;
  label: string;
}

export const PRODUCT_DETAIL_TAB_CONFIGS: ProductDetailTabConfig[] = [
  { key: "productAttributes", label: "Basic Info" },
  { key: "detailedDescriptions", label: "Details" },
  { key: "serviceAndDeliveries", label: "Warranty" },
  { key: "deliveries", label: "Terms" },
];
