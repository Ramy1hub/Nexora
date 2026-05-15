import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { product_id, payment_method, transaction_id } = body;

    if (!product_id || !payment_method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if product exists
    const { data: product } = await supabase
      .from("products")
      .select("id, title, price")
      .eq("id", product_id)
      .single();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check for duplicate pending/approved order
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .in("order_status", ["pending", "approved"])
      .single();

    if (existingOrder) {
      return NextResponse.json(
        { error: "You already have an active order for this product" },
        { status: 409 }
      );
    }

    // Create order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        product_id,
        payment_method,
        payment_status: "pending",
        transaction_id: transaction_id || null,
        order_status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for admin
    await supabase.from("notifications").insert({
      title: "New Order Received",
      message: `New order for ${product.title} ($${product.price}) via ${payment_method}`,
      type: "order",
      is_read: false,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get user orders
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: orders } = await supabase
      .from("orders")
      .select("*, products(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
