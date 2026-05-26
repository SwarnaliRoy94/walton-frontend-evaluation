"use client";

import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { GET_PRODUCTS } from "@/graphql/queries";
import { GetProductsResponse, Product } from "@/types";
import {
  ALL_FILTER_VALUE,
  AvailabilityFilterValue,
  DEFAULT_SORT_VALUE,
  PRODUCTS_PER_PAGE,
  PriceFilterValue,
  SortValue,
} from "@/constants/productListing";
import {
  filterAndSortProducts,
  getUniqueCategories,
} from "@/lib/productListing";

const EMPTY_PRODUCTS: Product[] = [];

const getPaginationItems = (
  page: number,
  totalPages: number
): (number | "...")[] => {
  if (totalPages <= 1) return [];

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(0);
  if (page > 3) pages.push("...");
  for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i += 1) {
    pages.push(i);
  }
  if (page < totalPages - 4) pages.push("...");
  pages.push(totalPages - 1);

  return pages;
};

export const useProductListing = () => {
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<SortValue>(DEFAULT_SORT_VALUE);
  const [search, setSearch] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<PriceFilterValue>(ALL_FILTER_VALUE);
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_FILTER_VALUE);
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilterValue>(ALL_FILTER_VALUE);

  const { data, loading, error } = useQuery<GetProductsResponse>(GET_PRODUCTS, {
    variables: {
      pagination: { skip: page * PRODUCTS_PER_PAGE, limit: PRODUCTS_PER_PAGE },
      filter: { isActive: null },
    },
  });

  const products = data?.getProducts?.result?.products ?? EMPTY_PRODUCTS;
  const totalCount = data?.getProducts?.result?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
  const apiStatusCode = data?.getProducts?.statusCode;
  const apiMessage = data?.getProducts?.message;
  const hasApiError =
    typeof apiStatusCode === "number" && apiStatusCode !== 200;

  const categories = useMemo(() => {
    return getUniqueCategories(products);
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    return filterAndSortProducts(products, {
      search,
      categoryFilter,
      availabilityFilter,
      priceFilter,
      sort,
    });
  }, [products, search, categoryFilter, availabilityFilter, priceFilter, sort]);

  const paginationItems = useMemo(() => {
    return getPaginationItems(page, totalPages);
  }, [page, totalPages]);

  const onSearchChange = (value: string): void => {
    setSearch(value);
    setPage(0);
  };

  const onCategoryFilterChange = (value: string): void => {
    setCategoryFilter(value);
    setPage(0);
  };

  const onPriceFilterChange = (value: PriceFilterValue): void => {
    setPriceFilter(value);
    setPage(0);
  };

  const onAvailabilityFilterChange = (
    value: AvailabilityFilterValue
  ): void => {
    setAvailabilityFilter(value);
    setPage(0);
  };

  const onSortChange = (value: SortValue): void => {
    setSort(value);
  };

  const onPageChange = (nextPage: number): void => {
    setPage(nextPage);
  };

  const onPreviousPage = (): void => {
    setPage((previousPage) => Math.max(0, previousPage - 1));
  };

  const onNextPage = (): void => {
    setPage((previousPage) => {
      if (totalPages <= 0) return previousPage;
      return Math.min(totalPages - 1, previousPage + 1);
    });
  };

  return {
    page,
    sort,
    search,
    priceFilter,
    categoryFilter,
    availabilityFilter,
    loading,
    error,
    apiStatusCode,
    apiMessage,
    hasApiError,
    totalCount,
    totalPages,
    categories,
    filteredAndSorted,
    paginationItems,
    onSearchChange,
    onCategoryFilterChange,
    onPriceFilterChange,
    onAvailabilityFilterChange,
    onSortChange,
    onPageChange,
    onPreviousPage,
    onNextPage,
  };
};
