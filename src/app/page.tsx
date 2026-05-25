import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
      return;
    }
    if (typeof value === "string") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  redirect(queryString ? `/products?${queryString}` : "/products");
}
