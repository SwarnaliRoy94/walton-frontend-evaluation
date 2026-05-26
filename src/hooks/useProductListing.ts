"use client";

import { useEffect, useMemo, useState } from "react";
import { ApolloError } from "@apollo/client";
import { GET_PRODUCTS } from "@/graphql/queries";
import { GetProductsResponse, Product, ProductFilterInput } from "@/types";
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
import { apolloClient } from "@/lib/apollo";
import { useProductListingStore } from "@/store/productListingStore";

const EMPTY_PRODUCTS: Product[] = [];
const API_PAGE_LIMIT = 30;
const SEARCH_DEBOUNCE_MS = 300;

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
  const search = useProductListingStore((state) => state.search);
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<SortValue>(DEFAULT_SORT_VALUE);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<PriceFilterValue>(ALL_FILTER_VALUE);
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_FILTER_VALUE);
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilterValue>(ALL_FILTER_VALUE);
  const [allProducts, setAllProducts] = useState<Product[]>(EMPTY_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApolloError | Error | null>(null);
  const [apiStatusCode, setApiStatusCode] = useState<number | undefined>();
  const [apiMessage, setApiMessage] = useState<string | undefined>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let ignoreResponse = false;

    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      setApiStatusCode(undefined);
      setApiMessage(undefined);

      try {
        const filter: ProductFilterInput = { isActive: null };

        let skip = 0;
        let expectedCount = 0;
        const aggregatedProducts: Product[] = [];

        while (true) {
          const { data } = await apolloClient.query<GetProductsResponse>({
            query: GET_PRODUCTS,
            variables: {
              pagination: { skip, limit: API_PAGE_LIMIT },
              filter,
            },
            fetchPolicy: "network-only",
          });

          const response = data?.getProducts;
          if (!response) {
            throw new Error("Invalid response from products API");
          }

          if (response.statusCode !== 200) {
            if (!ignoreResponse) {
              setApiStatusCode(response.statusCode);
              setApiMessage(response.message);
              setAllProducts(EMPTY_PRODUCTS);
            }
            return;
          }

          if (!ignoreResponse) {
            setApiStatusCode(response.statusCode);
            setApiMessage(response.message);
          }

          const batch = response.result?.products ?? EMPTY_PRODUCTS;
          expectedCount = response.result?.count ?? 0;
          aggregatedProducts.push(...batch);

          if (
            batch.length === 0 ||
            aggregatedProducts.length >= expectedCount ||
            batch.length < API_PAGE_LIMIT
          ) {
            break;
          }

          skip += batch.length;
        }

        if (!ignoreResponse) {
          setAllProducts(aggregatedProducts);
        }
      } catch (caughtError) {
        if (!ignoreResponse) {
          const apolloError = caughtError as ApolloError;
          const networkStatusCode = (
            apolloError.networkError as
              | { statusCode?: number; response?: { status?: number } }
              | undefined
          )?.statusCode ?? (
            apolloError.networkError as
              | { statusCode?: number; response?: { status?: number } }
              | undefined
          )?.response?.status;

          if (networkStatusCode === 429) {
            setError(null);
            setApiStatusCode(429);
            setApiMessage("Too many requests. Please wait a moment and try again.");
            return;
          }

          setError(apolloError);
          setAllProducts(EMPTY_PRODUCTS);
        }
      } finally {
        if (!ignoreResponse) {
          setLoading(false);
        }
      }
    };

    fetchAllProducts();

    return () => {
      ignoreResponse = true;
    };
  }, []);

  const hasApiError =
    typeof apiStatusCode === "number" && apiStatusCode !== 200;

  const searchedProducts = useMemo(() => {
    if (!debouncedSearch) return allProducts;

    const query = debouncedSearch.toLowerCase();
    return allProducts.filter((product) => {
      const enName = product.enName?.toLowerCase() ?? "";
      return enName.includes(query);
    });
  }, [allProducts, debouncedSearch]);

  const categories = useMemo(() => {
    return getUniqueCategories(allProducts);
  }, [allProducts]);

  const filteredAndSortedAll = useMemo(() => {
    return filterAndSortProducts(searchedProducts, {
      categoryFilter,
      availabilityFilter,
      priceFilter,
      sort,
    });
  }, [searchedProducts, categoryFilter, availabilityFilter, priceFilter, sort]);

  const totalCount = filteredAndSortedAll.length;
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const safePage = totalPages > 0 ? Math.min(page, totalPages - 1) : 0;

  const filteredAndSorted = useMemo(() => {
    const start = safePage * PRODUCTS_PER_PAGE;
    return filteredAndSortedAll.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredAndSortedAll, safePage]);

  const paginationItems = useMemo(() => {
    return getPaginationItems(safePage, totalPages);
  }, [safePage, totalPages]);

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
    page: safePage,
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
    onCategoryFilterChange,
    onPriceFilterChange,
    onAvailabilityFilterChange,
    onSortChange,
    onPageChange,
    onPreviousPage,
    onNextPage,
  };
};
