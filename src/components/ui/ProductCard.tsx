"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Heart, Eye, ShoppingCart, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useTranslation();
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="glass-card rounded-2xl overflow-hidden card-hover">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.thumbnail ? product.thumbnail.split(',')[0] : '/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-bold shadow-lg">
              -{discount}% {t("common.discount")}
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300">
            {product.category}
          </div>

          {/* Hover Actions */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-800 hover:bg-white transition-colors"
            >
              <Eye size={14} />
              {t("common.preview")}
            </Link>
            <button className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white transition-all">
              <Heart size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-800 dark:text-white truncate hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Rating & Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="font-medium">{product.rating}</span>
              <span>• {product.sales} {t("common.sales")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={13} />
              <span>{(product.views / 1000).toFixed(1)}k</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                ${product.price}
              </span>
              {product.old_price && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.old_price}
                </span>
              )}
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all duration-300"
            >
              <ShoppingCart size={13} />
              {t("common.buyNow")}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
