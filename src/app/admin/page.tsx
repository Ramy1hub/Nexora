"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Revenue",
    value: "$12,456",
    change: "+12.5%",
    up: true,
    icon: <DollarSign size={22} />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Total Orders",
    value: "284",
    change: "+8.2%",
    up: true,
    icon: <ShoppingBag size={22} />,
    color: "from-indigo-500 to-purple-500",
  },
  {
    label: "Total Users",
    value: "1,847",
    change: "+23.1%",
    up: true,
    icon: <Users size={22} />,
    color: "from-pink-500 to-rose-500",
  },
  {
    label: "Total Products",
    value: "56",
    change: "+4",
    up: true,
    icon: <Package size={22} />,
    color: "from-amber-500 to-orange-500",
  },
];

const recentOrders = [
  { id: "ORD-284", user: "Sarah Chen", product: "Quantum Dashboard Pro", amount: 49, status: "pending", date: "2 min ago" },
  { id: "ORD-283", user: "Ahmed Hassan", product: "Nova Landing Kit", amount: 39, status: "approved", date: "1 hour ago" },
  { id: "ORD-282", user: "Emily R.", product: "E-Commerce Pro", amount: 89, status: "approved", date: "3 hours ago" },
  { id: "ORD-281", user: "James Liu", product: "Starter UI Kit", amount: 69, status: "pending", date: "5 hours ago" },
  { id: "ORD-280", user: "Maria G.", product: "AutoBot Scripts", amount: 35, status: "rejected", date: "1 day ago" },
];

const topProducts = [
  { name: "E-Commerce Pro Template", sales: 1567, revenue: "$139,463" },
  { name: "Quantum Dashboard Pro", sales: 1247, revenue: "$61,103" },
  { name: "Nova Landing Page Kit", sales: 892, revenue: "$34,788" },
  { name: "Starter UI Kit", sales: 723, revenue: "$49,887" },
];

export default function AdminOverview() {
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
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                  stat.up ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {stat.up ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {stat.change}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
                  <th className="pb-3 pr-3">Order</th>
                  <th className="pb-3 pr-3">Customer</th>
                  <th className="pb-3 pr-3">Product</th>
                  <th className="pb-3 pr-3">Amount</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 pr-3 text-sm font-medium text-gray-800 dark:text-white">
                      {order.id}
                    </td>
                    <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-300">
                      {order.user}
                    </td>
                    <td className="py-3 pr-3 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
                      {order.product}
                    </td>
                    <td className="py-3 pr-3 text-sm font-medium text-gray-800 dark:text-white">
                      ${order.amount}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : order.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Top Selling Products
          </h2>
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
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.sales} sales
                  </p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {product.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
