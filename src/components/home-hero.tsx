"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ThreeBackground from "@/components/three-background";

const HomeHero: React.FC = () => {
    return (
        <section className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-ieee-dark">
            {/* Vibrant animated aurora glows behind the particle field */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute -top-1/4 left-1/5 h-[38rem] w-[38rem] rounded-full bg-blue-600/30 blur-[130px] animate-aurora" />
                <div className="absolute top-1/3 right-1/6 h-[34rem] w-[34rem] rounded-full bg-cyan-400/25 blur-[130px] animate-aurora-slow [animation-delay:-6s]" />
                <div className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-violet-600/25 blur-[130px] animate-aurora [animation-delay:-11s]" />
            </div>
            <ThreeBackground className="opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ieee-dark/20 to-ieee-dark/90 pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2.5 mb-6 text-blue-200/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        <span className="text-sm font-medium tracking-wide">
                            IEEE Student Branch · Pulchowk Campus, Lalitpur
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                        Advancing Technology
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
                            for Humanity
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        A student-run branch at IOE Pulchowk Campus, where
                        curious engineers come together to build projects, run
                        workshops, and learn by doing.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://www.ieee.org/membership/join/index.html"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto px-8 py-3.5 bg-ieee-blue text-white rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
                        >
                            Join IEEE
                        </a>
                        <Link
                            href="/events"
                            className="w-full sm:w-auto px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
                        >
                            Explore Events{" "}
                            <ChevronRight
                                size={18}
                                className="ml-2 group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeHero;
