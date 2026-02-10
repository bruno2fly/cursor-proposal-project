"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import ServiceDetail from "./ServiceDetail";
import type { ServiceTemplate, ServiceDetail as ServiceDetailType } from "@/lib/types";

interface ServiceItem {
  service_id: string;
  custom_summary: string | null;
  service_templates: ServiceTemplate;
}

interface ServicesGridProps {
  services: ServiceItem[];
  proposalId: string;
  onServiceClick?: (serviceId: string) => void;
}

export default function ServicesGrid({
  services,
  onServiceClick,
}: ServicesGridProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceClick = useCallback(
    (serviceId: string) => {
      setSelectedService((prev) => (prev === serviceId ? null : serviceId));
      onServiceClick?.(serviceId);
    },
    [onServiceClick]
  );

  const selectedServiceData = services.find(
    (s) => s.service_id === selectedService
  );

  return (
    <section id="services" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-accent-pink text-sm font-medium uppercase tracking-widest">
            What We Deliver
          </span>
          <h2 className="font-clash text-4xl md:text-5xl font-bold mt-3">
            Our Services
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const t = service.service_templates;
            return (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <ServiceCard
                  icon={t.icon}
                  title={t.title}
                  subtitle={t.subtitle}
                  summary={service.custom_summary || t.summary}
                  color={t.color}
                  isSelected={selectedService === service.service_id}
                  onClick={() => handleServiceClick(service.service_id)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selectedServiceData && (
          <ServiceDetail
            icon={selectedServiceData.service_templates.icon}
            title={selectedServiceData.service_templates.title}
            summary={
              selectedServiceData.custom_summary ||
              selectedServiceData.service_templates.summary
            }
            color={selectedServiceData.service_templates.color}
            details={
              selectedServiceData.service_templates.details as ServiceDetailType[]
            }
            visible={!!selectedService}
          />
        )}
      </div>
    </section>
  );
}
