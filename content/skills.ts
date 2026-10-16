export type SkillGroup = {
  id: string;
  label: string;
  relatedTopics: string[];
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    relatedTopics: ["React", "Next.js"],
    skills: ["React.js", "Next.js", "TypeScript", "Tailwind", "Bootstrap"],
  },
  {
    id: "cms",
    label: "CMS & e-commerce",
    relatedTopics: ["WordPress"],
    skills: ["WordPress", "PrestaShop", "Shopify"],
  },
  {
    id: "backend",
    label: "Backend",
    relatedTopics: ["Laravel"],
    skills: ["Laravel", "Symfony", "Node.js", "Express.js"],
  },
  {
    id: "other",
    label: "Other",
    relatedTopics: ["SEO"],
    skills: ["SEO", "Security", "Performance Optimization"],
  },
  {
    id: "devops",
    label: "DevOps",
    relatedTopics: ["DevOps"],
    skills: ["Linux", "Docker", "CI/CD", "Jenkins", "GitLab/GitHub", "Cloud Hosting"],
  },
  {
    id: "databases",
    label: "Databases",
    relatedTopics: [],
    skills: ["MySQL", "PostgreSQL", "MongoDB"],
  },
];

export function skillMatchesTopic(skill: string, topics: readonly string[]) {
  const haystack = skill.toLowerCase();
  return topics.some((topic) => haystack.includes(topic.toLowerCase()));
}
