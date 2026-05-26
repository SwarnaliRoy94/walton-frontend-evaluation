import { create } from "zustand";

interface ProductListingStore {
  search: string;
  setSearch: (value: string) => void;
}

export const useProductListingStore = create<ProductListingStore>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
}));

