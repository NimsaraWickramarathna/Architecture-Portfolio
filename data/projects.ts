export type Project = {
  id: string;
  slug: string;
  category: string;
  title: string;
  desc: string;
  image: string;
  createdAt: string; // ISO date (latest = biggest date)
};

export const projects: Project[] = [
  {
    id: "p1",
    slug: "modern-residential-complex",
    category: "Residential",
    title: "Modern Residential Complex",
    desc: "A contemporary living space that seamlessly blends form and function, featuring sustainable materials and innovative design solutions.",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-12-20",
  },
  {
    id: "p2",
    slug: "skyline-residential-tower",
    category: "Residential",
    title: "Skyline Residential Tower",
    desc: "A 32-story luxury residential tower featuring sustainable design elements and panoramic city views.",
    image:
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-12-05",
  },
  {
    id: "p3",
    slug: "tech-innovation-campus",
    category: "Commercial",
    title: "Tech Innovation Campus",
    desc: "A modern office complex designed to foster collaboration and innovation in the tech industry.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-11-18",
  },
  {
    id: "p4",
    slug: "urban-loft-renovation",
    category: "Interior",
    title: "Urban Loft Renovation",
    desc: "A complete interior transformation of a historic loft space, blending modern minimalism with warm natural materials.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-10-30",
  },
  {
    id: "p5",
    slug: "lakeside-retreat",
    category: "Residential",
    title: "Lakeside Retreat",
    desc: "A vacation home nestled in nature, featuring large openings, sustainable materials, and smart-home comfort.",
    image:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-09-12",
  },
  {
    id: "p6",
    slug: "sustainable-office-tower",
    category: "Commercial",
    title: "Sustainable Office Tower",
    desc: "A high-rise designed for energy efficiency, daylight optimization, and advanced water recycling systems.",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    createdAt: "2025-08-25",
  },
];
