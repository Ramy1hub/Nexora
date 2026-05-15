"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Try to get user profile from DB
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        setUser({
          id: user.id,
          email: user.email || "",
          username:
            profile?.username ||
            user.user_metadata?.username ||
            user.email?.split("@")[0] ||
            "User",
          role: profile?.role || "user",
          avatar: profile?.avatar || user.user_metadata?.avatar_url || null,
        });
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        setUser({
          id: user.id,
          email: user.email || "",
          username:
            profile?.username ||
            user.user_metadata?.username ||
            user.email?.split("@")[0] ||
            "User",
          role: profile?.role || "user",
          avatar: profile?.avatar || user.user_metadata?.avatar_url || null,
        });
      } else if (event === "SIGNED_OUT") {
        clearUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, clearUser]);

  return <>{children}</>;
}
