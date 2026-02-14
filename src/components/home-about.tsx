"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Zap, Award } from "lucide-react";
import Link from "next/link";

const HomeAbout: React.FC = () => {
  return (
    <section className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
              Who We Are
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              IEEE Pulchowk Student Branch is a community of tech enthusiasts,
              researchers, and innovators. We strive to bridge the gap between
              academic learning and industry standards through workshops,
              seminars, and projects.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              As part of the world's largest technical professional
              organization, we provide our members access to cutting-edge
              information, networking opportunities, and career development
              resources.
            </p>
            <Link
              href="/team"
              className="text-ieee-blue font-semibold hover:underline inline-flex items-center"
            >
              Meet the Team <ArrowRight size={16} className="ml-2" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Users, label: "Active Members", value: "200+" },
              { icon: Zap, label: "Annual Events", value: "25+" },
              { icon: Award, label: "Awards Won", value: "15+" },
              { icon: Users, label: "Committees", value: "5" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center hover:border-ieee-blue/20 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-ieee-blue mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
