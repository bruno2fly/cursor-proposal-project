"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import AnimatedNumber from "./AnimatedNumber";

interface StatsSectionProps {
  serviceCount: number;
}

const stats = [
  {
    value: 0,
    suffix: "",
    label: "Services Included",
    color: "#FF4D6A",
    useServiceCount: true,
  },
  { value: 360, suffix: "°", label: "Full Coverage", color: "#6C5CE7" },
  { value: 100, suffix: "%", label: "Transparency", color: "#00B894" },
  { value: 1, suffix: "", label: "Dedicated Team", color: "#0984E3" },
];

export default function StatsSection({ serviceCount }: StatsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 px-6">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border border-dark-border bg-dark-card/30"
            >
              <div
                className="font-clash text-4xl md:text-5xl font-bold mb-2"
                style={{ color: stat.color }}
              >
                <AnimatedNumber
                  value={stat.useServiceCount ? serviceCount : stat.value}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-sm sm:text-base text-[#d4d4d8] font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
