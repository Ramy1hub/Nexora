import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PATCH /api/admin/users/[userId] - Update user role or status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createServerSupabaseClient();

    // Verify the requester is an admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: requester } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!requester || requester.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { role, status } = body;

    const updateData: Record<string, string> = {};

    if (role && (role === "admin" || role === "user")) {
      updateData.role = role;
    }

    if (status && (status === "active" || status === "banned")) {
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Prevent admin from demoting themselves
    if (userId === user.id && role === "user") {
      return NextResponse.json(
        { error: "Cannot remove your own admin role" },
        { status: 400 }
      );
    }

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select("id, username, email, role")
      .single();

    if (error) throw error;

    // Create notification for the user
    const action = role
      ? role === "admin"
        ? "promoted to Admin"
        : "changed to User"
      : status === "banned"
      ? "banned"
      : "unbanned";

    await supabase.from("notifications").insert({
      user_id: userId,
      title: "Account Update",
      message: `Your account has been ${action} by an administrator.`,
      type: "system",
      is_read: false,
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[userId] - Delete a user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: requester } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!requester || requester.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prevent self-deletion
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
