"use client";

import React from "react";
import { motion } from "framer-motion";
import { COMMITTEES, OFFICERS, SENIOR_EXECS } from "@/constants";
import MemberCard from "@/components/MemberCard";

const Team: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The dedicated individuals working behind the scenes to drive
            innovation and foster a community of excellence.
          </p>
        </div>

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
              {OFFICERS.slice(0, 2).map((member, idx) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFICERS.slice(2).map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="h-full"
              >
                <MemberCard member={member} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Senior Executive Members */}
        <section className="mb-24">
          <div className="flex items-center mb-10">
            <h2 className="text-2xl font-bold text-ieee-dark pr-4 bg-white z-10">
              Senior Executives
            </h2>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {SENIOR_EXECS.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-full"
              >
                <MemberCard member={member} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Committees */}
        {COMMITTEES.map((committee, cIdx) => (
          <section key={cIdx} className="mb-20 last:mb-0">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-ieee-dark pr-4 bg-white z-10">
                {committee.title}
              </h2>
              <div className="h-px bg-gray-200 flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {committee.members.map((member, mIdx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: mIdx * 0.05 }}
                  className="h-full"
                >
                  <MemberCard member={member} />
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Team;
