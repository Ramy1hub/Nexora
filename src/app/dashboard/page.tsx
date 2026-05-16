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
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Package,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  created_at: string;
  order_status: string;
  products: {
    title: string;
    price: number;
  };
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const supabase = createClient();

  const [stats, setStats] = useState({
    purchases: 0,
    wishlist: 0,
    notifications: 0,
    downloads: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRealData = async () => {
      setLoading(true);

      try {
        // Fetch stats in parallel
        const [
          { count: purchases },
          { count: wishlist },
          { count: notifications },
          { count: downloads },
          { data: orders },
        ] = await Promise.all([
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("wishlist").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false),
          supabase.from("downloads").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase
            .from("orders")
            .select("id, created_at, order_status, products(title, price)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        setStats({
          purchases: purchases || 0,
          wishlist: wishlist || 0,
          notifications: notifications || 0,
          downloads: downloads || 0,
        });

        if (orders) {
          setRecentOrders(orders as unknown as Order[]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }

      setLoading(false);
    };

    fetchRealData();
  }, [user, supabase]);

  const quickLinks = [
    {
      icon: <ShoppingBag size={22} />,
      label: t("common.purchases"),
      href: "/purchases",
      color: "from-indigo-500 to-purple-500",
      count: stats.purchases,
    },
    {
      icon: <Heart size={22} />,
      label: t("common.wishlist"),
      href: "/wishlist",
      color: "from-pink-500 to-rose-500",
      count: stats.wishlist,
    },
    {
      icon: <Bell size={22} />,
      label: t("common.notifications"),
      href: "/notifications",
      color: "from-amber-500 to-orange-500",
      count: stats.notifications,
    },
    {
      icon: <Download size={22} />,
      label: "Downloads",
      href: "/purchases",
      color: "from-emerald-500 to-teal-500",
      count: stats.downloads,
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t("dashboard.welcome")}, {user.username} 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your purchases, downloads, and account settings
            </p>
          </div>

          {/* If Admin, show Admin Panel button directly in User Dashboard */}
          {user.role === "admin" && (
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
            >
              <Package size={18} />
              إدارة المنتجات (إضافة/تعديل/حذف)
            </Link>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Admin Quick Tools (only visible to Admins) */}
            {user.role === "admin" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 rounded-2xl border border-amber-500/20 bg-amber-50 dark:bg-amber-950/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="text-amber-500" size={20} />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    لوحة تحكم الإدارة السريعة
                  </h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Link
                    href="/admin/products"
                    className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-amber-500 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">المنتجات</p>
                      <p className="text-xs text-gray-500">إضافة، تعديل وحذف</p>
                    </div>
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-amber-500 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">الطلبات</p>
                      <p className="text-xs text-gray-500">متابعة طلبات الشراء</p>
                    </div>
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-amber-500 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Settings size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">لوحة الإدارة الكاملة</p>
                      <p className="text-xs text-gray-500">الدخول للإحصائيات</p>
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}

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
                          ...{order.id.split("-")[0]}
                        </td>
                        <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-300">
                          {order.products?.title || "Unknown Product"}
                        </td>
                        <td className="py-3 pr-4 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-sm font-medium text-gray-800 dark:text-white">
                          ${order.products?.price || 0}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              order.order_status === "approved"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : order.order_status === "pending"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {order.order_status === "approved" ? (
                              <CheckCircle size={12} />
                            ) : order.order_status === "pending" ? (
                              <Clock size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {order.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          لا توجد طلبات سابقة
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
