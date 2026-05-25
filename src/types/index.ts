export interface ProductImage {
  url: string;
}

export interface AttributeValue {
  enName: string;
}

export interface ProductAttribute {
  enLabel: string;
  values: AttributeValue[];
}

export interface Discount {
  amount: number;
  value: number;
  type: string;
}

export interface ProductVariant {
  mrpPrice: number;
  ebsItemCode: string;
  posItemCode: string;
  quantity: number;
  discount: Discount | null;
}

export interface Product {
  uid: string;
  enName: string;
  images: ProductImage[];
  productAttributes: ProductAttribute[] | null;
  detailedDescriptions: ProductAttribute[] | null;
  deliveries: ProductAttribute[] | null;
  serviceAndDeliveries: ProductAttribute[] | null;
  priceAndStocks: ProductAttribute[] | null;
  variants: ProductVariant[];
}

export interface ProductsResult {
  count: number;
  products: Product[];
}

export interface GetProductsResponse {
  getProducts: {
    message: string;
    statusCode: number;
    result: ProductsResult;
  };
}

export interface PaginationInput {
  skip: number;
  limit: number;
}

export interface ProductFilterInput {
  uid?: string;
  posItemCode?: string;
  isActive?: boolean | null;
}
