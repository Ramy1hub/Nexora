"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t("newsletter.success"));
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary opacity-5" />
      <div className="floating-orb w-64 h-64 bg-primary/20 top-0 right-0" />
      <div
        className="floating-orb w-48 h-48 bg-secondary/15 bottom-0 left-0"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary">
            <Sparkles size={28} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {t("newsletter.title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {t("newsletter.subtitle")}
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              required
              className="input-field flex-1"
            />
            <button
              type="submit"
              className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Send size={16} />
              {t("newsletter.subscribe")}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
