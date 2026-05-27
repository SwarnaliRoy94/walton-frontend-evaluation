# Walton Frontend Evaluation

This is a product listing and product details webpage with Next.js 16 and GraphQL as the frontend technology.

## Architecture Decisions and Trade-offs

### 1) State Management: Zustand over Redux / Context API

Decision:
Used Zustand for shared UI state: persisted cart state and cross-component product search state.

Reason:
- Cart needs global access with persistence (`walton-cart`) across pages.
- Product search input lives in `Header` while listing logic lives in PLP hook/components, so a small shared store avoids prop drilling.
- Zustand provides low boilerplate store API and targeted subscriptions.
- It is easy to persist only the required domain (`cart`) while keeping transient UI state (`product listing search`) non-persisted.

Trade-off:
- Redux has more conventions and ecosystem tools for really large state graphs.
- Without any additional memoization patterns, Context API can be simple and verbose and become a source of clutter without the need of extra state management.

### 2) React 19 Feature: `useOptimistic` for cart interactions

Decision:
Used React 19 `useOptimistic` for add/increase/decrease/remove cart quantity UX.

Reason:
- Cart actions are frequent and need to happen immediately.
- “Optimistic” updates enhance perceived responsiveness.
- Contains at least one meaningful user flow that utilizes a modern feature of React 19.

Trade-off:
- Increases state reconciliation complexity over just local updates being strictly synchronous.
- Needs to be updated with transitional support (startTransition) to prevent runtime warnings.

### 3) Pagination over infinite scroll

Decision:
Used explicit pagination for product listing over infinite scroll.

Reason:
- Current API behavior is most reliable with bounded, paged requests.
- Pagination provides deterministic navigation and easier control over request volume.
- It avoids aggressive client-side batching that can trigger failures/rate-limit behavior.

Trade-off:
- Infinite scroll can feel more fluid for discovery-heavy browsing.

### 4) Server vs Client Component split

Decision:
Keep route entries and layout as Server Components, and isolate interactive UI in Client Components.

Reason :
- Makes boundaries explicit in App Router architecture.
- Keeps client-side hooks/state where interaction is required.
- Better aligns with performance-oriented Next.js patterns.

Trade-off:
- Adds a thin wrapper layer (`app/.../page.tsx` -> client page component), which is extra structure to maintain.

### 5) Sanitizing API-provided HTML content

When building the product detail tabs (Warranty, Terms, Basic Info etc.), I noticed the API was returning raw HTML strings inside `enName` values — things like `<p>Guarantee: 1 Year</p>` rendering as plain text on screen.

The quick fix was `dangerouslySetInnerHTML`, which worked, but I wasn't comfortable leaving raw API HTML unfiltered — if the content ever contains a `<script>` tag or malicious markup, it would execute directly in the browser.

So I installed `dompurify` to sanitize the HTML before rendering, and `html-react-parser` to convert the cleaned HTML into proper React nodes.
It adds two dependencies and a small rendering step, but I assume it's the right call for content coming from an external API where you don't fully
control what gets stored.

### 6) Next.js image host policy (`remotePatterns`)

While building the product listing and detail pages, I noticed product images were breaking with a Next.js `Invalid src prop` error. The API was returning image URLs from multiple different hostnames — `cdn.waltonplaza.com.bd`, `devcdn.waltonplaza.com.bd`, and `walcart-dev-storage.s3.ap-southeast-1.amazonaws.com` and each new one required a separate config update.

To avoid repeatedly hitting this during development, I switched to a wildcard `hostname: "**"` pattern that accepts any HTTPS image source. This kept the focus on building features rather than chasing hostnames.

I'm aware this is broader than ideal for production. Once the full host inventory is confirmed, it can be restricted back to explicit trusted hostnames only.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Apollo Client
- Zustand (persisted cart + shared listing search state)
- Tailwind CSS v4

## Implemented Features

- Product listing page with server-side pagination.
- Client-side sorting (price asc/desc, rating asc/desc).
- Client-side filters (category, price range, stock availability, rating).
- Search shared between Header input and product listing via Zustand store.
- Product cards with discount ribbon (`% OFF`), MRP vs selling price, save amount, and variant chips.
- Add-to-cart CTA that switches to quantity controls and remove action.
- Product details page with image gallery, variant selection, stock/price/discount summary, and cart controls.
- Special Features section with fallback copy if empty.
- Additional tabbed attribute sections from API data.
- Global cart drawer with increment/decrement/remove, total calculation, and clear cart.
- Persisted cart state via localStorage (`walton-cart`).
- Above-the-fold image loading optimizations for better LCP behavior.
- React 19 `useOptimistic` for cart quantity interactions on both PLP and PDP.
- Explicit Server/Client boundary with server route/layout entries and isolated interactive client islands.

## Project Structure

```text
src/
  app/
    layout.tsx                  # Server layout entry
    page.tsx                    # Redirects / to /products (preserves query params)
    products/page.tsx           # Server route entry -> ProductListingClient
    products/[id]/page.tsx      # Server route entry -> ProductDetailClient
  components/
    pages/
      ProductListingClient.tsx
      ProductDetailClient.tsx
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
    useOptimisticCartQuantity.ts
  lib/
    apollo.ts
    apolloWrapper.tsx
    pricing.ts
    productListing.ts
    safeHtml.tsx
  store/
    cartStore.ts
    productListingStore.ts
  types/
    index.ts
```

## Setup

## Environment & Versions

Developed and tested with:

- Node.js: 24.4.0
- Next.js: 16.2.6
- React: 19.2.4
- React DOM: 19.2.4
- Apollo Client: 4.2.0


1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_GRAPHQL_URL= endpoint given by walton
```

3. Start development server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Run Notes / Troubleshooting

If the app does not run correctly:

1. Check Node version:

```bash
node -v
```

Use Node `24.4.0` (or at least Node `20+`).

2. Reinstall dependencies cleanly:

```bash
rm -rf node_modules package-lock.json .next
npm install
```

3. Ensure `.env.local` exists:

```env
NEXT_PUBLIC_GRAPHQL_URL= endpoint given by walton
```

4. Start development server:

```bash
npm run dev
```

5. If GraphQL/CORS/429 issues appear:
- This project proxies GraphQL through `/api/graphql` to avoid browser CORS issues.
- A `429 Too Many Requests` response means upstream API rate limiting; wait briefly and retry.

## Available Scripts

- `npm run dev` - run development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
