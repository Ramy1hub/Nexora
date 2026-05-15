"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Bell, Check } from "lucide-react";
import { useState } from "react";

const initial = [
  { id: "1", title: "Order Approved", message: "Your order for Quantum Dashboard Pro has been approved! You can now download it.", type: "order", is_read: false, time: "2 min ago" },
  { id: "2", title: "Welcome to Nexora", message: "Thank you for joining Nexora! Explore our premium products.", type: "system", is_read: true, time: "1 day ago" },
];

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState(initial);
  const colors: Record<string, string> = {
    order: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    system: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400",
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t("common.notifications")}</h1>
        </motion.div>
        <div className="space-y-3">
          {items.map(n => (
            <div key={n.id} className={`glass-card rounded-xl p-4 flex items-start gap-4 ${!n.is_read ? "border-l-4 border-l-primary" : "opacity-70"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[n.type] || "bg-gray-100"}`}><Bell size={18}/></div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{n.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              {!n.is_read && <button onClick={() => setItems(p => p.map(x => x.id===n.id?{...x,is_read:true}:x))} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"><Check size={14}/></button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
