"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";

interface Props {
  images: ProductImage[];
  productName: string;
  discountLabel?: string | null;
}

const ProductImageGallery = ({
  images,
  productName,
  discountLabel,
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages = images.filter((img) => img.url);

  const handlePrev = () => {
    setCurrentIndex((i) => (i === 0 ? validImages.length - 1 : i - 1));
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i === validImages.length - 1 ? 0 : i + 1));
  };

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-white rounded-2xl border border-slate-100 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl border border-slate-100 overflow-hidden group">
        <Image
          src={validImages[currentIndex].url}
          alt={`${productName} - image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6 transition-opacity duration-300"
          priority
        />

        {/* Discount badge */}
        {discountLabel && (
          <div className="discount-ribbon top-5">
            {discountLabel}
          </div>
        )}

        {/* Image counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs px-2.5 py-1 rounded-lg">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}

        {/* Prev / Next arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/80 border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              aria-label="Previous image"
            >
              <svg
                className="w-4 h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/80 border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              aria-label="Next image"
            >
              <svg
                className="w-4 h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                currentIndex === i
                  ? "border-indigo-500 shadow-sm shadow-indigo-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
