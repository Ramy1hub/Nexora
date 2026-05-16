"use client";

import { motion } from "framer-motion";
import { LifeBuoy, FileText, MessageCircle, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  const faqs = [
    {
      q: "How do I download my purchased items?",
      a: "Once your payment is approved, you can download your items from the Downloads section in your Dashboard or directly from the product page.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We currently accept PayPal and Vodafone Cash for all transactions.",
    },
    {
      q: "Can I use the templates for commercial projects?",
      a: "Yes! All products purchased on Nexora come with a standard license that allows you to use them in both personal and commercial projects.",
    },
    {
      q: "How do I get a refund?",
      a: "Refunds are handled on a case-by-case basis. If a product is completely broken or not as described, please contact support within 14 days of purchase.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <LifeBuoy size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Find answers to common questions, read our guides, or get in touch with our support team.
          </p>
        </motion.div>

        {/* Quick Options */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-6 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Read the Docs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Check out our comprehensive documentation and guides for using the platform.
              </p>
              <Link href="/terms" className="text-primary text-sm font-medium hover:underline">
                View Terms & Conditions &rarr;
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-6 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Link href="/contact" className="text-primary text-sm font-medium hover:underline">
                Send a Message &rarr;
              </Link>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle size={24} className="text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
