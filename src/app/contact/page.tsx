"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(t("contact.sent"));
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950"/>
      <div className="floating-orb w-72 h-72 bg-primary/20 -top-10 -right-10"/>
      <div className="relative mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("contact.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t("contact.subtitle")}</p>
        </motion.div>
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("contact.name")}</label>
            <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required className="input-field pl-10"/></div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("contact.email")}</label>
            <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required className="input-field pl-10"/></div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("contact.message")}</label>
            <textarea value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} required rows={5} className="input-field resize-none"/>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Send size={16}/>{t("contact.send")}</>}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
