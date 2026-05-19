"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Heart, Loader2 } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { useWishlistStore } from "@/store";

export default function WishlistPage() {
  const { t } = useTranslation();
  const { wishlist, loading, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const wishlistProducts = wishlist.map((item: any) => item.products).filter(Boolean);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("common.wishlist")}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{wishlistProducts.length} items</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 size={32} className="text-primary animate-spin" />
          </div>
        ) : wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((p: any, i: number) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">Your wishlist is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
