import { NextResponse } from "next/server";

const UPSTREAM_GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL;

export async function POST(request: Request) {
  if (!UPSTREAM_GRAPHQL_URL) {
    return NextResponse.json(
      { error: "Missing upstream GraphQL URL configuration." },
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  try {
    const upstreamResponse = await fetch(UPSTREAM_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: rawBody,
      cache: "no-store",
    });

    const responseText = await upstreamResponse.text();
    const contentType =
      upstreamResponse.headers.get("content-type") ?? "application/json";

    return new Response(responseText, {
      status: upstreamResponse.status,
      headers: { "content-type": contentType },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach upstream GraphQL service." },
      { status: 502 }
    );
  }
}

