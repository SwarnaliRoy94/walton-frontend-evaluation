import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductVariant } from "@/types";

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant) => void;
  removeItem: (posItemCode: string) => void;
  updateQuantity: (posItemCode: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant) => {
        const existing = get().items.find(
          (i) => i.selectedVariant.posItemCode === variant.posItemCode
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.selectedVariant.posItemCode === variant.posItemCode
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              { product, selectedVariant: variant, quantity: 1 },
            ],
          }));
        }
      },

      removeItem: (posItemCode) => {
        set((state) => ({
          items: state.items.filter(
            (i) => i.selectedVariant.posItemCode !== posItemCode
          ),
        }));
      },

      updateQuantity: (posItemCode, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.selectedVariant.posItemCode === posItemCode
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, i) => total + i.quantity, 0),
    }),
    {
      name: "walton-cart",
    }
  )
);
