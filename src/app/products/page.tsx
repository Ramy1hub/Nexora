"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { demoCategories } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-16 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*");
      if (data) setAllProducts(data);
      setLoading(false);
    };
    fetchAllProducts();
  }, []);

  const filtered = useMemo(() => {
    let products = [...allProducts];

    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        products.sort((a, b) => b.sales - a.sales);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        products.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
    }

    return products;
  }, [search, selectedCategory, sortBy, allProducts]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("common.products")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filtered.length} {t("common.products").toLowerCase()} found
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("common.search")}
              className="input-field pl-10"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-full sm:w-44"
          >
            <option value="latest">{t("common.latest")}</option>
            <option value="popular">{t("common.popular")}</option>
            <option value="rating">{t("common.rating")}</option>
            <option value="price-low">{t("common.price")} ↑</option>
            <option value="price-high">{t("common.price")} ↓</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden btn-secondary flex items-center justify-center gap-2"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <div className={`${showFilters ? "block" : "hidden"} sm:block w-full sm:w-52 shrink-0 space-y-2`}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
              {t("common.categories")}
            </h3>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              {t("common.all")}
            </button>
            {demoCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">{t("common.noResults")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
