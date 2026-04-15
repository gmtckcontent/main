/**
 * TCK 2030 Vision — four pillars. Edit copy here; icons are mapped in CoreValuesSection.
 */
export type VisionPillarIconKey = "gauge" | "cpu" | "network" | "sprout";

export type VisionPillar = {
  title: string;
  sub: string;
  description: string;
  icon: VisionPillarIconKey;
};

export const TCK_VISION_HEADING = {
  kicker: "OUR AMBITION",
  title: "2030 VISION",
  subtext:
    "To become the 'Most Valued Technical Centre' for GM.",
} as const;

export const TCK_VISION_PILLARS: VisionPillar[] = [
  {
    title: "Agility & Excellence",
    sub: "Reliability",
    description:
      "We reliably deliver products our customers crave at speed while improving user experience and quality.",
    icon: "gauge",
  },
  {
    title: "Road to Virtual",
    sub: "Innovation",
    description:
      "Scaling software integration and shifting to virtual-first engineering with AI and next-gen technologies.",
    icon: "cpu",
  },
  {
    title: "Collaborative Ecosystem",
    sub: "Expertise",
    description:
      "Growing a tight-knit network with regional suppliers and universities to enhance global product innovation.",
    icon: "network",
  },
  {
    title: "People & Culture",
    sub: "Growth",
    description:
      "Cultivating a disciplined, multifunctional team that finds enjoyment in pivoting through vehicle development.",
    icon: "sprout",
  },
];
