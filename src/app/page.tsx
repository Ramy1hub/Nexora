"use client";

import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ProductsSection from "@/components/home/ProductsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection variant="featured" />
      <ProductsSection variant="latest" />
      <ProductsSection variant="trending" />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
    </>
  );
}
