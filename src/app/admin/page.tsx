"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface RecentOrder {
  id: string;
  created_at: string;
  order_status: string;
  payment_method: string;
  products: {
    title: string;
    price: number;
  } | null;
  user_id: string;
}

interface TopProduct {
  title: string;
  sales: number;
  price: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch counts and data in parallel
      const [ordersRes, productsRes, recentRes, allOrdersRes] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("id, created_at, order_status, payment_method, user_id, products(title, price)")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("orders")
          .select("order_status, products(title, price)")
          .eq("order_status", "approved"),
      ]);

      const totalOrders = ordersRes.count || 0;
      const totalProducts = productsRes.count || 0;

      // Calculate revenue from approved orders
      let totalRevenue = 0;
      const productSalesMap: Record<string, { title: string; sales: number; price: number }> = {};

      if (allOrdersRes.data) {
        for (const order of allOrdersRes.data as any[]) {
          const product = order.products;
          if (product) {
            totalRevenue += product.price || 0;
            const title = product.title || "Unknown";
            if (!productSalesMap[title]) {
              productSalesMap[title] = { title, sales: 0, price: product.price || 0 };
            }
            productSalesMap[title].sales += 1;
          }
        }
      }

      // Sort top products by sales count
      const sortedProducts = Object.values(productSalesMap)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      setTopProducts(sortedProducts);

      setStats([
        {
          label: "Total Revenue",
          value: `$${totalRevenue.toLocaleString()}`,
          icon: <DollarSign size={22} />,
          color: "from-emerald-500 to-teal-500",
        },
        {
          label: "Total Orders",
          value: totalOrders.toLocaleString(),
          icon: <ShoppingBag size={22} />,
          color: "from-indigo-500 to-purple-500",
        },
        {
          label: "Approved Orders",
          value: (allOrdersRes.data?.length || 0).toLocaleString(),
          icon: <Users size={22} />,
          color: "from-pink-500 to-rose-500",
        },
        {
          label: "Total Products",
          value: totalProducts.toLocaleString(),
          icon: <Package size={22} />,
          color: "from-amber-500 to-orange-500",
        },
      ]);

      setRecentOrders((recentRes.data as unknown as RecentOrder[]) || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, Admin. Here&apos;s your marketplace summary.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}
              >
                {stat.icon}
              </div>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-500">
                <ArrowUpRight size={14} />
                Live
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-3 glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Recent Orders
          </h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
                    <th className="pb-3 pr-3">Order</th>
                    <th className="pb-3 pr-3">Product</th>
                    <th className="pb-3 pr-3">Amount</th>
                    <th className="pb-3 pr-3">Method</th>
                    <th className="pb-3 pr-3">Status</th>
                    <th className="pb-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 pr-3 text-sm font-medium text-gray-800 dark:text-white">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
                        {order.products?.title || "—"}
                      </td>
                      <td className="py-3 pr-3 text-sm font-medium text-gray-800 dark:text-white">
                        ${order.products?.price || 0}
                      </td>
                      <td className="py-3 pr-3 text-sm text-gray-500 capitalize">
                        {order.payment_method}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.order_status === "approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : order.order_status === "pending"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        {timeAgo(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Top Selling Products
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No sales data yet.</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.sales} sale{product.sales !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    ${(product.sales * product.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
