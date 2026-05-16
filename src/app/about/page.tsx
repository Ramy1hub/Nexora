"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Users, Target, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Users size={24} />,
      title: "Community Driven",
      desc: "We build for creators, by creators. Our platform connects talented developers with buyers worldwide.",
    },
    {
      icon: <Target size={24} />,
      title: "High Quality Standard",
      desc: "Every product goes through a rigorous review process to ensure top-notch code quality and design.",
    },
    {
      icon: <Shield size={24} />,
      title: "Secure Transactions",
      desc: "Your payments and downloads are secured with industry-leading encryption and protection.",
    },
    {
      icon: <Zap size={24} />,
      title: "Instant Delivery",
      desc: "Get immediate access to your digital assets right after purchase, no waiting required.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Empowering Creators & Developers
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Nexora is a premium digital marketplace designed to help developers, designers, and creators sell their best work and find the perfect assets for their next big project.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 md:p-12 mb-16"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Founded with a simple mission: to create a space where quality digital products can shine. We noticed that many marketplaces were either too cluttered with low-quality items or took too much commission from creators.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Nexora changes that. We offer a curated experience for buyers and a fair, supportive platform for sellers. Whether you're looking for a dashboard template, a UI kit, or a landing page, you'll find the best here.
              </p>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden gradient-primary">
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
                <div className="text-white text-center">
                  <div className="text-5xl font-bold mb-2">10k+</div>
                  <div className="text-lg font-medium opacity-90">Active Users</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center card-hover"
            >
              <div className="w-14 h-14 mx-auto rounded-xl gradient-primary flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
