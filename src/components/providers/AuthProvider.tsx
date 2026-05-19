"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore, useWishlistStore } from "@/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser } = useAuthStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async (currentUser?: any) => {
      try {
        let authUser = currentUser;
        
        if (!authUser) {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error || !user) {
            clearUser();
            useWishlistStore.setState({ wishlist: [] });
            return;
          }
          authUser = user;
        }

        if (!authUser) return;

        // Fetch profile
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        setUser({
          id: authUser.id,
          email: authUser.email || "",
          username:
            profile?.username ||
            authUser.user_metadata?.username ||
            authUser.email?.split("@")[0] ||
            "User",
          role: profile?.role || "user",
          avatar: profile?.avatar || authUser.user_metadata?.avatar_url || null,
        });

        // Fetch wishlist items
        fetchWishlist();
      } catch (err) {
        console.error("Auth init error:", err);
      }
    };

    // Initial fetch
    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        clearUser();
        useWishlistStore.setState({ wishlist: [] });
      } else if (session?.user) {
        getUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, clearUser, fetchWishlist]);

  return <>{children}</>;
}
