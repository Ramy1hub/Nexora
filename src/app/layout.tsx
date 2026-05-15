import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nexora — Premium Digital Marketplace",
    template: "%s | Nexora",
  },
  description:
    "Discover thousands of high-quality templates, scripts, dashboards, and digital assets for modern creators. Build stunning projects faster with Nexora.",
  keywords: [
    "marketplace",
    "templates",
    "scripts",
    "dashboard",
    "ui kit",
    "web tools",
    "html5 games",
    "landing pages",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexora.vercel.app",
    siteName: "Nexora",
    title: "Nexora — Premium Digital Marketplace",
    description:
      "Discover thousands of high-quality templates, scripts, dashboards, and digital assets for modern creators.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora — Premium Digital Marketplace",
    description:
      "Discover thousands of high-quality templates, scripts, dashboards, and digital assets for modern creators.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('nexora-theme');
                  var theme = 'dark';
                  if (stored) {
                    var parsed = JSON.parse(stored);
                    theme = (parsed.state && parsed.state.theme) || 'dark';
                  } else if (window.matchMedia) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
