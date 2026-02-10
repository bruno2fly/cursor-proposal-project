"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ServiceDetail as ServiceDetailType } from "@/lib/types";

interface ServiceDetailProps {
  icon: string;
  title: string;
  summary: string;
  color: string;
  details: ServiceDetailType[];
  visible: boolean;
}

export default function ServiceDetail({
  icon,
  title,
  summary,
  color,
  details,
  visible,
}: ServiceDetailProps) {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="overflow-hidden"
        >
          <div className="mt-8 p-8 rounded-2xl border border-dark-border bg-dark-card/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">{icon}</div>
              <div>
                <h3 className="font-clash text-2xl font-bold">{title}</h3>
                <p className="text-sm sm:text-base text-[#d4d4d8] mt-1 leading-relaxed">{summary}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {details.map((detail, i) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-dark-bg/50"
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{detail.label}</div>
                    <div className="text-sm sm:text-base text-[#d4d4d8] mt-0.5 leading-relaxed">
                      {detail.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
