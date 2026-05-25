# Walton Frontend Evaluation

A Next.js 16 + GraphQL frontend implementation for Walton Plaza product listing and product details.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Apollo Client
- Zustand (persisted cart state)
- Tailwind CSS v4

## Implemented Features

- Product listing page with server-side pagination.
- Client-side sorting (price asc/desc, rating asc/desc).
- Client-side filters (category, price range, stock availability).
- Search on currently loaded page data.
- Product cards with discount ribbon (`% OFF`), MRP vs selling price, save amount, and variant chips.
- Add-to-cart CTA that switches to quantity controls and remove action.
- Product details page with image gallery, variant selection, stock/price/discount summary, and cart controls.
- Special Features section with fallback copy if empty.
- Additional tabbed attribute sections from API data.
- Global cart drawer with increment/decrement/remove, total calculation, and clear cart.
- Persisted cart state via localStorage (`walton-cart`).
- Above-the-fold image loading optimizations for better LCP behavior.

## Pricing and Variant Logic

- Variant selection prefers first in-stock variant, else falls back to first variant.
- Selling price calculation supports percentage discount, flat discount, and `discount.value` fallback.
- Discount UI derives `% OFF` badge text and `Save ৳X` text from computed pricing.
- Stock-aware cart limits prevent adding beyond available quantity.

## Search and Pagination Strategy

The Walton GraphQL API constraints directly affect UX strategy:

- Available backend filters are limited to `uid`, `posItemCode`, and `isActive` (no product-name filter).
- API responses are effectively capped at 30 items per request.

What was evaluated:

- A batch-fetch strategy (fetching all products client-side in multiple requests) worked technically.
- In practice it triggered API rate-limit/fetch failures when many requests were fired quickly.
- Throttling those requests avoided failures but caused unacceptable initial load latency.

Current decision:

- Use reliable paginated fetching.
- Search is intentionally scoped to the currently loaded page dataset.

Production-grade recommendation:

- Add a backend name-based search endpoint, or
- Integrate a dedicated search index (Elasticsearch/Algolia), or
- Sync products to a searchable store via background jobs.

## Project Structure

```text
src/
  app/
    page.tsx                    # Redirects / to /products (preserves query params)
    products/page.tsx           # Product listing UI
    products/[id]/page.tsx      # Product detail UI
  components/
    ProductCard.tsx
    ProductImageGallery.tsx
    Header.tsx
    Footer.tsx
    Cart/CartDrawer.tsx
  constants/
    productListing.ts
    productDetail.ts
    footer.ts
  graphql/
    queries.ts
  hooks/
    useProductListing.ts
    useProductDetail.ts
    useProductCard.ts
  lib/
    apollo.ts
    apolloWrapper.tsx
    pricing.ts
    productListing.ts
  store/
    cartStore.ts
  types/
    index.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_GRAPHQL_URL=url
```

3. Start development server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - run development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Notes

- This codebase intentionally prioritizes correctness and stability against current API behavior.
- Some UI behaviors (search scope, pagination strategy) are constrained.
