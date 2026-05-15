"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, X, Eye, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const demoOrders = [
  { id: "ORD-284", user: "Sarah Chen", email: "sarah@example.com", product: "Quantum Dashboard Pro", amount: 49, method: "PayPal", paymentStatus: "paid", orderStatus: "pending", date: "2026-05-15" },
  { id: "ORD-283", user: "Ahmed Hassan", email: "ahmed@example.com", product: "Nova Landing Kit", amount: 39, method: "Vodafone Cash", paymentStatus: "pending", orderStatus: "pending", date: "2026-05-14" },
  { id: "ORD-282", user: "Emily R.", email: "emily@example.com", product: "E-Commerce Pro", amount: 89, method: "PayPal", paymentStatus: "paid", orderStatus: "approved", date: "2026-05-14" },
  { id: "ORD-281", user: "James Liu", email: "james@example.com", product: "Starter UI Kit", amount: 69, method: "PayPal", paymentStatus: "paid", orderStatus: "approved", date: "2026-05-13" },
  { id: "ORD-280", user: "Maria G.", email: "maria@example.com", product: "AutoBot Scripts", amount: 35, method: "Vodafone Cash", paymentStatus: "failed", orderStatus: "rejected", date: "2026-05-12" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(demoOrders);
  const [search, setSearch] = useState("");

  const handleApprove = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, orderStatus: "approved" } : o
      )
    );
    toast.success(`Order ${orderId} approved`);
  };

  const handleReject = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, orderStatus: "rejected" } : o
      )
    );
    toast.success(`Order ${orderId} rejected`);
  };

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Orders Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {orders.length} orders total •{" "}
          {orders.filter((o) => o.orderStatus === "pending").length} pending
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
          className="input-field pl-9"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-slate-800/50">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                    {order.id}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-800 dark:text-white">
                      {order.user}
                    </p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
                    {order.product}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                    ${order.amount}
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-xs text-gray-500">{order.method}</p>
                      <span
                        className={`text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "text-green-500"
                            : order.paymentStatus === "pending"
                            ? "text-amber-500"
                            : "text-red-500"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === "approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : order.orderStatus === "pending"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-5 py-4">
                    {order.orderStatus === "pending" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-green-500 transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
