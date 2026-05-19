import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to insert messages without requiring user to be logged in,
// or use regular client. Since anyone can submit contact form, using standard supabase client is fine if we allow public inserts.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.PAYPAL_CLIENT_SECRET ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name,
      email,
      message,
    });

    if (error) {
      console.error("Error saving contact message:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
