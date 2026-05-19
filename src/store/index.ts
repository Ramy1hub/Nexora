import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "nexora-theme" }
  )
);

interface AuthStore {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    avatar: string | null;
  } | null;
  setUser: (user: AuthStore["user"]) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

interface NotificationStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  increment: () => void;
  decrement: () => void;
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  increment: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrement: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
}));

interface WishlistStore {
  wishlist: any[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  wishlist: [],
  loading: false,
  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (data.wishlist) {
        set({ wishlist: data.wishlist });
      }
    } catch (err) {
      console.error("Fetch wishlist error:", err);
    } finally {
      set({ loading: false });
    }
  },
  toggleWishlist: async (productId: string) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await res.json();
      if (data.action === "added") {
        const getRes = await fetch("/api/wishlist");
        const getData = await getRes.json();
        if (getData.wishlist) set({ wishlist: getData.wishlist });
      } else if (data.action === "removed") {
        set({ wishlist: get().wishlist.filter((item) => item.product_id !== productId) });
      }
    } catch (err) {
      console.error("Toggle wishlist error:", err);
    }
  },
}));
