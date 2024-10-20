import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENCAGE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return NextResponse.json({ lat, lng });
    } else {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching geocode data:", error);
    return NextResponse.json(
      { error: "Error fetching geocode data" },
      { status: 500 }
    );
  }
}
