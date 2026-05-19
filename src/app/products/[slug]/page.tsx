"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  ExternalLink,
  Check,
  ChevronLeft,
  Download,
  Play,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useAuthStore } from "@/store";

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
      if (data) {
        setProduct(data);
        const { data: related } = await supabase.from("products").select("*").eq("category", data.category).neq("id", data.id).limit(4);
        if (related) setRelatedProducts(related);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product not found
          </h1>
          <Link href="/products" className="text-primary hover:underline">
            {t("common.back")}
          </Link>
        </div>
      </div>
    );
  }

  const images = product.thumbnail?.split(',') || [];
  const mainImage = images[selectedImage] || product.thumbnail;

  const discount = product.old_price
    ? Math.round(
        ((product.old_price - product.price) / product.old_price) * 100
      )
    : 0;

  const handleBuy = () => {
    if (!user) {
      toast.error("Please sign in to purchase");
      router.push("/auth/login");
      return;
    }
    router.push(`/checkout/${product.slug}`);
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error("Please sign in first");
      return;
    }
    toast.success(t("common.addToWishlist"));
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 pt-4"
        >
          <Link href="/" className="hover:text-primary">
            {t("common.home")}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            {t("common.products")}
          </Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-white truncate">
            {product.title}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-card">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-bold">
                  -{discount}% {t("common.discount")}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      selectedImage === i
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Category */}
            <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {product.title}
            </h1>

            {/* Rating & Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="font-semibold text-gray-800 dark:text-white">
                  {product.rating}
                </span>
              </div>
              <span>•</span>
              <span>{product.sales} {t("common.sales")}</span>
              <span>•</span>
              <span>{(product.views / 1000).toFixed(1)}k {t("common.views")}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                ${product.price}
              </span>
              {product.old_price && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.old_price}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            {product.features && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                  {t("products.features")}
                </h3>
                <ul className="space-y-1.5">
                  {product.features.map((feature: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <Check size={14} className="text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleBuy}
                className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-base"
              >
                <ShoppingCart size={18} />
                {t("common.buyNow")} — ${product.price}
              </button>

              <div className="grid grid-cols-2 gap-3">
                {product.demo_url && (
                  <Link
                    href={`/preview/${product.slug}`}
                    className="btn-secondary flex items-center justify-center gap-2 py-3"
                  >
                    <ExternalLink size={16} />
                    {t("common.preview")}
                  </Link>
                )}
                <button
                  onClick={handleWishlist}
                  className="btn-secondary flex items-center justify-center gap-2 py-3"
                >
                  <Heart size={16} />
                  {t("common.addToWishlist")}
                </button>
              </div>
            </div>

            {/* Tags */}
            {product.tags && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 text-xs text-gray-500 dark:text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {t("products.relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
