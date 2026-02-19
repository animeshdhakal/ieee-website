"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEAM_DATA } from "@/constants";
import MemberCard from "@/components/member-card";
import { ChevronDown } from "lucide-react";

const Team: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState("2026");
    const years = Object.keys(TEAM_DATA).sort((a, b) => b.localeCompare(a));
    const currentData = TEAM_DATA[selectedYear];

    return (
        <div className="pt-24 pb-20 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        Our Team
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10"
                    >
                        The dedicated individuals working behind the scenes to
                        drive innovation and foster a community of excellence.
                    </motion.p>

                    {/* Year Selector */}
                    <div className="relative inline-block text-left">
                        <div className="flex items-center justify-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                        selectedYear === year
                                            ? "bg-ieee-blue text-white shadow-md"
                                            : "text-gray-500 hover:text-ieee-blue hover:bg-white"
                                    }`}
                                >
                                    Committee {year}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedYear}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Executive Committee Section (Officers) */}
                        <section className="mb-24">
                            <div className="flex items-center mb-10">
                                <h2 className="text-2xl font-bold text-ieee-dark pr-4 bg-white z-10">
                                    Executive Officers
                                </h2>
                                <div className="h-px bg-gray-200 flex-grow"></div>
                            </div>

                            {/* Chair & Vice Chair Highlight */}
                            <div className="flex justify-center mb-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full md:w-2/3 lg:w-1/2">
                                    {currentData.officers
                                        .slice(0, 2)
                                        .map((member, idx) => (
                                            <motion.div
                                                key={member.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="h-full"
                                            >
                                                <MemberCard member={member} />
                                            </motion.div>
                                        ))}
                                </div>
                            </div>

                            {/* Rest of Officers */}
                            <div className="flex flex-wrap justify-center gap-6">
                                {currentData.officers
                                    .slice(2)
                                    .map((member, idx) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                delay: 0.2 + idx * 0.1,
                                            }}
                                            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                                        >
                                            <MemberCard member={member} />
                                        </motion.div>
                                    ))}
                            </div>
                        </section>

                        {/* Senior Executive Members */}
                        {currentData.seniorExecs.length > 0 && (
                            <section className="mb-24">
                                <div className="flex items-center mb-10">
                                    <h2 className="text-2xl font-bold text-ieee-dark pr-4 bg-white z-10">
                                        Senior Executives
                                    </h2>
                                    <div className="h-px bg-gray-200 flex-grow"></div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-6">
                                    {currentData.seniorExecs.map(
                                        (member, idx) => (
                                            <motion.div
                                                key={member.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                                            >
                                                <MemberCard member={member} />
                                            </motion.div>
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Committees */}
                        {currentData.committees.map((committee, cIdx) => (
                            <section key={cIdx} className="mb-20 last:mb-0">
                                <div className="flex items-center mb-8">
                                    <h2 className="text-2xl font-bold text-ieee-dark pr-4 bg-white z-10">
                                        {committee.title}
                                    </h2>
                                    <div className="h-px bg-gray-200 flex-grow"></div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-6">
                                    {committee.members.map((member, mIdx) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            viewport={{
                                                once: true,
                                                margin: "-50px",
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                delay: mIdx * 0.05,
                                            }}
                                            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-20px)]"
                                        >
                                            <MemberCard member={member} />
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Team;
