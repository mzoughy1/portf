export type Project = {
  slug: string;
  title: string;
  context: string;
  period: string;
  problem: string;
  role: string;
  stack: string[];
  result: string;
  /** Public URL from the Supabase `assets` bucket. Leave unset until the file is uploaded. */
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "kretz-real-estate",
    title: "Kretz Real Estate",
    context: "Lebrackyard",
    period: "Dec 2023 – present",
    problem: "The Gatsby site scored 24 on PageSpeed.",
    role: "Rewrote GraphQL and data queries, and added caching, lazy loading, and minification.",
    stack: ["Gatsby", "GraphQL"],
    result: "PageSpeed rose from 24 to 89.",
  },
  {
    slug: "legacy-modernization",
    title: "Twyny, Atchoum, and Nanoé",
    context: "Lebrackyard",
    period: "Dec 2023 – present",
    problem:
      "Three legacy projects carried technical debt across backend, frontend, and infrastructure.",
    role: "Modernized Twyny, Atchoum, and Nanoé.",
    stack: ["Backend", "Frontend", "Infrastructure"],
    result: "Technical debt was addressed across backend, frontend, and infrastructure.",
  },
  {
    slug: "marion-materiaux",
    title: "Marion Materiaux",
    context: "Lebrackyard",
    period: "Dec 2023 – present",
    problem: "The project needed to be rebuilt and stabilized.",
    role: "Rebuilt the project and migrated the backend to Laravel.",
    stack: ["Laravel"],
    result: "The project was stabilized and the backend now runs on Laravel.",
  },
  {
    slug: "mid-build-rescues",
    title: "Pole Derbi, Hôtel la Vigie, and Château de Jau",
    context: "Yanacom",
    period: "Oct 2021 – Dec 2023",
    problem:
      "Three projects had been abandoned mid-development, with no handover documentation.",
    role: "Sole developer. Reverse-engineered the undocumented codebases and prioritized critical fixes.",
    stack: [],
    result: "All three were delivered in 6 weeks.",
  },
  {
    slug: "wellcom-client-sites",
    title: "Custom sites and e-commerce",
    context: "Wellcom International",
    period: "Oct 2020 – Oct 2021",
    problem:
      "French clients needed custom sites and e-commerce, with SEO and production security included.",
    role: "Full Stack Developer and SEO & Security Specialist. Owned the full project lifecycle.",
    stack: ["WordPress", "PrestaShop", "SEO"],
    result:
      "Shipped the sites and shops, implemented on-page SEO, schema, and analytics, and secured production systems.",
  },
  {
    slug: "elan-apps",
    title: "Laravel and Symfony applications",
    context: "Elan By Connect",
    period: "Aug 2020 – Nov 2020",
    problem: "The work covered auth, a CMS, and database management.",
    role: "Built Laravel and Symfony apps, optimized performance, and worked with cross-functional teams.",
    stack: ["Laravel", "Symfony"],
    result:
      "Delivered the auth, CMS, and database management apps, with performance work done alongside cross-functional teams.",
  },
];
