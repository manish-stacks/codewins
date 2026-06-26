const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

export interface NewsItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

export const news: NewsItem[] = [
  { slug: "meridian-handover", title: "Meridian Bank HQ handed over ahead of schedule", category: "Project News", date: "May 2025", excerpt: "Our two-floor banking headquarters reached completion two weeks early, with a phased move planned around live operations.", image: u("photo-1497366754035-f200968a6e72") },
  { slug: "wellbeing-workplace", title: "Designing for wellbeing in the modern workplace", category: "Insights", date: "Apr 2025", excerpt: "How quiet rooms, daylight and acoustic zoning are reshaping the brief for corporate fit-out projects.", image: u("photo-1524758631624-e2822e304c36") },
  { slug: "regional-expansion", title: "Atrium expands its regional delivery team", category: "Studio", date: "Mar 2025", excerpt: "New hires across project management and M&E strengthen our capacity for cross-border programmes.", image: u("photo-1600880292089-90a7e086ee0c") },
  { slug: "sustainable-fitout", title: "Five ways to lower the carbon cost of a fit-out", category: "Insights", date: "Feb 2025", excerpt: "Material reuse, lean detailing and smarter procurement can cut embodied carbon without cutting quality.", image: u("photo-1503387762-592deb58ef4e") },
];
