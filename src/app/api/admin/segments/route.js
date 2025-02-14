import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const store = searchParams.get("store") || "3";
  const res = await fetch(
    `https://ai.mybranzapi.link/v1/customerSegmentation?storeId=${store}`
  );

  const products = await res.json();

  return NextResponse.json({ ...products });
}
