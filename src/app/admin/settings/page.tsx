"use client";
import { useState } from "react";
import { Save, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Nexora", siteDesc: "Premium Digital Marketplace", seoTitle: "Nexora — Premium Digital Marketplace",
    paypalId: "", twitter: "", github: "", linkedin: "",
  });

  const handleSave = () => toast.success("Settings saved!");

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Website Settings</h1>

      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">General</h2>
        {[
          { label: "Site Name", key: "siteName" },
          { label: "Site Description", key: "siteDesc" },
          { label: "SEO Title", key: "seoTitle" },
        ].map(f => (
          <div key={f.key} className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</label>
            <input value={(settings as any)[f.key]} onChange={e => setSettings(p => ({...p, [f.key]: e.target.value}))} className="input-field" />
          </div>
        ))}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo</label>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-2xl">N</div>
            <button className="btn-secondary text-sm flex items-center gap-1.5"><Upload size={14}/>Upload Logo</button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Payment Settings</h2>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">PayPal Client ID</label>
          <input value={settings.paypalId} onChange={e => setSettings(p => ({...p, paypalId: e.target.value}))} className="input-field" placeholder="Enter PayPal Client ID" />
        </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Social Links</h2>
        {[{ l: "Twitter", k: "twitter" }, { l: "GitHub", k: "github" }, { l: "LinkedIn", k: "linkedin" }].map(f => (
          <div key={f.k} className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.l}</label>
            <input value={(settings as any)[f.k]} onChange={e => setSettings(p => ({...p, [f.k]: e.target.value}))} className="input-field" placeholder={`https://${f.l.toLowerCase()}.com/...`} />
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Save size={16}/>Save Settings</button>
    </div>
  );
}
