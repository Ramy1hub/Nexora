"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { demoProducts } from "@/lib/demo-data";

interface ProductsSectionProps {
  variant: "featured" | "latest" | "trending";
}

export default function ProductsSection({ variant }: ProductsSectionProps) {
  const { t } = useTranslation();

  const config = {
    featured: {
      title: t("products.featured"),
      subtitle: t("products.featuredSub"),
      products: demoProducts.sort((a, b) => b.rating - a.rating).slice(0, 4),
    },
    latest: {
      title: t("products.latest"),
      subtitle: t("products.latestSub"),
      products: demoProducts
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 4),
    },
    trending: {
      title: t("products.trending"),
      subtitle: t("products.trendingSub"),
      products: demoProducts.sort((a, b) => b.sales - a.sales).slice(0, 4),
    },
  };

  const { title, subtitle, products } = config[variant];

  return (
    <section className="py-24 bg-gray-50/50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
          >
            {t("common.viewAll")}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
