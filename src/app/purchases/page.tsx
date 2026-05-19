"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { Download, Clock, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

interface OrderWithProduct {
  id: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  transaction_id: string | null;
  products: {
    id: string;
    title: string;
    slug: string;
    price: number;
    thumbnail: string;
    file_url: string | null;
    category: string;
  };
}

export default function PurchasesPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [purchases, setPurchases] = useState<OrderWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPurchases = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, order_status, payment_status, transaction_id, products(id, title, slug, price, thumbnail, file_url, category)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setPurchases(data as unknown as OrderWithProduct[]);
      }
      if (error) {
        console.error("Fetch purchases error:", error);
      }
      setLoading(false);
    };

    fetchPurchases();
  }, [user]);

  const handleDownload = (fileUrl: string, title: string) => {
    if (!fileUrl) {
      toast.error("Download file not available yet. Contact support.");
      return;
    }
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${title}.zip`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started!");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-gray-500">Please sign in to view your purchases.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t("common.purchases")}
          </h1>
        </motion.div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : purchases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No purchases yet
            </h2>
            <p className="text-gray-500 mb-6">
              Browse our products and make your first purchase!
            </p>
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {purchases.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={
                      p.products?.thumbnail
                        ? p.products.thumbnail.split(",")[0].trim()
                        : "/placeholder.png"
                    }
                    alt={p.products?.title || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${p.products?.slug}`}
                    className="text-sm font-semibold text-gray-800 dark:text-white hover:text-primary transition-colors"
                  >
                    {p.products?.title || "Unknown Product"}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">
                    Purchased on{" "}
                    {new Date(p.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.order_status === "approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : p.order_status === "pending"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {p.order_status === "approved" ? (
                        <CheckCircle size={11} />
                      ) : p.order_status === "pending" ? (
                        <Clock size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      {p.order_status}
                    </span>
                    <span className="text-xs text-gray-500">
                      ${p.products?.price || 0}
                    </span>
                    {p.transaction_id && (
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        TX: {p.transaction_id.slice(0, 12)}...
                      </span>
                    )}
                  </div>
                </div>

                {/* Download / Status */}
                {p.order_status === "approved" && p.products?.file_url ? (
                  <button
                    onClick={() =>
                      handleDownload(p.products.file_url!, p.products.title)
                    }
                    className="btn-primary text-sm flex items-center gap-1.5 self-center whitespace-nowrap"
                  >
                    <Download size={14} />
                    {t("common.download")}
                  </button>
                ) : p.order_status === "approved" && !p.products?.file_url ? (
                  <span className="self-center text-xs text-green-500 font-medium">
                    ✅ Paid — File coming soon
                  </span>
                ) : (
                  <span className="self-center text-xs text-amber-500 font-medium">
                    {t("payment.orderPending")}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
