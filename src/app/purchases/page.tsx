"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { Download, Clock, CheckCircle, XCircle } from "lucide-react";
import { demoProducts } from "@/lib/demo-data";

const purchases = [
  { id: "1", product: demoProducts[0], status: "approved", date: "2026-05-14", downloadCount: 2 },
  { id: "2", product: demoProducts[1], status: "pending", date: "2026-05-12", downloadCount: 0 },
  { id: "3", product: demoProducts[3], status: "approved", date: "2026-05-10", downloadCount: 1 },
];

export default function PurchasesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t("common.purchases")}</h1>
        </motion.div>

        <div className="space-y-4">
          {purchases.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden shrink-0">
                <Image src={p.product.thumbnail} alt={p.product.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${p.product.slug}`} className="text-sm font-semibold text-gray-800 dark:text-white hover:text-primary transition-colors">
                  {p.product.title}
                </Link>
                <p className="text-xs text-gray-500 mt-1">Purchased on {p.date}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                    {p.status === "approved" ? <CheckCircle size={11}/> : <Clock size={11}/>} {p.status}
                  </span>
                  <span className="text-xs text-gray-500">${p.product.price}</span>
                </div>
              </div>
              {p.status === "approved" ? (
                <button className="btn-primary text-sm flex items-center gap-1.5 self-center whitespace-nowrap">
                  <Download size={14}/>{t("common.download")}
                </button>
              ) : (
                <span className="self-center text-xs text-amber-500 font-medium">{t("payment.orderPending")}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
