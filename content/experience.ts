export type ExperienceItem = {
  company: string;
  period: string;
  title?: string;
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Lebrackyard",
    period: "Dec 2023 – present",
    points: [
      "Raised Kretz Real Estate’s Gatsby site PageSpeed from 24 to 89 by rewriting GraphQL and data queries, and adding caching, lazy loading, and minification.",
      "Modernized three legacy projects (Twyny, Atchoum, Nanoé), fixing technical debt across backend, frontend, and infrastructure.",
      "Rebuilt and stabilized Marion Materiaux, migrating the backend to Laravel.",
    ],
  },
  {
    company: "Yanacom",
    period: "Oct 2021 – Dec 2023",
    points: [
      "Rescued three projects abandoned mid-development (Pole Derbi, Hôtel la Vigie, Château de Jau) and delivered all three in 6 weeks with no handover documentation.",
      "Reverse-engineered undocumented codebases as sole developer and prioritized critical fixes to meet deadlines.",
    ],
  },
  {
    company: "Wellcom International",
    period: "Oct 2020 – Oct 2021",
    title: "Full Stack Developer and SEO & Security Specialist",
    points: [
      "Built custom sites and e-commerce (WordPress, PrestaShop) for French clients and owned the full project lifecycle.",
      "Implemented SEO (on-page, schema, analytics) and secured production systems.",
    ],
  },
  {
    company: "Elan By Connect",
    period: "Aug 2020 – Nov 2020",
    points: [
      "Built Laravel and Symfony apps (auth, CMS, database management) and optimized performance.",
      "Worked with cross-functional teams.",
    ],
  },
];
