"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Cpu, Gauge, Network, Sprout, type LucideIcon } from "lucide-react";
import {
  TCK_VISION_HEADING,
  TCK_VISION_PILLARS,
  type VisionPillarIconKey,
} from "@/constants/tckVision";

const iconMap: Record<VisionPillarIconKey, LucideIcon> = {
  gauge: Gauge,
  cpu: Cpu,
  network: Network,
  sprout: Sprout,
};

const cardVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      delay: custom * 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function CoreValuesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-white px-5 py-16 text-neutral-900 sm:px-8 md:py-24"
      aria-labelledby="tck-vision-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,56,120,0.06),transparent)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.header
          className="mx-auto max-w-3xl text-center"
          initial={reduceMotion ? false : { y: 32, opacity: 0 }}
          whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#e31837] sm:text-xs sm:tracking-[0.32em]">
            {TCK_VISION_HEADING.kicker}
          </p>
          <h1
            id="tck-vision-heading"
            className="mt-4 text-4xl font-extrabold tracking-tight text-[#1a2332] sm:text-5xl md:text-6xl"
          >
            {TCK_VISION_HEADING.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#4a5568] md:text-lg md:leading-relaxed">
            {TCK_VISION_HEADING.subtext}
          </p>
        </motion.header>

        <div className="mx-auto mt-4 max-w-xl">
          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-[#003478]/25 to-transparent"
            aria-hidden
          />
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {TCK_VISION_PILLARS.map((pillar, index) => {
            const Icon = iconMap[pillar.icon];
            return (
              <li key={pillar.title} className="list-none">
                <motion.article
                  custom={index}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView={reduceMotion ? undefined : "visible"}
                  viewport={{ once: true, amount: 0.15 }}
                  variants={cardVariants}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -8,
                          transition: {
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                  }
                  className="group flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(0,35,73,0.12)]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#003478] transition-colors duration-300 group-hover:bg-[#e8eef6]">
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                    </span>
                  </div>
                  <h2 className="text-lg font-bold leading-snug tracking-tight text-[#1a2332]">
                    {pillar.title}
                  </h2>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#e31837]">
                    {pillar.sub}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[#5c6570]">
                    {pillar.description}
                  </p>
                </motion.article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
