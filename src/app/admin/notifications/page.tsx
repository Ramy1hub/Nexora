"use client";

import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const initial = [
  { id: "1", title: "New Order", message: "Sarah Chen ordered Quantum Dashboard Pro", type: "order", is_read: false, time: "2 min ago" },
  { id: "2", title: "New Review", message: "Ahmed rated Nova Landing Kit 5 stars", type: "review", is_read: false, time: "1 hour ago" },
  { id: "3", title: "Download", message: "Emily downloaded E-Commerce Pro", type: "download", is_read: true, time: "3 hours ago" },
  { id: "4", title: "New Order", message: "James Liu ordered Starter UI Kit", type: "order", is_read: true, time: "5 hours ago" },
];

export default function AdminNotificationsPage() {
  const [items, setItems] = useState(initial);
  const colors: Record<string, string> = {
    order: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    review: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    download: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <button onClick={() => { setItems(p => p.map(n => ({...n, is_read: true}))); toast.success("Done"); }} className="btn-secondary text-sm">Mark all read</button>
      </div>
      <div className="space-y-3">
        {items.map(n => (
          <div key={n.id} className={`glass-card rounded-xl p-4 flex items-start gap-4 ${!n.is_read ? "border-l-4 border-l-primary" : "opacity-70"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[n.type] || "bg-gray-100"}`}><Bell size={18} /></div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{n.title}</h3>
              <p className="text-sm text-gray-500">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
            <div className="flex gap-1">
              {!n.is_read && <button onClick={() => setItems(p => p.map(x => x.id===n.id?{...x,is_read:true}:x))} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"><Check size={14}/></button>}
              <button onClick={() => setItems(p => p.filter(x => x.id!==n.id))} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
