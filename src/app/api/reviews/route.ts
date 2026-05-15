import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// POST /api/reviews - Create review
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { product_id, rating, comment } = await request.json();

    if (!product_id || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if user purchased this product
    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .eq("order_status", "approved")
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "You must purchase this product first" },
        { status: 403 }
      );
    }

    // Check for existing review
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        product_id,
        rating: Math.min(5, Math.max(1, rating)),
        comment: comment || "",
      })
      .select()
      .single();

    if (error) throw error;

    // Update product average rating
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", product_id);

    if (reviews && reviews.length > 0) {
      const avg =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await supabase
        .from("products")
        .update({ rating: Math.round(avg * 10) / 10 })
        .eq("id", product_id);
    }

    return NextResponse.json({ review: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/reviews?product_id=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");

    if (!productId) {
      return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data } = await supabase
      .from("reviews")
      .select("*, users(username, avatar)")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    return NextResponse.json({ reviews: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
