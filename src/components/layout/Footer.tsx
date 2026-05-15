"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Heart,
  MessageCircle,
  Code2,
  Briefcase,
  Mail,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      {/* Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px gradient-primary opacity-40" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold gradient-text">Nexora</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <MessageCircle size={16} />, href: "#" },
                { icon: <Code2 size={16} />, href: "#" },
                { icon: <Briefcase size={16} />, href: "#" },
                { icon: <Mail size={16} />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3">
              {[
                { name: t("common.home"), href: "/" },
                { name: t("common.products"), href: "/products" },
                { name: t("common.categories"), href: "/products" },
                { name: t("common.about"), href: "/about" },
              ].map((link) => (
                <li key={link.href + link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
              {t("footer.support")}
            </h4>
            <ul className="space-y-3">
              {[
                { name: t("footer.helpCenter"), href: "/help" },
                { name: t("footer.contactUs"), href: "/contact" },
                { name: t("footer.reportIssue"), href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-3">
              {[
                { name: t("common.privacy"), href: "/privacy" },
                { name: t("common.terms"), href: "/terms" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {year} Nexora. {t("footer.copyright")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {t("footer.madeWith")}
            <Heart size={14} className="text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
