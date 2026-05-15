import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PATCH /api/admin/orders/[orderId] - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await createServerSupabaseClient();

    // Verify admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { order_status, payment_status } = await request.json();

    const updateData: Record<string, string> = {};
    if (order_status) updateData.order_status = order_status;
    if (payment_status) updateData.payment_status = payment_status;

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select("*, products(title), users(username)")
      .single();

    if (error) throw error;

    // If approved, create notification for user and download record
    if (order_status === "approved" && order) {
      await supabase.from("notifications").insert({
        user_id: order.user_id,
        title: "Order Approved",
        message: `Your order for ${(order as any).products?.title} has been approved! You can now download it.`,
        type: "order",
        is_read: false,
      });

      // Create download record
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await supabase.from("downloads").insert({
        user_id: order.user_id,
        product_id: order.product_id,
        download_count: 0,
        expires_at: expiresAt.toISOString(),
      });

      // Increment product sales
      await supabase.rpc("increment_sales", {
        product_id_param: order.product_id,
      });
    }

    if (order_status === "rejected" && order) {
      await supabase.from("notifications").insert({
        user_id: order.user_id,
        title: "Order Rejected",
        message: `Your order for ${(order as any).products?.title} has been rejected. Please contact support.`,
        type: "order",
        is_read: false,
      });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
