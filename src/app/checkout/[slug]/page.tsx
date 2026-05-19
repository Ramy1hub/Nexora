"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  CreditCard,
  ArrowRight,
  Shield,
  Check,
} from "lucide-react";
import { demoProducts } from "@/lib/demo-data";
import { useAuthStore } from "@/store";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<"paypal">("paypal");
  const [loading, setLoading] = useState(false);

  const product = demoProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p>Product not found</p>
      </div>
    );
  }

  const handleOrder = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        product_id: product.id,
        payment_method: paymentMethod,
        payment_status: "pending",
        transaction_id: null,
        order_status: "pending",
      });

      if (error) throw error;

      // Create notification for admin
      await supabase.from("notifications").insert({
        title: "New Order",
        message: `${user.username} ordered ${product.title}`,
        type: "order",
        is_read: false,
      });

      toast.success(t("payment.orderPlaced"));
      router.push("/purchases");
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {t("payment.title")}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {t("payment.selectMethod")}
                </h2>

                <div className="space-y-3">
                  {/* PayPal */}
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "paypal"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-slate-700 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "paypal"
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "paypal" && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                    <CreditCard size={20} className="text-blue-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {t("payment.paypal")}
                      </p>
                      <p className="text-xs text-gray-500">
                        Secure payment via PayPal
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <Shield size={20} className="text-green-500" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your payment is secured with 256-bit SSL encryption
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="glass-card rounded-2xl p-6 h-fit">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="flex gap-3 mb-4">
                <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("common.price")}</span>
                  <span className="text-gray-800 dark:text-white">
                    ${product.price}
                  </span>
                </div>
                {product.old_price && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t("common.discount")}</span>
                    <span className="text-green-500">
                      -${product.old_price - product.price}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-slate-700">
                  <span className="text-gray-800 dark:text-white">Total</span>
                  <span className="text-primary">${product.price}</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full mt-6 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Place Order
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="mt-4 space-y-1.5">
                {[
                  "Instant access after approval",
                  "Secure download link",
                  "Lifetime updates",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-gray-500"
                  >
                    <Check size={12} className="text-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
