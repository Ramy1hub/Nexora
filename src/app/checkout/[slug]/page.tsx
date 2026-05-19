"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  CreditCard,
  Shield,
  Check,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalRendered = useRef(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) setProduct(data);
      setPageLoading(false);
    };
    fetchProduct();
  }, [slug]);

  // Load PayPal SDK
  useEffect(() => {
    if (!product || paypalLoaded) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "AfvStj7htrBrs6ysQLRp8gpgXvnEFLePEmMXTzu5lErDe9mdFJbeyTiv2uHiXcC7bi1RyOuTwyLo4-nt";

    // Check if already loaded
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => toast.error("Failed to load PayPal. Please refresh.");
    document.body.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid re-loading issues
    };
  }, [product, paypalLoaded]);

  // Render PayPal buttons
  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !paypalContainerRef.current || !product || paypalRendered.current) return;

    paypalRendered.current = true;

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay",
          height: 45,
        },
        createOrder: async () => {
          try {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: product.price,
                productTitle: product.title,
                productId: product.id,
              }),
            });
            const data = await res.json();
            if (data.id) return data.id;
            throw new Error(data.error || "Failed to create order");
          } catch (err: any) {
            toast.error(err.message);
            throw err;
          }
        },
        onApprove: async (data: any) => {
          setProcessing(true);
          try {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderID,
                userId: user?.id,
                productId: product.id,
                productTitle: product.title,
                username: user?.username,
              }),
            });
            const result = await res.json();

            if (result.success) {
              toast.success("🎉 Payment successful! Redirecting to downloads...");
              setTimeout(() => router.push("/purchases"), 1500);
            } else {
              toast.error(result.error || "Payment failed");
            }
          } catch (err: any) {
            toast.error("Error processing payment. Please contact support.");
            console.error(err);
          }
          setProcessing(false);
        },
        onCancel: () => {
          toast("Payment cancelled", { icon: "⚠️" });
        },
        onError: (err: any) => {
          console.error("PayPal error:", err);
          toast.error("PayPal encountered an error. Please try again.");
        },
      })
      .render(paypalContainerRef.current);
  }, [paypalLoaded, product, user, router]);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p>Product not found</p>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

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
            {/* Payment Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {t("payment.selectMethod")}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Complete your purchase securely via PayPal
                </p>

                {/* Processing Overlay */}
                {processing && (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <Loader2 size={32} className="text-primary animate-spin" />
                    <p className="text-sm text-gray-500">Processing your payment...</p>
                  </div>
                )}

                {/* PayPal Buttons Container */}
                {!processing && (
                  <div className="space-y-4">
                    {!paypalLoaded ? (
                      <div className="flex items-center justify-center py-8 gap-3">
                        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-sm text-gray-500">Loading PayPal...</span>
                      </div>
                    ) : (
                      <div ref={paypalContainerRef} id="paypal-button-container" />
                    )}
                  </div>
                )}
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <Shield size={20} className="text-green-500 shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your payment is secured with 256-bit SSL encryption via PayPal
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
                    src={product.thumbnail ? product.thumbnail.split(",")[0].trim() : "/placeholder.png"}
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

              <div className="mt-6 space-y-1.5">
                {[
                  "Instant download after payment",
                  "Secure PayPal checkout",
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
