import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { orderId, userId, productId, productTitle, username } = await req.json();

    const accessToken = await getAccessToken();

    // Capture the PayPal payment
    const captureRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await captureRes.json();

    if (captureData.status === "COMPLETED") {
      const transactionId =
        captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id || orderId;

      // Save order to database as approved
      const { error: orderError } = await supabaseAdmin.from("orders").insert({
        user_id: userId,
        product_id: productId,
        payment_method: "paypal",
        payment_status: "completed",
        transaction_id: transactionId,
        order_status: "approved",
      });

      if (orderError) {
        console.error("Order save error:", orderError);
        return NextResponse.json(
          { error: "Payment captured but failed to save order. Contact support." },
          { status: 500 }
        );
      }

      // Create notification for admin
      await supabaseAdmin.from("notifications").insert({
        title: "New Paid Order",
        message: `${username || "A user"} purchased ${productTitle} (PayPal: ${transactionId})`,
        type: "order",
        is_read: false,
      });

      return NextResponse.json({
        success: true,
        transactionId,
        status: captureData.status,
      });
    }

    return NextResponse.json(
      { error: captureData.message || "Payment not completed" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Capture error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
