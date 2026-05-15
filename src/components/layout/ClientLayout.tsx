"use client";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isPreview = pathname?.startsWith("/preview");

  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "var(--color-surface-card-dark)",
                color: "var(--color-text-primary-dark)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "14px",
              },
            }}
          />
          {!isAdmin && !isPreview && <Navbar />}
          <main className={!isAdmin && !isPreview ? "min-h-screen" : ""}>
            {children}
          </main>
          {!isAdmin && !isPreview && <Footer />}
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
