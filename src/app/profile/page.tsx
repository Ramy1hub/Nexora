"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { User, Mail, Camera, Save } from "lucide-react";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [email] = useState(user?.email || "");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t("common.profile")}</h1>
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                  {username.charAt(0).toUpperCase() || "U"}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                  <Camera size={14}/>
                </button>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{username}</h2>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("auth.username")}</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input value={username} onChange={e => setUsername(e.target.value)} className="input-field pl-10"/>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("auth.email")}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input value={email} disabled className="input-field pl-10 opacity-60"/>
              </div>
            </div>
            <button onClick={() => toast.success("Profile updated!")} className="btn-primary flex items-center gap-2">
              <Save size={16}/>{t("common.save")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
