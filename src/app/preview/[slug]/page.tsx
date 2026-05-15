"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { X, ShoppingCart, ExternalLink } from "lucide-react";
import { demoProducts } from "@/lib/demo-data";

export default function PreviewPage() {
  const { slug } = useParams();
  const router = useRouter();
  const product = demoProducts.find((p) => p.slug === slug);

  if (!product || !product.demo_url) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Preview Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-sm font-bold text-white hidden sm:block">
              Nexora
            </span>
          </Link>
          <div className="h-5 w-px bg-gray-700" />
          <h1 className="text-sm font-medium text-gray-300 truncate max-w-xs">
            {product.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <ShoppingCart size={14} />
            Buy Now — ${product.price}
          </Link>
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* iframe */}
      <div className="flex-1 relative">
        <iframe
          src={product.demo_url}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title={product.title}
        />

        {/* Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none select-none"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 100px,
              rgba(99,102,241,0.03) 100px,
              rgba(99,102,241,0.03) 200px
            )`,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-white/[0.03] rotate-[-30deg] whitespace-nowrap select-none">
            NEXORA PREVIEW
          </div>
        </div>
      </div>
    </div>
  );
}
