"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Bell,
  Download,
  User,
  Settings,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "@/store";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const quickLinks = [
    {
      icon: <ShoppingBag size={22} />,
      label: t("common.purchases"),
      href: "/purchases",
      color: "from-indigo-500 to-purple-500",
      count: 3,
    },
    {
      icon: <Heart size={22} />,
      label: t("common.wishlist"),
      href: "/wishlist",
      color: "from-pink-500 to-rose-500",
      count: 5,
    },
    {
      icon: <Bell size={22} />,
      label: t("common.notifications"),
      href: "/notifications",
      color: "from-amber-500 to-orange-500",
      count: 2,
    },
    {
      icon: <Download size={22} />,
      label: "Downloads",
      href: "/purchases",
      color: "from-emerald-500 to-teal-500",
      count: 8,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      product: "Quantum Dashboard Pro",
      date: "2026-05-14",
      amount: 49,
      status: "approved",
    },
    {
      id: "ORD-002",
      product: "Nova Landing Page Kit",
      date: "2026-05-12",
      amount: 39,
      status: "pending",
    },
    {
      id: "ORD-003",
      product: "Starter UI Kit",
      date: "2026-05-10",
      amount: 69,
      status: "approved",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.welcome")}, {user?.username || "User"} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your purchases, downloads, and account settings
          </p>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {quickLinks.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={link.href}
                className="group block glass-card rounded-2xl p-5 card-hover"
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${link.color} text-white mb-3 group-hover:scale-110 transition-transform`}
                >
                  {link.icon}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {link.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {link.count}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("dashboard.recentOrders")}
            </h2>
            <Link
              href="/purchases"
              className="text-sm text-primary font-medium hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Product</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 pr-4 text-sm font-medium text-gray-800 dark:text-white">
                      {order.id}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-300">
                      {order.product}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="py-3 pr-4 text-sm font-medium text-gray-800 dark:text-white">
                      ${order.amount}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === "approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : order.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {order.status === "approved" ? (
                          <CheckCircle size={12} />
                        ) : order.status === "pending" ? (
                          <Clock size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
