export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string; // ISO date for sorting
};

export const blogs: BlogPost[] = [
  {
    id: "b1",
    slug: "future-of-sustainable-architecture",
    category: "Sustainability",
    title: "The Future of Sustainable Architecture",
    excerpt:
      "Exploring innovative materials and design strategies that minimize environmental impact while maximizing aesthetic appeal and functionality.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-12-18",
  },
  {
    id: "b2",
    slug: "biophilic-design-bringing-nature-indoors",
    category: "Design Trends",
    title: "Biophilic Design: Bringing Nature Indoors",
    excerpt:
      "How incorporating natural elements into architectural design enhances well-being and creates more harmonious living spaces.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-12-10",
  },
  {
    id: "b3",
    slug: "urban-planning-for-the-next-generation",
    category: "Urban Design",
    title: "Urban Planning for the Next Generation",
    excerpt:
      "Rethinking city planning to address climate change, population growth, and the evolving needs of modern communities.",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-11-28",
  },
  {
    id: "b4",
    slug: "lighting-strategies-for-modern-interiors",
    category: "Interior Design",
    title: "Lighting Strategies for Modern Interiors",
    excerpt:
      "A practical guide to layered lighting: ambient, task, and accent lighting—plus mistakes to avoid in residential and commercial spaces.",
    image:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-10-22",
  },
  {
    id: "b5",
    slug: "choosing-materials-for-tropical-climates",
    category: "Materials",
    title: "Choosing Materials for Tropical Climates",
    excerpt:
      "What to consider when selecting finishes and structural materials in humid climates—durability, ventilation, and maintenance.",
    image:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-09-15",
  },
];
