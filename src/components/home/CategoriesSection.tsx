"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Globe,
  Layout,
  LayoutDashboard,
  FileCode,
  Code,
  Gamepad2,
  Palette,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { demoCategories } from "@/lib/demo-data";

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe size={28} />,
  Layout: <Layout size={28} />,
  LayoutDashboard: <LayoutDashboard size={28} />,
  FileCode: <FileCode size={28} />,
  Code: <Code size={28} />,
  Gamepad2: <Gamepad2 size={28} />,
  Palette: <Palette size={28} />,
  Wrench: <Wrench size={28} />,
};

const gradients = [
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-indigo-500",
  "from-red-500 to-pink-500",
];

export default function CategoriesSection() {
  const { t } = useTranslation();

  const catNames: Record<string, string> = {
    websites: t("categories.websites"),
    "landing-pages": t("categories.landingPages"),
    dashboards: t("categories.dashboards"),
    templates: t("categories.templates"),
    scripts: t("categories.scripts"),
    "html5-games": t("categories.html5Games"),
    "ui-kits": t("categories.uiKits"),
    "web-tools": t("categories.webTools"),
  };

  return (
    <section className="relative py-24 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t("categories.title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            {t("categories.subtitle")}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {demoCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group block p-6 rounded-2xl glass-card card-hover text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[i]} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {iconMap[cat.icon]}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm sm:text-base">
                  {catNames[cat.slug] || cat.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {cat.count} {t("common.products").toLowerCase()}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
