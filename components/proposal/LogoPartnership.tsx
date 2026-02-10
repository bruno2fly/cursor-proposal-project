"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LogoPartnershipProps {
  clientName: string;
  clientLogoUrl: string | null;
}

export default function LogoPartnership({
  clientName,
  clientLogoUrl,
}: LogoPartnershipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
      className="relative flex items-center justify-center gap-24 sm:gap-36 mb-10"
    >
      {/* 2FLY Agency Logo */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center gap-3 z-10"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-dark-card border border-dark-border shadow-lg shadow-accent-blue/10">
          <Image
            src="/2fly-logo.png"
            alt="2FLY Marketing Agency"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm sm:text-base text-[#d4d4d8] font-medium whitespace-nowrap">
          2FLY Agency
        </span>
      </motion.div>

      {/* Animated Arc Connection */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          width="380"
          height="100"
          viewBox="0 0 380 100"
          fill="none"
          className="absolute -top-8 sm:-top-12"
        >
          {/* Arc path */}
          <motion.path
            d="M 40 80 Q 190 -15 340 80"
            stroke="url(#arcGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />

          {/* Animated dot traveling along the arc */}
          <motion.circle
            r="3"
            fill="url(#dotGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.5,
              delay: 1.2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin="1.2s"
              path="M 40 80 Q 190 -15 340 80"
            />
          </motion.circle>

          {/* Second dot traveling in reverse */}
          <motion.circle
            r="2.5"
            fill="url(#dotGradient2)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.7, 0] }}
            transition={{
              duration: 3,
              delay: 2,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              begin="2s"
              path="M 340 80 Q 190 -15 40 80"
            />
          </motion.circle>

          {/* Start point glow */}
          <motion.circle
            cx="40"
            cy="80"
            r="3.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <animate
              attributeName="r"
              values="2.5;4;2.5"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;0.3;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill"
              values="#FF4D6A;#6C5CE7;#FF4D6A"
              dur="3s"
              repeatCount="indefinite"
            />
          </motion.circle>

          {/* End point glow */}
          <motion.circle
            cx="340"
            cy="80"
            r="3.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <animate
              attributeName="r"
              values="2.5;4;2.5"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;0.3;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill"
              values="#0984E3;#00B894;#0984E3"
              dur="3s"
              repeatCount="indefinite"
            />
          </motion.circle>

          {/* Gradients */}
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF4D6A" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#6C5CE7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#00B894" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#0984E3" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00CEC9" stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="dotGradient">
              <stop offset="0%" stopColor="#FF4D6A" />
              <stop offset="100%" stopColor="#6C5CE7" />
            </radialGradient>
            <radialGradient id="dotGradient2">
              <stop offset="0%" stopColor="#00B894" />
              <stop offset="100%" stopColor="#0984E3" />
            </radialGradient>
          </defs>
        </svg>

        {/* Center gear/cog icon — represents working together */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 1, type: "spring", stiffness: 200 }}
          className="relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex items-center justify-center"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-accent-purple opacity-40">
              <path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Client Logo */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col items-center gap-3 z-10"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center overflow-hidden shadow-lg">
          {clientLogoUrl ? (
            <Image
              src={clientLogoUrl}
              alt={clientName}
              width={96}
              height={96}
              unoptimized
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="text-3xl sm:text-4xl">
              {getClientEmoji(clientName)}
            </span>
          )}
        </div>
        <span className="text-sm sm:text-base text-[#d4d4d8] font-medium whitespace-nowrap max-w-[140px] truncate">
          {clientName}
        </span>
      </motion.div>
    </motion.div>
  );
}

// Generate a relevant emoji based on client name keywords
function getClientEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("cafe") || lower.includes("café") || lower.includes("coffee")) return "☕";
  if (lower.includes("restaurant") || lower.includes("food") || lower.includes("kitchen")) return "🍽️";
  if (lower.includes("fitness") || lower.includes("gym") || lower.includes("sport")) return "💪";
  if (lower.includes("tech") || lower.includes("software") || lower.includes("digital")) return "💻";
  if (lower.includes("beauty") || lower.includes("salon") || lower.includes("spa")) return "💅";
  if (lower.includes("shop") || lower.includes("store") || lower.includes("retail")) return "🛍️";
  if (lower.includes("health") || lower.includes("medical") || lower.includes("dental")) return "🏥";
  if (lower.includes("real") || lower.includes("estate") || lower.includes("property")) return "🏠";
  if (lower.includes("law") || lower.includes("legal") || lower.includes("attorney")) return "⚖️";
  if (lower.includes("auto") || lower.includes("car") || lower.includes("motor")) return "🚗";
  if (lower.includes("travel") || lower.includes("hotel") || lower.includes("tour")) return "✈️";
  if (lower.includes("music") || lower.includes("band") || lower.includes("record")) return "🎵";
  if (lower.includes("photo") || lower.includes("studio")) return "📸";
  if (lower.includes("pet") || lower.includes("vet") || lower.includes("animal")) return "🐾";
  if (lower.includes("school") || lower.includes("education") || lower.includes("academy")) return "📚";
  if (lower.includes("construction") || lower.includes("build")) return "🏗️";
  if (lower.includes("garden") || lower.includes("flower") || lower.includes("plant")) return "🌿";
  return "🏢";
}
