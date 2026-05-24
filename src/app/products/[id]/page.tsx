"use client";

import ProductImageGallery from "@/components/ProductImageGallery";
import { GET_PRODUCT_DETAIL } from "@/graphql/queries";
import { useCartStore } from "@/store/cartStore";
import { GetProductsResponse, ProductAttribute, ProductVariant } from "@/types";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";

function AttributeSection({
  title,
  data,
}: {
  title: string;
  data: ProductAttribute[] | null;
}) {
  if (!data || data.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
      <div className="rounded-xl border border-slate-100 overflow-hidden">
        {data.map((attr, i) => (
          <div
            key={i}
            className={`flex gap-4 px-4 py-3 text-sm ${
              i % 2 === 0 ? "bg-slate-50" : "bg-white"
            }`}
          >
            <span className="text-slate-500 w-40 shrink-0">{attr.enLabel}</span>
            <span
              className="text-slate-800 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: attr.values.map((v) => v.enName).join(", "),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isPending, startTransition] = useTransition();

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const { data, loading, error } = useQuery<GetProductsResponse>(
    GET_PRODUCT_DETAIL,
    {
      variables: { filter: { uid: id } },
    }
  );

  const product = data?.getProducts?.result?.products?.[0];
  const statusCode = data?.getProducts?.statusCode;
  const message = data?.getProducts?.message;

  const variants = product?.variants ?? [];
  const selectedVariant: ProductVariant | undefined =
    variants[selectedVariantIndex];

  const mrpPrice = selectedVariant?.mrpPrice ?? 0;
  const discount = selectedVariant?.discount;
  const hasDiscount = discount != null && discount.amount > 0;
  const sellingPrice = hasDiscount ? discount?.value ?? mrpPrice : mrpPrice;
  const discountAmount = discount?.amount ?? 0;
  const discountType = discount?.type;
  const isOutOfStock = (selectedVariant?.quantity ?? 0) === 0;

  const discountLabel =
    hasDiscount && discountType === "percentage"
      ? `${discountAmount}% OFF`
      : hasDiscount && discountType === "flat"
      ? `৳${discountAmount} OFF`
      : null;

  const isInCart = cartItems.some(
    (i) => i.selectedVariant.posItemCode === selectedVariant?.posItemCode
  );

  const [optimisticAdded, addOptimistic] = useOptimistic(
    isInCart,
    (_state, newVal: boolean) => newVal
  );

  const handleAddToCart = () => {
    if (!product || !selectedVariant || isOutOfStock) return;
    startTransition(() => {
      addOptimistic(true);
      addItem(product, selectedVariant);
    });
  };

  const tabs = [
    { label: "Basic Info", data: product?.productAttributes },
    { label: "Details", data: product?.detailedDescriptions },
    { label: "Warranty", data: product?.serviceAndDeliveries },
    { label: "Terms", data: product?.deliveries },
  ].filter((t) => t.data && t.data.length > 0);

  const images = product?.images ?? [];

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-white rounded-2xl" />
            <div className="flex flex-col gap-4">
              <div className="h-6 bg-slate-200 rounded-full w-3/4" />
              <div className="h-4 bg-slate-100 rounded-full w-1/2" />
              <div className="h-10 bg-slate-200 rounded-full w-1/3 mt-4" />
              <div className="h-12 bg-slate-100 rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (error || statusCode !== 200 || !product) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-700 font-medium">
            {message ?? "Product not found"}
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
          >
            ← Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link
            href="/products"
            className="hover:text-indigo-600 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-600 line-clamp-1">{product.enName}</span>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <ProductImageGallery
            images={images}
            productName={product.enName}
            discountLabel={discountLabel}
          />

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 leading-snug">
                {product.enName}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">
                ৳{sellingPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    ৳{mrpPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                    {discountLabel}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOutOfStock ? "bg-red-400" : "bg-green-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isOutOfStock ? "text-red-500" : "text-green-600"
                }`}
              >
                {isOutOfStock
                  ? "Out of stock"
                  : `${selectedVariant?.quantity} units available`}
              </span>
            </div>

            {/* Variant Selection */}
            {variants.length > 1 && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Select Variant
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <button
                      key={v.posItemCode}
                      onClick={() => setSelectedVariantIndex(i)}
                      className={`px-3 py-2 text-xs rounded-xl border transition ${
                        selectedVariantIndex === i
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      } ${
                        v.quantity === 0 ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                      disabled={v.quantity === 0}
                    >
                      ৳{(v.discount?.value ?? v.mrpPrice).toLocaleString()}
                      {v.quantity === 0 && " (Out of stock)"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isPending}
                className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  optimisticAdded
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : isOutOfStock
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                }`}
              >
                {optimisticAdded
                  ? "✓ Added to cart"
                  : isOutOfStock
                  ? "Out of stock"
                  : "Add to cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        {tabs.length > 0 && (
          <div className="mt-12">
            {/* Tab Headers */}
            <div className="flex gap-1 border-b border-slate-200 mb-6">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-t-xl transition ${
                    activeTab === i
                      ? "bg-white border border-b-white border-slate-200 text-indigo-600 -mb-px"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <AttributeSection
                title={tabs[activeTab].label}
                data={tabs[activeTab].data ?? null}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
