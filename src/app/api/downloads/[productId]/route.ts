import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

// GET /api/downloads/[productId] - Get download link
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has an approved order for this product
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .eq("order_status", "approved")
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "No approved order found" },
        { status: 403 }
      );
    }

    // Check/create download record
    const { data: existingDownload } = await supabase
      .from("downloads")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (existingDownload) {
      // Check expiry
      if (new Date(existingDownload.expires_at) < new Date()) {
        return NextResponse.json(
          { error: "Download link expired" },
          { status: 410 }
        );
      }

      // Increment download count
      await supabase
        .from("downloads")
        .update({ download_count: existingDownload.download_count + 1 })
        .eq("id", existingDownload.id);
    } else {
      // Create new download record (expires in 7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await supabase.from("downloads").insert({
        user_id: user.id,
        product_id: productId,
        download_count: 1,
        expires_at: expiresAt.toISOString(),
      });
    }

    // Get product zip file URL
    const { data: product } = await supabase
      .from("products")
      .select("zip_file, title")
      .eq("id", productId)
      .single();

    if (!product?.zip_file) {
      return NextResponse.json(
        { error: "No file available for download" },
        { status: 404 }
      );
    }

    // Generate a signed URL (valid for 1 hour)
    const { data: signedUrl } = await supabase.storage
      .from("products")
      .createSignedUrl(product.zip_file, 3600);

    return NextResponse.json({
      url: signedUrl?.signedUrl,
      filename: `${product.title}.zip`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
